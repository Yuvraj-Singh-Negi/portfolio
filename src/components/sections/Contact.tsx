"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fadeUp, staggerContainer, easeOutExpo } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-32" aria-label="Contact">
      <Container>
        <SectionHeading
          title="Get in Touch"
          subtitle="Have a project in mind or just want to say hello?"
        />
      </Container>

      <Container>
        <motion.div
          ref={ref}
          className="mx-auto max-w-xl"
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8"
            variants={fadeUp}
            transition={easeOutExpo}
            noValidate
          >
            <div className="space-y-2">
              <label htmlFor="name" className="block text-small text-zinc-500">
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 text-small text-zinc-100 placeholder-zinc-700 transition-all duration-300 focus:border-white/[0.15] focus:bg-white/[0.03] focus:outline-none focus:ring-0"
                placeholder="Your name"
              />
              {errors.name && (
                <motion.p
                  className="text-xs text-red-400/80"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-small text-zinc-500">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 text-small text-zinc-100 placeholder-zinc-700 transition-all duration-300 focus:border-white/[0.15] focus:bg-white/[0.03] focus:outline-none focus:ring-0"
                placeholder="you@example.com"
              />
              {errors.email && (
                <motion.p
                  className="text-xs text-red-400/80"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-small text-zinc-500">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                {...register("message")}
                className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 text-small text-zinc-100 placeholder-zinc-700 transition-all duration-300 focus:border-white/[0.15] focus:bg-white/[0.03] focus:outline-none focus:ring-0"
                placeholder="Your message..."
              />
              {errors.message && (
                <motion.p
                  className="text-xs text-red-400/80"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                >
                  {errors.message.message}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-zinc-100 px-6 text-small font-medium text-zinc-900 transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.04)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-900"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  Sending
                  <motion.span
                    className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-900"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  />
                </span>
              ) : (
                <>
                  Send Message <Send className="h-4 w-4" />
                </>
              )}
            </button>

            {submitted && (
              <motion.p
                className="text-center text-small text-emerald-400/80"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Thanks for reaching out — I&apos;ll get back to you soon.
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </Container>
    </section>
  );
}
