"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/ui/TextReveal";
import { fadeUp, staggerContainer, defaultTransition } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
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
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-32" aria-label="Contact">
      <Container>
        <TextReveal
          as="h2"
          className="text-section mb-4 text-zinc-100"
          delay={0.1}
        >
          Get in Touch
        </TextReveal>
        <TextReveal
          as="p"
          className="mb-16 max-w-md text-zinc-500"
          delay={0.2}
        >
          Have a project in mind or just want to say hello?
        </TextReveal>
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
            className="space-y-6 rounded-2xl border border-zinc-800/50 bg-[#111111] p-8"
            variants={fadeUp}
            transition={defaultTransition}
            noValidate
          >
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm text-zinc-400">
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-xs text-red-400" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm text-zinc-400">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                {...register("message")}
                className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                placeholder="Your message..."
              />
              {errors.message && (
                <p className="text-xs text-red-400" role="alert">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-100 px-6 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Send Message <Send className="h-4 w-4" />
                </>
              )}
            </button>

            {submitted && (
              <motion.p
                className="text-center text-sm text-emerald-400"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Thanks for reaching out! I&apos;ll get back to you soon.
              </motion.p>
            )}
          </motion.form>
        </motion.div>
      </Container>
    </section>
  );
}
