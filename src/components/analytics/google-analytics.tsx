import Script from "next/script";

/**
 * Google Analytics 4 (gtag.js). Renders nothing unless NEXT_PUBLIC_GA_ID is set,
 * so local dev and preview deploys don't pollute production stats. Loaded
 * `afterInteractive` so it never blocks first paint. GA4 Enhanced Measurement
 * tracks client-side route changes via History events — no manual pageview code.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
