"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { contact } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const topics = [
  "General enquiry",
  "Bulk & wholesale",
  "Order support",
  "Stockist enquiry",
];

const fieldBase =
  "w-full rounded-2xl border border-flamingo-tint bg-white px-4 py-3 text-sm placeholder:text-ink/40 focus:border-flamingo-deep focus:outline-none";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: topics[0],
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Please enter a valid email address";
    if (form.message.trim().length < 10)
      e.message = "Please add a little more detail (10+ characters)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const subject = `${form.topic} — ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\n${form.message}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-flamingo-tint bg-cream/60 px-6 py-16 text-center">
        <CheckCircle2 className="h-12 w-12 text-flamingo-deep" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-wine">
          Thank you!
        </h3>
        <p className="mt-2 max-w-sm text-sm text-ink/65">
          Your message is ready in your email app — just hit send. We usually
          reply within one business day.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setForm({ name: "", email: "", topic: topics[0], message: "" });
            setSent(false);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-wine">
          Name
        </label>
        <Input
          id="name"
          value={form.name}
          onChange={set("name")}
          placeholder="Your name"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-wine">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={set("email")}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="topic" className="mb-1.5 block text-sm font-medium text-wine">
          Topic
        </label>
        <select
          id="topic"
          value={form.topic}
          onChange={set("topic")}
          className={cn(fieldBase, "text-wine")}
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-wine">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          value={form.message}
          onChange={set("message")}
          placeholder="How can we help?"
          aria-invalid={!!errors.message}
          className={cn(fieldBase, "resize-y")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-destructive">{errors.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Send Message
      </Button>
      <p className="text-xs text-ink/50">
        We&apos;ll never share your details. Prefer to reach us directly? Use the
        options on the left.
      </p>
    </form>
  );
}
