"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

// Base field styling WITHOUT a width — width is applied per-field below so
// the conflicting w-full / flex-1 classes never collide in the phone row.
const fieldBase =
  "rounded-xl border border-border bg-background px-3.5 py-2.5 text-[0.95rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";
const inputClass = `w-full ${fieldBase}`;

// Country dial codes — UAE first, then the GCC/region, then other common ones.
const COUNTRIES = [
  { code: "AE", flag: "🇦🇪", dial: "+971", name: "United Arab Emirates" },
  { code: "SA", flag: "🇸🇦", dial: "+966", name: "Saudi Arabia" },
  { code: "QA", flag: "🇶🇦", dial: "+974", name: "Qatar" },
  { code: "KW", flag: "🇰🇼", dial: "+965", name: "Kuwait" },
  { code: "BH", flag: "🇧🇭", dial: "+973", name: "Bahrain" },
  { code: "OM", flag: "🇴🇲", dial: "+968", name: "Oman" },
  { code: "EG", flag: "🇪🇬", dial: "+20", name: "Egypt" },
  { code: "JO", flag: "🇯🇴", dial: "+962", name: "Jordan" },
  { code: "LB", flag: "🇱🇧", dial: "+961", name: "Lebanon" },
  { code: "IQ", flag: "🇮🇶", dial: "+964", name: "Iraq" },
  { code: "SY", flag: "🇸🇾", dial: "+963", name: "Syria" },
  { code: "YE", flag: "🇾🇪", dial: "+967", name: "Yemen" },
  { code: "PS", flag: "🇵🇸", dial: "+970", name: "Palestine" },
  { code: "IN", flag: "🇮🇳", dial: "+91", name: "India" },
  { code: "PK", flag: "🇵🇰", dial: "+92", name: "Pakistan" },
  { code: "BD", flag: "🇧🇩", dial: "+880", name: "Bangladesh" },
  { code: "LK", flag: "🇱🇰", dial: "+94", name: "Sri Lanka" },
  { code: "PH", flag: "🇵🇭", dial: "+63", name: "Philippines" },
  { code: "ID", flag: "🇮🇩", dial: "+62", name: "Indonesia" },
  { code: "TR", flag: "🇹🇷", dial: "+90", name: "Türkiye" },
  { code: "IR", flag: "🇮🇷", dial: "+98", name: "Iran" },
  { code: "GB", flag: "🇬🇧", dial: "+44", name: "United Kingdom" },
  { code: "US", flag: "🇺🇸", dial: "+1", name: "United States" },
  { code: "CA", flag: "🇨🇦", dial: "+1", name: "Canada" },
  { code: "FR", flag: "🇫🇷", dial: "+33", name: "France" },
  { code: "DE", flag: "🇩🇪", dial: "+49", name: "Germany" },
  { code: "IT", flag: "🇮🇹", dial: "+39", name: "Italy" },
  { code: "ES", flag: "🇪🇸", dial: "+34", name: "Spain" },
  { code: "NL", flag: "🇳🇱", dial: "+31", name: "Netherlands" },
  { code: "RU", flag: "🇷🇺", dial: "+7", name: "Russia" },
  { code: "CN", flag: "🇨🇳", dial: "+86", name: "China" },
  { code: "JP", flag: "🇯🇵", dial: "+81", name: "Japan" },
  { code: "AU", flag: "🇦🇺", dial: "+61", name: "Australia" },
  { code: "ZA", flag: "🇿🇦", dial: "+27", name: "South Africa" },
  { code: "NG", flag: "🇳🇬", dial: "+234", name: "Nigeria" },
  { code: "MA", flag: "🇲🇦", dial: "+212", name: "Morocco" },
  { code: "DZ", flag: "🇩🇿", dial: "+213", name: "Algeria" },
  { code: "TN", flag: "🇹🇳", dial: "+216", name: "Tunisia" },
];

/**
 * Contact-us form. Posts to the catalog's /api/contact route, which forwards
 * the submission to the mjqapp manager (stored under this brand).
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [dial, setDial] = useState(COUNTRIES[0].dial);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const localPhone = String(data.get("phone") || "").trim();
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: localPhone ? `${dial} ${localPhone}` : "",
      message: String(data.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.phone || !payload.message) {
      setStatus("error");
      setError("Please fill in all fields.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      form.reset();
      setDial(COUNTRIES[0].dial);
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again or email us directly.");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background px-6 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="text-xl font-semibold tracking-tight">Message sent</h3>
        <p className="max-w-xs text-sm text-muted-foreground">
          Thanks for reaching out — the MJQ team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-1 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-6 text-left"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Name" htmlFor="cf-name">
          <input id="cf-name" name="name" type="text" autoComplete="name" required className={inputClass} placeholder="Your name" />
        </Field>
        <Field label="Phone" htmlFor="cf-phone">
          <div className="flex gap-2">
            <select
              aria-label="Country code"
              value={dial}
              onChange={(e) => setDial(e.target.value)}
              className={`${fieldBase} w-auto shrink-0 pr-1`}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.dial}>
                  {c.flag} {c.dial}
                </option>
              ))}
            </select>
            <input
              id="cf-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              onInput={(e) => {
                const el = e.currentTarget;
                el.value = el.value.replace(/[^\d\s]/g, "");
              }}
              className={`${fieldBase} min-w-0 flex-1`}
              placeholder="50 123 4567"
            />
          </div>
        </Field>
      </div>
      <Field label="Email" htmlFor="cf-email">
        <input id="cf-email" name="email" type="email" autoComplete="email" required className={inputClass} placeholder="you@company.com" />
      </Field>
      <Field label="Message" htmlFor="cf-message">
        <textarea id="cf-message" name="message" required rows={4} className={`${inputClass} resize-none`} placeholder="Tell us how we can help…" />
      </Field>

      {status === "error" && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 disabled:opacity-70"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Send message"
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
