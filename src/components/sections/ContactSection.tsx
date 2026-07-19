import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { personal } from "../../data/personal";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";
import { Button } from "../ui/Button";
import { Mail, FileText, ArrowRight } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactSection: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const tempErrors: Partial<FormData> = {};
    if (!form.name.trim()) tempErrors.name = "Name is required";
    if (!form.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!form.subject.trim()) tempErrors.subject = "Subject is required";
    if (!form.message.trim()) tempErrors.message = "Message is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");

    // NOTE: Replace this with your actual form submission integration (e.g. EmailJS, Formspree, etc.)
    try {
      await new Promise((res) => setTimeout(res, 1200));
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="w-full py-24 px-6 relative bg-transparent">
      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeading
          title="Let's Connect"
          subtitle="Contact"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5"
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-white/40 text-[10px] font-bold tracking-wider uppercase font-mono">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="contact-form-input w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-white/20 text-xs font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                {errors.name && (
                  <span className="text-[10px] text-red-500 font-mono">{errors.name}</span>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="form-label text-white/40 text-[10px] font-bold tracking-wider uppercase font-mono">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="contact-form-input w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-white/20 text-xs font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                {errors.email && (
                  <span className="text-[10px] text-red-500 font-mono">{errors.email}</span>
                )}
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="form-label text-white/40 text-[10px] font-bold tracking-wider uppercase font-mono">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="contact-form-input w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-white/20 text-xs font-mono focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                {errors.subject && (
                  <span className="text-[10px] text-red-500 font-mono">{errors.subject}</span>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="form-label text-white/40 text-[10px] font-bold tracking-wider uppercase font-mono">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="contact-form-input w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder-white/20 text-xs font-mono focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                />
                {errors.message && (
                  <span className="text-[10px] text-red-500 font-mono">{errors.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant={status === "sent" ? "primary" : "glow"}
                className="w-full py-3.5 flex items-center justify-center gap-2"
                disabled={status === "sending" || status === "sent"}
              >
                {status === "idle" && "Send Message"}
                {status === "sending" && "Sending..."}
                {status === "sent" && "Sent Successfully"}
                {status === "error" && "Error. Try again."}
              </Button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <GlassCard glowColor="rgba(59,130,246,0.05)" className="quick-connect-card">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-4">
                Quick Connect
              </h3>

              <div className="space-y-4">
                {[
                  { label: "LinkedIn", href: personal.linkedin, icon: LinkedinIcon, color: "#3B82F6" },
                  { label: "GitHub", href: personal.github, icon: GithubIcon, color: "#ffffff" },
                  { label: "Email", href: `mailto:${personal.email}`, icon: Mail, color: "#EC4899" },
                ].map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={i}
                      href={link.href}
                      target={link.label !== "Email" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="social-link flex items-center gap-3 text-white/50 hover:text-white transition-colors group text-xs font-mono"
                    >
                      <div className="social-link-icon-bg w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
              </div>
            </GlassCard>

            {/* Resume CV download */}
            <a href={personal.cvUrl} download className="block">
              <GlassCard glowColor="rgba(16,185,129,0.05)" className="download-resume text-center group border-emerald-500/10 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02]">
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-white/80 group-hover:text-white font-mono">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Download Resume CV</span>
                </div>
              </GlassCard>
            </a>

            {/* Availability status */}
            <div className="availability-badge flex items-center gap-2.5 px-4 py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase font-mono">
                Open to new opportunities
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default ContactSection;
