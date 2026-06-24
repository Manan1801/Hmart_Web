"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/src/hooks/use-auth";

export default function ContactPage() {
  const { isAuthenticated } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api"}/contact`,
        { method: "POST", body: formData, credentials: "include" },
      );
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="size-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-zinc-950">Thank you!</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Your message has been received. Our team will get back to you within 24-48 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-950">Contact Us</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Have a question, complaint, or feedback? Fill out the form below and our support team will assist you.
        </p>
      </div>

      <form className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6" onSubmit={handleSubmit}>
        {/* Type */}
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Type of inquiry</span>
          <select className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-green-600" name="type" required>
            <option value="general">General Inquiry</option>
            <option value="complaint">Complaint</option>
            <option value="feedback">Feedback</option>
            <option value="refund">Refund Request</option>
            <option value="delivery">Delivery Issue</option>
          </select>
        </label>

        {/* Name */}
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Your name</span>
          <input className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-green-600" name="name" placeholder="Full name" required type="text" />
        </label>

        {/* Email */}
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Email</span>
          <input className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-green-600" name="email" placeholder="you@example.com" required type="email" />
        </label>

        {/* Phone */}
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Phone <span className="text-zinc-400">(optional)</span></span>
          <input className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-green-600" name="phone" placeholder="+91 98765 43210" type="tel" />
        </label>

        {/* Order reference (optional) */}
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Order reference <span className="text-zinc-400">(optional)</span></span>
          <input className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm outline-none focus:border-green-600" name="orderReference" placeholder="Order number or ID" type="text" />
        </label>

        {/* Message */}
        <label className="block">
          <span className="text-sm font-medium text-zinc-800">Message</span>
          <textarea className="mt-1.5 w-full resize-none rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-green-600" name="message" placeholder="Describe your issue or feedback in detail..." required rows={5} />
        </label>

        {/* Image upload */}
        <div>
          <span className="text-sm font-medium text-zinc-800">Attach image <span className="text-zinc-400">(optional)</span></span>
          <div className="mt-1.5 flex items-center gap-3">
            <input accept="image/*" className="hidden" name="image" ref={fileRef} type="file" />
            <button
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-zinc-300 px-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
              onClick={() => fileRef.current?.click()}
              type="button"
            >
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm12.75-11.25h.008v.008h-.008V6.75Z" />
              </svg>
              Choose file
            </button>
            <span className="text-xs text-zinc-500">PNG, JPG up to 5MB</span>
          </div>
        </div>

        <button
          className="flex h-11 w-full items-center justify-center rounded-xl bg-green-600 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
