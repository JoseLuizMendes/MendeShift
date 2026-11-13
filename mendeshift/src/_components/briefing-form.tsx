"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { MessageCircle } from "lucide-react";
import { track } from "@vercel/analytics";

import { useLocale, useTranslations } from "@/i18n/context";
import { localeHref } from "@/lib/navigation";
import { readUtm } from "@/lib/utm";
// lead-options, não leads: leads.ts carrega o zod, que só o servidor precisa.
import {
  budgetRanges,
  leadToWhatsAppText,
  serviceTypes,
  timelines,
  whatsAppLink,
} from "@/lib/lead-options";
import { Button } from "@/_components/ui/button";
import { Card } from "@/_components/ui/card";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Select } from "@/_components/ui/select";
import { Textarea } from "@/_components/ui/textarea";

type Option = { value: string; label: string };

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType: (typeof serviceTypes)[number];
  budgetRange: (typeof budgetRanges)[number];
  timeline: (typeof timelines)[number];
  message: string;
  website?: string;
};

/** Mesmo critério prático do servidor: algo@algo.algo, sem espaços. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "success" | "error" | "rate_limited";

export function BriefingForm() {
  const t = useTranslations("contact_page");
  const locale = useLocale();

  const form = t.raw("form") as Record<string, unknown>;
  const label = (key: string) => form[key] as string;
  const validation = form.validation as Record<string, string>;
  const serviceOptions = form.service_options as Option[];
  const budgetOptions = form.budget_options as Option[];
  const timelineOptions = form.timeline_options as Option[];

  // Validação client-side com as regras nativas do react-hook-form e
  // mensagens localizadas — espelha o schema canônico (src/lib/leads.ts),
  // que revalida tudo no servidor.
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { budgetRange: "nao-sei", timeline: "sem-prazo" },
  });

  const [status, setStatus] = useState<Status>("idle");

  const whatsAppFallback = () =>
    whatsAppLink(leadToWhatsAppText(getValues()));

  const onSubmit = async (values: FormValues) => {
    setStatus("sending");
    try {
      const utm = readUtm();

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          locale,
          source: "form",
          utm,
        }),
      });

      if (response.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!response.ok) {
        throw new Error("lead_failed");
      }
      // Evento de conversão — única métrica que diz se o site vende.
      track("lead_submitted", {
        serviceType: values.serviceType,
        budgetRange: values.budgetRange,
        locale,
      });
      setStatus("success");
    } catch (error) {
      console.error("Briefing form error:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Card
        role="status"
        aria-live="polite"
        className="flex flex-col items-start gap-5 border-accent/40 bg-card/60 p-6 sm:p-10"
      >
        <h2
          ref={(el) => el?.focus()}
          tabIndex={-1}
          className="font-display text-3xl tracking-tight outline-none sm:text-4xl"
        >
          {label("success_title")}
        </h2>
        <p className="max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
          {label("success_text")}
        </p>
        <Button href={whatsAppFallback()} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4" />
          {label("success_whatsapp")}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/60 p-6 sm:p-10">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Honeypot — invisível para humanos; bots preenchem e são descartados */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
          {...register("website")}
        />

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-name">{label("name_label")} *</Label>
          <Input
            id="lead-name"
            required
            autoComplete="name"
            placeholder={label("name_placeholder")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "err-name" : undefined}
            maxLength={120}
            {...register("name", {
              validate: (value) => value.trim().length > 0 || validation.name_required,
            })}
          />
          {errors.name && (
            <p id="err-name" role="alert" className="font-mono text-[10px] text-accent">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-email">{label("email_label")} *</Label>
          <Input
            id="lead-email"
            type="email"
            required
            autoComplete="email"
            placeholder={label("email_placeholder")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "err-email" : undefined}
            maxLength={200}
            {...register("email", {
              validate: (value) => EMAIL_RE.test(value.trim()) || validation.email_invalid,
            })}
          />
          {errors.email && (
            <p id="err-email" role="alert" className="font-mono text-[10px] text-accent">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-phone">{label("phone_label")}</Label>
          <Input id="lead-phone" type="tel" autoComplete="tel" placeholder={label("phone_placeholder")} maxLength={30} {...register("phone")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-company">{label("company_label")}</Label>
          <Input
            id="lead-company"
            autoComplete="organization"
            placeholder={label("company_placeholder")}
            maxLength={120}
            {...register("company")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-service">{label("service_label")} *</Label>
          <Select
            id="lead-service"
            required
            aria-invalid={!!errors.serviceType}
            aria-describedby={errors.serviceType ? "err-service" : undefined}
            defaultValue=""
            {...register("serviceType", { required: validation.service_required })}
          >
            <option value="" disabled>
              {label("service_placeholder")}
            </option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {errors.serviceType && (
            <p id="err-service" role="alert" className="font-mono text-[10px] text-accent">{errors.serviceType.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-budget">{label("budget_label")}</Label>
          <Select id="lead-budget" defaultValue="nao-sei" {...register("budgetRange")}>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="lead-timeline">{label("timeline_label")}</Label>
          <Select id="lead-timeline" defaultValue="sem-prazo" {...register("timeline")}>
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="lead-message">{label("message_label")} *</Label>
          <Textarea
            id="lead-message"
            required
            placeholder={label("message_placeholder")}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "err-message" : undefined}
            maxLength={5000}
            {...register("message", {
              validate: (value) => value.trim().length >= 10 || validation.message_required,
            })}
          />
          {errors.message && (
            <p id="err-message" role="alert" className="font-mono text-[10px] text-accent">{errors.message.message}</p>
          )}
        </div>

        {(status === "error" || status === "rate_limited") && (
          <div className="flex flex-col gap-3 border border-accent/40 bg-accent/5 p-4 sm:col-span-2">
            <p className="font-mono text-xs leading-relaxed text-foreground/90">
              {status === "rate_limited" ? label("rate_limited") : label("error_text")}
            </p>
            <Button
              href={whatsAppFallback()}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start"
            >
              <MessageCircle className="h-4 w-4" />
              {label("error_whatsapp")}
            </Button>
          </div>
        )}

        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground sm:col-span-2">
          {label("privacy_note")}{" "}
          <Link
            href={localeHref("/privacidade", locale)}
            className="text-foreground underline decoration-accent underline-offset-4 transition-colors interaction-motion hover:text-accent"
          >
            {label("privacy_link")}
          </Link>
          .
        </p>

        <div className="sm:col-span-2">
          <Button
            type="submit"
            variant="primary"
            disabled={status === "sending"}
            className="h-12 px-8"
          >
            {status === "sending" ? label("sending") : label("submit")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
