/** Tracking abstraction: forwards events to GTM dataLayer, GA4 (gtag) and Meta Pixel (fbq) when present. */

export type TrackingEvent =
  | "quiz_started"
  | "quiz_question_answered"
  | "quiz_completed"
  | "result_viewed"
  | "offer_viewed"
  | "checkout_clicked";

type Params = Record<string, string | number | boolean>;

interface TrackingWindow {
  dataLayer?: unknown[];
  gtag?: (cmd: "event", name: string, params?: Params) => void;
  fbq?: (cmd: "trackCustom", name: string, params?: Params) => void;
}

export function track(event: TrackingEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as TrackingWindow;
  try {
    w.dataLayer?.push({ event, ...params });
    w.gtag?.("event", event, params);
    w.fbq?.("trackCustom", event, params);
  } catch {
    // Tracking must never break the funnel.
  }
}
