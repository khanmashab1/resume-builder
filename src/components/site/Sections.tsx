import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, FileDown, Eye, Palette, Gauge, Star, Quote, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const features = [
  { icon: Sparkles, title: "AI Resume Writing", desc: "Generate compelling bullet points and summaries tailored to your role." },
  { icon: ShieldCheck, title: "ATS-Friendly Templates", desc: "Designed and tested to pass Applicant Tracking Systems." },
  { icon: FileDown, title: "PDF Export", desc: "Pixel-perfect, print-ready PDFs in one click." },
  { icon: Eye, title: "Real-Time Preview", desc: "See every change live as you type." },
  { icon: Palette, title: "Multiple Themes", desc: "Modern, Corporate, Minimal and Creative — switch instantly." },
  { icon: Gauge, title: "Resume Scoring", desc: "Get an instant score with actionable feedback." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="Features" title="Everything you need to land the interview" subtitle="A polished toolkit built around best practices used by professional resume writers." />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-elegant">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const templates = [
  { name: "Modern", accent: "from-primary to-primary-glow" },
  { name: "Corporate", accent: "from-navy to-primary" },
  { name: "Minimal", accent: "from-muted-foreground/40 to-foreground/70" },
  { name: "Creative", accent: "from-accent to-primary-glow" },
];

export function Templates() {
  return (
    <section id="templates" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Templates" title="Beautiful templates, tested by recruiters" subtitle="Choose from a curated library and customize colors, fonts and layout." />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className={`relative aspect-[3/4] bg-gradient-to-br ${t.accent}`}>
                <div className="absolute inset-4 rounded-xl bg-card/95 p-4">
                  <div className="h-2.5 w-20 rounded gradient-primary" />
                  <div className="mt-1.5 h-1.5 w-16 rounded bg-muted-foreground/40" />
                  <div className="mt-3 space-y-1">
                    <div className="h-1.5 rounded bg-muted-foreground/30" />
                    <div className="h-1.5 w-10/12 rounded bg-muted-foreground/30" />
                  </div>
                  {[0,1,2].map(i => (
                    <div key={i} className="mt-3">
                      <div className="h-1.5 w-12 rounded bg-primary/70" />
                      <div className="mt-1 space-y-1">
                        <div className="h-1.5 rounded bg-muted-foreground/25" />
                        <div className="h-1.5 w-9/12 rounded bg-muted-foreground/25" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="font-medium">{t.name}</span>
                <Button size="sm" variant="ghost" asChild>
                  <Link to="/builder">Use template</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { n: "01", title: "Enter your information", desc: "Fill out a guided multi-step form with smart suggestions." },
    { n: "02", title: "Choose a template", desc: "Pick from premium templates and customize the look." },
    { n: "03", title: "Download your resume", desc: "Export a polished, ATS-friendly PDF in one click." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="How it works" title="From blank page to hired in 3 steps" />
      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        <div className="absolute inset-x-12 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative rounded-2xl border border-border/60 bg-card p-7 shadow-soft"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-primary text-primary-foreground font-semibold shadow-elegant">{s.n}</div>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const reviews = [
  { name: "Sarah Chen", role: "Product Designer @ Stripe", text: "I revamped my resume in under 30 minutes and got 3 callbacks the same week. The AI suggestions are spot on." },
  { name: "Marcus Johnson", role: "Senior Engineer @ Meta", text: "The ATS score helped me catch issues I would have missed. Cleanest builder I've used by far." },
  { name: "Priya Patel", role: "Marketing Lead @ Notion", text: "Beautiful templates, lightning-fast preview, and the export is flawless. Worth every penny." },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Loved by professionals" title="Trusted by 50,000+ job seekers" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft"
            >
              <Quote className="h-6 w-6 text-primary/40" />
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{r.text}</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-primary-foreground text-sm font-semibold">
                  {r.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.role}</div>
                </div>
                <div className="ml-auto flex">
                  {Array.from({length: 5}).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const plans = [
  { name: "Free", price: "$0", desc: "For getting started", features: ["1 resume", "Basic templates", "PDF export"], cta: "Start free" },
  { name: "Pro", price: "$9", featured: true, desc: "For active job seekers", features: ["Unlimited resumes", "All premium templates", "AI writing assistant", "ATS score & tips"], cta: "Go Pro" },
  { name: "Premium", price: "$19", desc: "For serious career growth", features: ["Everything in Pro", "Cover letter builder", "LinkedIn import", "Priority support"], cta: "Go Premium" },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="Pricing" title="Simple, transparent pricing" subtitle="Start for free. Upgrade when you're ready." />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`relative rounded-2xl border p-7 ${p.featured ? "border-primary/40 bg-card shadow-elegant scale-[1.02]" : "border-border/60 bg-card shadow-soft"}`}
          >
            {p.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-elegant">Most popular</div>
            )}
            <div className="text-sm font-medium text-muted-foreground">{p.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-accent" /> {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className={`mt-7 w-full ${p.featured ? "gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant" : ""}`}
              variant={p.featured ? "default" : "outline"}
            >
              <Link to="/builder">{p.cta}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary">
              <span className="text-primary-foreground text-sm">R</span>
            </span>
            Resumely
          </div>
          <p className="mt-3 text-sm text-muted-foreground">The premium AI-powered resume builder loved by professionals worldwide.</p>
        </div>
        {[
          { title: "Product", links: ["Features", "Templates", "Pricing", "Examples"] },
          { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
          { title: "Resources", links: ["Help center", "Guides", "Privacy", "Terms"] },
        ].map(col => (
          <div key={col.title}>
            <div className="text-sm font-semibold">{col.title}</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {col.links.map(l => <li key={l}><a href="#" className="hover:text-foreground transition">{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Resumely. Crafted with care.
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-medium text-primary">{eyebrow}</div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
