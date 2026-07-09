/**
 * Turns the backend's error envelope into a rich, user-facing error.
 *
 * The API wraps everything as `{ error: { code, message, details } }`. For
 * serializer validation failures the top-level `message` is a generic
 * "Validation failed." and the *real* problem lives in `details` (DRF's nested
 * field errors). Reading only `message` is why users saw "Validation failed."
 * instead of "Email: Enter a valid email address." This module fixes that by
 * flattening `details` and naming the offending fields.
 */

export type FieldErrors = Record<string, string>;

// Human labels for known field paths (last path segment wins).
const FIELD_LABELS: Record<string, string> = {
  name: "Full name",
  full_name: "Full name",
  line1: "Address line 1",
  line2: "Address line 2",
  city: "City",
  region: "State / region",
  postal_code: "Postal code",
  country: "Country",
  phone: "Phone number",
  email: "Email",
  contact: "Contact details",
  shipping: "Shipping address",
  address_id: "Saved address",
  currency: "Currency",
  code: "Coupon code",
  quantity: "Quantity",
  rating: "Rating",
  non_field_errors: "",
  detail: "",
};

function humanize(key: string): string {
  return key.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/** Human label for a dotted field path, e.g. "shipping.city" -> "City". */
export function fieldLabel(path: string): string {
  const last = path.split(".").pop() ?? path;
  return FIELD_LABELS[last] ?? humanize(last);
}

/**
 * Flatten DRF-style nested errors into `{ "dotted.path": "first message" }`.
 * Handles: `"msg"`, `["msg", …]`, `{ field: … }`, and arbitrary nesting.
 */
export function flattenFieldErrors(details: unknown, prefix = ""): FieldErrors {
  const out: FieldErrors = {};
  if (details == null) return out;

  if (typeof details === "string") {
    if (prefix) out[prefix] = details;
    return out;
  }
  if (Array.isArray(details)) {
    const firstString = details.find((d) => typeof d === "string") as
      | string
      | undefined;
    if (firstString !== undefined && prefix) {
      out[prefix] = firstString;
    } else {
      details.forEach((d, i) =>
        Object.assign(out, flattenFieldErrors(d, prefix || String(i))),
      );
    }
    return out;
  }
  if (typeof details === "object") {
    for (const [key, value] of Object.entries(details as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${key}` : key;
      Object.assign(out, flattenFieldErrors(value, path));
    }
  }
  return out;
}

/** One readable sentence naming up to three offending fields. */
export function summarizeFieldErrors(fields: FieldErrors): string {
  const parts = Object.entries(fields).map(([path, msg]) => {
    const label = fieldLabel(path);
    return label ? `${label}: ${msg}` : msg;
  });
  const shown = parts.slice(0, 3).join(" · ");
  return parts.length > 3 ? `${shown} …` : shown;
}

// Backend "summary" messages that carry no real information for the user.
const GENERIC_MESSAGES = new Set([
  "Validation failed.",
  "A domain error occurred.",
  "An error occurred.",
  "Invalid input.",
]);

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;
  readonly fieldErrors: FieldErrors;

  constructor(opts: {
    status: number;
    code: string;
    message: string;
    details?: unknown;
    fieldErrors: FieldErrors;
  }) {
    super(opts.message);
    this.name = "ApiError";
    this.status = opts.status;
    this.code = opts.code;
    this.details = opts.details;
    this.fieldErrors = opts.fieldErrors;
  }

  /** The first error tied to any of the given field-path prefixes. */
  fieldErrorFor(...prefixes: string[]): string | undefined {
    for (const [path, msg] of Object.entries(this.fieldErrors)) {
      if (prefixes.some((p) => path === p || path.startsWith(`${p}.`)))
        return `${fieldLabel(path)}: ${msg}`.replace(/^: /, "");
    }
    return undefined;
  }
}

/** Convert a failed `fetch` Response into a user-friendly ApiError. */
type ErrorBody = {
  error?: { code?: string; message?: string; details?: unknown };
};

export async function parseApiError(res: Response): Promise<ApiError> {
  let body: ErrorBody | null = null;
  try {
    body = (await res.json()) as ErrorBody;
  } catch {
    /* non-JSON body */
  }
  const err = body?.error ?? {};
  const code = String(err.code ?? "error");
  const details = err.details;
  const fieldErrors = flattenFieldErrors(details);

  let message = typeof err.message === "string" ? err.message : "";
  // Replace a generic summary with the actual field problems.
  if ((!message || GENERIC_MESSAGES.has(message)) && Object.keys(fieldErrors).length) {
    message = summarizeFieldErrors(fieldErrors);
  }
  if (!message) {
    message =
      res.status === 401
        ? "Please sign in to continue."
        : res.status === 403
          ? "You don’t have permission to do that."
          : res.status === 404
            ? "We couldn’t find that."
            : res.status === 409
              ? "That conflicts with the current state — please refresh and try again."
              : res.status >= 500
                ? "Something went wrong on our end. Please try again in a moment."
                : `Request failed (${res.status}).`;
  }
  return new ApiError({ status: res.status, code, message, details, fieldErrors });
}

/** Safe message extraction for toasts/banners. */
export function errorMessage(e: unknown, fallback = "Something went wrong."): string {
  if (e instanceof ApiError) return e.message;
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}
