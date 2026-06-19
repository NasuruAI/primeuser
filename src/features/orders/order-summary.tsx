import type { Order } from "@/types/order";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending payment",
  paid: "Paid",
  routing: "Routing",
  partially_fulfilled: "Partially fulfilled",
  fulfilled: "Fulfilled",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function money(amount: string, currency: string): string {
  return `${currency} ${amount}`;
}

export function OrderSummary({ order }: { order: Order }) {
  return (
    <div className="flex flex-col gap-4 border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-semibold text-ink">Order {order.number}</div>
          <div className="text-xs text-ink/45">
            {new Date(order.created_at).toLocaleString()}
          </div>
        </div>
        <span className="bg-primary-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        {order.lines.map((l) => (
          <div key={l.id} className="flex justify-between">
            <span className="text-ink">
              {l.title} <span className="text-ink/40">×{l.quantity}</span>
            </span>
            <span className="text-ink">
              {money(l.line_total_charged, order.currency)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t border-ink/10 pt-3 font-semibold text-ink">
        <span>Total</span>
        <span>{money(order.total_charged, order.currency)}</span>
      </div>

      {order.currency !== order.base_currency && (
        <p className="text-xs text-ink/55">
          Charged in {order.currency} at a locked rate of{" "}
          {Number(order.fx_rate_locked).toFixed(4)} (base {order.base_currency}{" "}
          {order.total_base}).
        </p>
      )}
      {order.paid_by_label && (
        <p className="text-xs text-ink/55">
          Paid by {order.paid_by_label}.
        </p>
      )}

      {order.shipments.length > 0 && (
        <div className="border-t border-ink/10 pt-3">
          <div className="mb-1 text-xs font-medium text-ink/55">
            Shipments
          </div>
          {order.shipments.map((s, i) => (
            <div
              key={i}
              className="flex justify-between text-xs text-ink/70"
            >
              <span className="capitalize">
                {s.kind} · {s.status}
              </span>
              {s.tracking_number && (
                <span>
                  {s.carrier} {s.tracking_number}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
