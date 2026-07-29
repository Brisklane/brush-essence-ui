"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FormField, FormTextarea } from "@/components/forms";
import { Button } from "@/components/ui";
import { siteConfig } from "@/config/site";

const supportSchema = z.object({
  name: z.string().trim().min(1, "Your name is required.").max(120),
  email: z.email("Enter a valid email address."),
  subject: z.string().trim().min(1, "Please add a subject.").max(150),
  message: z.string().trim().min(1, "Please describe your issue.").max(4000),
});

type SupportValues = z.infer<typeof supportSchema>;

/**
 * Support contact form. On submit it composes a pre-filled email and opens the
 * visitor's mail app addressed to the configured support inbox — so no email
 * server is needed (the message is sent from the visitor's own client).
 */
export function SupportForm() {
  const [opened, setOpened] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupportValues>({ resolver: zodResolver(supportSchema) });

  function onSubmit(values: SupportValues) {
    const body = `From: ${values.name} <${values.email}>\n\n${values.message}`;
    const mailto = `mailto:${siteConfig.supportEmail}?subject=${encodeURIComponent(
      values.subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.assign(mailto);
    setOpened(true);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {opened ? (
        <p className="bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300 rounded-md px-3 py-2 text-sm">
          Your email app should have opened with your message ready to send. If
          it didn&apos;t, email us directly at{" "}
          <a
            href={`mailto:${siteConfig.supportEmail}`}
            className="font-medium underline"
          >
            {siteConfig.supportEmail}
          </a>
          .
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="support-name"
          label="Your name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="support-email"
          label="Your email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <FormField
        id="support-subject"
        label="Subject"
        placeholder="e.g. Question about my order"
        error={errors.subject?.message}
        {...register("subject")}
      />

      <FormTextarea
        id="support-message"
        label="How can we help?"
        rows={6}
        placeholder="Tell us what's going on and we'll get back to you."
        error={errors.message?.message}
        {...register("message")}
      />

      <Button type="submit" size="lg" className="self-start">
        Send message
      </Button>
    </form>
  );
}
