"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-[0.95rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";

/**
 * Contact-us form. Posts to the catalog's /api/contact route, which forwards
 * the submission to the mjqapp manager (stored under this brand).
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      message: String(data.get("message") || "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setError("Please fill in your name, email and message.");
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
          <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} placeholder="+971 …" />
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
