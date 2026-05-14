import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="absolute inset-0 grid-pattern opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            AI-powered resume builder
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-5xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Create a Professional Resume in <span className="text-gradient">Minutes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            Build ATS-friendly resumes with AI assistance and beautiful templates loved by recruiters at top companies.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" asChild className="gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">
              <Link to="/builder">Create Resume <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#templates">View Templates</a>
            </Button>
          </motion.div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-muted-foreground">
            {["No credit card", "ATS-optimized", "Free PDF export"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-accent" /> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Animated mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-6 rounded-3xl gradient-primary opacity-30 blur-3xl" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-[3/4] rounded-2xl bg-card shadow-elegant border border-border/60 overflow-hidden"
          >
            <div className="h-2 gradient-primary" />
            <div className="p-7">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full gradient-primary" />
                <div className="flex-1">
                  <div className="h-3.5 w-32 rounded bg-foreground/80" />
                  <div className="mt-1.5 h-2 w-24 rounded bg-muted-foreground/40" />
                </div>
              </div>
              <div className="mt-6 space-y-1.5">
                <div className="h-2 rounded bg-muted-foreground/30" />
                <div className="h-2 w-11/12 rounded bg-muted-foreground/30" />
                <div className="h-2 w-9/12 rounded bg-muted-foreground/30" />
              </div>
              {[0, 1, 2].map((i) => (
                <div key={i} className="mt-6">
                  <div className="h-2.5 w-24 rounded bg-primary/80" />
                  <div className="mt-2 space-y-1.5">
                    <div className="h-2 rounded bg-muted-foreground/25" />
                    <div className="h-2 w-10/12 rounded bg-muted-foreground/25" />
                    <div className="h-2 w-8/12 rounded bg-muted-foreground/25" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-6 top-10 hidden rounded-xl border border-border/70 bg-card/90 px-3 py-2 text-xs shadow-soft backdrop-blur md:block"
          >
            <div className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-accent" /> AI suggestion</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -right-4 bottom-12 hidden rounded-xl border border-border/70 bg-card/90 px-3 py-2 text-xs shadow-soft backdrop-blur md:block"
          >
            <div className="font-semibold text-accent">ATS Score 96</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
