"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Send, Loader2, CheckCircle2, Activity } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import QuantumCard from "@/components/ui/QuantumCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quantumVariants, viewport } from "@/lib/animations";

/**
 * SECTION 07 — MAKE CONTACT
 * A fullstack form: signals POST to /api/inquiries (Prisma + SQLite),
 * and a live counter shows how many "measurements" have collapsed so far.
 */

const formSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  org: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address"),
  interest: z.enum(["funding", "partnership", "join", "other"]),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters")
    .max(2000),
});

type FormValues = z.infer<typeof formSchema>;

const INTEREST_OPTIONS = [
  { value: "funding", label: "Seed Funding ($50K)" },
  { value: "partnership", label: "Industry Partnership" },
  { value: "join", label: "Join the Team (|0⟩ / |1⟩)" },
  { value: "other", label: "Something Else" },
] as const;

function SignalCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data: { ok: boolean; total?: number }) => {
        if (!cancelled && data.ok && typeof data.total === "number") {
          setTotal(data.total);
        }
      })
      .catch(() => {
        /* the counter stays in superposition */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-2.5 rounded-full border border-quantum-green/30 bg-quantum-green/10 px-5 py-2.5 mb-10 w-fit mx-auto">
      <motion.span
        animate={{ opacity: [1, 0.35, 1] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="relative flex size-2.5"
      >
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-quantum-green opacity-60" />
        <span className="relative inline-flex size-2.5 rounded-full bg-quantum-green" />
      </motion.span>
      <span className="font-mono text-xs tracking-wider text-quantum-green">
        {total === null
          ? "SIGNAL SCANNING…"
          : `${total} SIGNAL${total === 1 ? "" : "S"} RECEIVED — YOU'D BE MEASUREMENT #${total + 1}`}
      </span>
    </div>
  );
}

export default function ContactSection() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      org: "",
      email: "",
      interest: "funding",
      message: "",
    },
  });

  const interest = watch("interest");

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: { ok: boolean; error?: string } = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Transmission failed");
      }

      setSubmitted(true);
      reset();
      toast({
        title: "Signal received ✅",
        description:
          "Your measurement collapsed into an email in our inbox — we reply within 48 hours.",
      });
    } catch (err) {
      toast({
        title: "Decoherence detected",
        description:
          err instanceof Error ? err.message : "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32" aria-label="Contact the lab">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-quantum-blue/30 to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="SECTION 07 — MAKE CONTACT"
          title="Collapse the Wavefunction"
          subtitle="Every partnership starts as a signal. Send yours — funding, industry pilots, or one of the two open founding seats."
        />

        <SignalCounter />

        <motion.div
          variants={quantumVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <QuantumCard accent="#00D9FF" className="p-6 md:p-10">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center py-10"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14 }}
                    className="mb-5 flex size-20 items-center justify-center rounded-full bg-quantum-green/15 border border-quantum-green/40"
                  >
                    <CheckCircle2 className="size-10 text-quantum-green" aria-hidden="true" />
                  </motion.span>
                  <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
                    Signal Received
                  </h3>
                  <p className="mt-3 max-w-md text-quantum-subtle">
                    Your inquiry collapsed into a row in our lab database. A
                    human (a real one, we checked) will reply within 48 hours.
                  </p>
                  <Button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="mt-7 border-quantum-blue/50 bg-transparent text-quantum-blue hover:bg-quantum-blue/10 hover:text-quantum-blue"
                  >
                    Send another signal
                  </Button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="grid gap-5 md:grid-cols-2"
                  aria-label="Partnership inquiry form"
                >
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-quantum-text">
                      Name <span className="text-quantum-red">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Dr. Ahmed Hassan"
                      aria-invalid={!!errors.name}
                      className="bg-quantum-navy/60 border-white/10 focus-visible:ring-quantum-blue/60"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-xs text-quantum-red">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-quantum-text">
                      Email <span className="text-quantum-red">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@agency.org"
                      aria-invalid={!!errors.email}
                      className="bg-quantum-navy/60 border-white/10 focus-visible:ring-quantum-blue/60"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-quantum-red">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <Label htmlFor="org" className="text-quantum-text">
                      Organization{" "}
                      <span className="text-quantum-subtle text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="org"
                      placeholder="ASRT · ITIDA · IBM · …"
                      className="bg-quantum-navy/60 border-white/10 focus-visible:ring-quantum-blue/60"
                      {...register("org")}
                    />
                  </div>

                  {/* Interest */}
                  <div className="space-y-2">
                    <Label htmlFor="interest" className="text-quantum-text">
                      I'm interested in
                    </Label>
                    <input type="hidden" {...register("interest")} />
                    <Select
                      value={interest}
                      onValueChange={(v) =>
                        setValue("interest", v as FormValues["interest"], {
                          shouldValidate: true,
                        })
                      }
                    >
                      <SelectTrigger
                        id="interest"
                        className="w-full bg-quantum-navy/60 border-white/10 data-[placeholder]:text-quantum-subtle"
                      >
                        <SelectValue placeholder="Choose a channel" />
                      </SelectTrigger>
                      <SelectContent className="bg-quantum-secondary border-quantum-blue/20">
                        {INTEREST_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="message" className="text-quantum-text">
                      Message <span className="text-quantum-red">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      rows={5}
                      placeholder="Tell us how you'd like to entangle with the lab…"
                      aria-invalid={!!errors.message}
                      className="resize-none bg-quantum-navy/60 border-white/10 focus-visible:ring-quantum-blue/60"
                      {...register("message")}
                    />
                    <div className="flex items-center justify-between">
                      {errors.message ? (
                        <p className="text-xs text-quantum-red">
                          {errors.message.message}
                        </p>
                      ) : (
                        <p className="text-xs text-quantum-subtle flex items-center gap-1.5">
                          <Radio className="size-3" aria-hidden="true" />
                          Encrypted in transit · stored in our lab database only
                        </p>
                      )}
                      <span className="font-mono text-[10px] text-quantum-subtle tabular-nums">
                        {watch("message")?.length ?? 0}/2000
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <p className="font-mono text-[11px] text-quantum-subtle flex items-center gap-2">
                      <Activity className="size-3.5 text-quantum-green" aria-hidden="true" />
                      avg. response time: 48h
                    </p>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto h-12 rounded-xl bg-quantum-blue px-8 font-heading font-bold text-quantum-navy hover:bg-[#33e1ff] hover:shadow-[0_0_28px_rgba(0,217,255,0.5)] disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                          Transmitting…
                        </>
                      ) : (
                        <>
                          <Send className="size-4" aria-hidden="true" />
                          Transmit Signal
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </QuantumCard>
        </motion.div>
      </div>
    </section>
  );
}
