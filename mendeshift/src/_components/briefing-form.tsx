"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircle } from "lucide-react";
import { track } from "@vercel/analytics";

import { useLocale, useTranslations } from "@/i18n/context";
import {
  budgetRanges,
  leadToWhatsAppText,
  serviceTypes,
  timelines,
  whatsAppLink,
  type Lead,
} from "@/lib/leads";
import { ActionLink } from "@/_components/ui/action-link";
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

  // Validação client-side com mensagens localizadas; o schema canônico
  // (src/lib/leads.ts) revalida no servidor.
  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, validation.name_required),
        email: z.string().trim().email(validation.email_invalid),
        phone: z.string().trim().max(30).optional(),
        company: z.string().trim().max(120).optional(),
        serviceType: z.enum(serviceTypes, { message: validation.service_required }),
        budgetRange: z.enum(budgetRanges),
        timeline: z.enum(timelines),
        message: z.string().trim().min(10, validation.message_required),
        website: z.string().optional(),
      }),
    [validation],
  );

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { budgetRange: "nao-sei", timeline: "sem-prazo" },
  });

  const [status, setStatus] = useState<Status>("idle");

  const whatsAppFallback = () =>
    whatsAppLink(leadToWhatsAppText(getValues() as Partial<Lead>));

  const onSubmit = async (values: FormValues) => {
    setStatus("sending");
    try {
      const utmParams = new URLSearchParams(window.location.search);
      const utm = {
        source: utmParams.get("utm_source") ?? undefined,
        medium: utmParams.get("utm_medium") ?? undefined,
        campaign: utmParams.get("utm_campaign") ?? undefined,
      };

      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          locale,
          source: "form",
          utm: utm.source || utm.medium || utm.campaign ? utm : undefined,
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
      <Card className="flex flex-col items-start gap-5 border-accent/40 bg-card/60 p-6 sm:p-10">
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          {label("success_title")}
        </h2>
        <p className="max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
          {label("success_text")}
        </p>
        <ActionLink href={whatsAppFallback()} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4" />
          {label("success_whatsapp")}
        </ActionLink>
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
          <Label htmlFor="lead-name">{label("name_label")}</Label>
          <Input
            id="lead-name"
            placeholder={label("name_placeholder")}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="font-mono text-[10px] text-accent">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-email">{label("email_label")}</Label>
          <Input
            id="lead-email"
            type="email"
            placeholder={label("email_placeholder")}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="font-mono text-[10px] text-accent">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-phone">{label("phone_label")}</Label>
          <Input id="lead-phone" placeholder={label("phone_placeholder")} {...register("phone")} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-company">{label("company_label")}</Label>
          <Input
            id="lead-company"
            placeholder={label("company_placeholder")}
            {...register("company")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-service">{label("service_label")}</Label>
          <Select id="lead-service" aria-invalid={!!errors.serviceType} defaultValue="" {...register("serviceType")}>
            <option value="" disabled>
              —
            </option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          {errors.serviceType && (
            <p className="font-mono text-[10px] text-accent">{errors.serviceType.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-budget">{label("budget_label")}</Label>
          <Select id="lead-budget" {...register("budgetRange")}>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="lead-timeline">{label("timeline_label")}</Label>
          <Select id="lead-timeline" {...register("timeline")}>
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="lead-message">{label("message_label")}</Label>
          <Textarea
            id="lead-message"
            placeholder={label("message_placeholder")}
            aria-invalid={!!errors.message}
            {...register("message")}
          />
          {errors.message && (
            <p className="font-mono text-[10px] text-accent">{errors.message.message}</p>
          )}
        </div>

        {(status === "error" || status === "rate_limited") && (
          <div className="flex flex-col gap-3 rounded-2xl border border-accent/40 bg-accent/5 p-4 sm:col-span-2">
            <p className="font-mono text-xs leading-relaxed text-foreground/90">
              {status === "rate_limited" ? label("rate_limited") : label("error_text")}
            </p>
            <ActionLink
              href={whatsAppFallback()}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start"
            >
              <MessageCircle className="h-4 w-4" />
              {label("error_whatsapp")}
            </ActionLink>
          </div>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-accent px-8 font-mono text-xs uppercase tracking-widest text-accent-foreground transition-all hover:scale-[1.01] hover:bg-accent/90 disabled:opacity-50 disabled:hover:scale-100"
          >
            {status === "sending" ? label("sending") : label("submit")}
          </button>
        </div>
      </form>
    </Card>
  );
}
