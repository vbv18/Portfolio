import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, Mail, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { contactSchema, type ContactSchema } from "@/lib/validation";
import { sendContactMessage, ContactApiError } from "@/services/contact";
import { profile } from "@/data/profile";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/dom";

export function Contact() {
  const [copied, setCopied] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactSchema>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactSchema) => {
    try {
      await sendContactMessage(values);
      toast.success("Message sent — thanks for reaching out.");
      reset();
    } catch (err) {
      const message =
        err instanceof ContactApiError
          ? err.message
          : "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(profile.email);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <section id="contact" className="container-page py-24 md:py-32">
      <SectionHeading
        eyebrow="Contact"
        title="Let's build something."
        description="Open to Software Engineering and AI Engineering roles — reach out directly or send a message."
      />

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="space-y-4">
            <Card className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-accent">
                  <Mail size={16} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    Email
                  </p>
                  <p className="text-sm text-ink">{profile.email}</p>
                </div>
              </div>
              <button
                onClick={handleCopy}
                aria-label="Copy email address"
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border text-muted transition-colors hover:text-accent"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </Card>

            <Card className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-border text-accent">
                <MapPin size={16} strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
                  Location
                </p>
                <p className="text-sm text-ink">{profile.location}</p>
              </div>
            </Card>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <Card>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              {/* Honeypot field — hidden from real users, catches simple bots */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
                {...register("company")}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  {...register("subject")}
                />
                {errors.subject && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell me a bit more..."
                  {...register("message")}
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                <Send size={14} strokeWidth={1.75} />
                {isSubmitting ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
