import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, FileText, GraduationCap, Briefcase, Sparkles, Languages, FolderGit2, Award,
  Plus, Trash2, Download, Printer, ChevronLeft, Moon, Sun, Palette, Wand2, Gauge,
  Camera, LogOut, ShieldCheck, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ResumePreview } from "@/components/builder/ResumePreview";
import { defaultResume, emptyResume, type ResumeData, type Theme, themeAccents } from "@/components/builder/types";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Resume Builder — Resumely" },
      { name: "description", content: "Build your resume with live preview, AI suggestions and one-click PDF export." },
    ],
  }),
  component: BuilderPage,
});

const sections = [
  { id: "personal", label: "Personal", icon: User },
  { id: "summary", label: "About Me", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "certifications", label: "Certifications", icon: Award },
] as const;

type SectionId = typeof sections[number]["id"];

const themes: { id: Theme; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "corporate", label: "Corporate" },
  { id: "minimal", label: "Minimal" },
  { id: "creative", label: "Creative" },
];

const accentSwatches = ["#2563EB", "#0F172A", "#14B8A6", "#9333EA", "#F97316", "#DC2626"];

function BuilderPage() {
  const navigate = useNavigate();
  const { isAdmin, user, signOut } = useAuth();
  const [data, setData] = useState<ResumeData>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("resumely:data");
      if (stored) try { return { ...defaultResume, ...JSON.parse(stored) }; } catch {}
    }
    return defaultResume;
  });
  const [active, setActive] = useState<SectionId>("personal");
  const [theme, setTheme] = useState<Theme>("modern");
  const [accent, setAccent] = useState<string | undefined>();
  const [dark, setDark] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("resumely:id");
    return null;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Auto-save: localStorage immediate
  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem("resumely:data", JSON.stringify(data));
    }, 400);
    return () => clearTimeout(t);
  }, [data]);

  // Auto-save to DB (anonymous allowed) — debounced + guarded against duplicate inserts
  const saveTimer = useRef<number | null>(null);
  const insertingRef = useRef(false);
  const firstRunRef = useRef(true);
  useEffect(() => {
    if (firstRunRef.current) { firstRunRef.current = false; return; }
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      const payload: any = { data: data as any, theme, accent: accent ?? null };
      if (user) payload.user_id = user.id;
      if (resumeId) {
        await supabase.from("resumes").update(payload).eq("id", resumeId);
      } else if (!insertingRef.current) {
        insertingRef.current = true;
        try {
          const { data: ins } = await supabase.from("resumes").insert(payload).select("id").maybeSingle();
          if (ins?.id) {
            setResumeId(ins.id);
            localStorage.setItem("resumely:id", ins.id);
          }
        } finally {
          insertingRef.current = false;
        }
      }
    }, 1500);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [data, theme, accent, user, resumeId]);

  const progress = useMemo(() => {
    let score = 0;
    if (data.fullName) score += 10;
    if (data.title) score += 10;
    if (data.email && data.phone) score += 10;
    if (data.summary.length > 60) score += 15;
    if (data.experience.length > 0) score += 20;
    if (data.education.length > 0) score += 15;
    if (data.skills.length >= 5) score += 15;
    if (data.projects.length > 0) score += 5;
    return Math.min(100, score);
  }, [data]);

  const update = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) =>
    setData(d => ({ ...d, [k]: v }));

  return (
    <div className="min-h-screen bg-secondary/40">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/"><ChevronLeft className="mr-1 h-4 w-4" />Back</Link>
            </Button>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="text-sm font-medium">{data.fullName || "Untitled resume"}</div>
              <span className="text-xs text-muted-foreground">· auto-saved</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              <Gauge className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium">Score</span>
              <div className="w-28"><Progress value={progress} /></div>
              <span className="text-xs font-semibold">{progress}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAiOpen(true)}>
              <Wand2 className="mr-1.5 h-4 w-4" /> AI assist
            </Button>
            <Button size="sm" onClick={async () => {
              if (!data.photo) { toast.error("Profile photo is required"); setActive("personal"); return; }
              if (!data.fullName || !data.email) { toast.error("Please fill name and email"); setActive("personal"); return; }
              const payload: any = { data: data as any, theme, accent: accent ?? null };
              if (user) payload.user_id = user.id;
              try {
                const { error } = await supabase.from("resumes").insert(payload);
                if (error) throw error;
                window.print();
                setTimeout(() => {
                  setData(emptyResume);
                  setResumeId(null);
                  localStorage.removeItem("resumely:id");
                  localStorage.removeItem("resumely:data");
                  setActive("personal");
                }, 600);
              } catch (e: any) {
                toast.error(e.message || "Failed to save resume");
              }
            }} className="gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">
              <Download className="mr-1.5 h-4 w-4" /> Generate & Download
            </Button>
            {user && (
              <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => { signOut(); toast.success("Signed out"); navigate({ to: "/" }); }}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-4 p-4 lg:grid-cols-[220px_1fr_minmax(420px,1fr)]">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-border/60 bg-card p-3 shadow-soft lg:sticky lg:top-[72px] lg:h-[calc(100vh-88px)]">
          <div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sections</div>
          <nav className="space-y-0.5">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition ${
                  active === s.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </button>
            ))}
          </nav>

          <div className="mt-5 px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Theme</div>
          <div className="grid grid-cols-2 gap-1.5 px-1">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setAccent(undefined); }}
                className={`rounded-lg border px-2 py-1.5 text-xs transition ${
                  theme === t.id ? "border-primary bg-primary/5 text-primary font-medium" : "border-border/70 hover:bg-secondary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Palette className="h-3 w-3" /> Accent</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5 px-1">
            {accentSwatches.map(c => (
              <button
                key={c}
                onClick={() => setAccent(c)}
                className={`h-6 w-6 rounded-full border transition hover:scale-110 ${accent === c ? "ring-2 ring-offset-2 ring-primary" : "border-border/60"}`}
                style={{ background: c }}
                aria-label={`Accent ${c}`}
              />
            ))}
            <button
              onClick={() => setAccent(undefined)}
              className="rounded-full border border-border/60 px-2 text-[10px] text-muted-foreground hover:bg-secondary"
            >
              reset
            </button>
          </div>
        </aside>

        {/* Form */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {active === "personal" && <PersonalForm data={data} update={update} />}
              {active === "summary" && <SummaryForm data={data} update={update} onAi={() => setAiOpen(true)} />}
              {active === "experience" && <ExperienceForm data={data} update={update} />}
              {active === "education" && <EducationForm data={data} update={update} />}
              {active === "skills" && <SkillsForm data={data} update={update} />}
              {active === "projects" && <ProjectsForm data={data} update={update} />}
              {active === "languages" && <LanguagesForm data={data} update={update} />}
              {active === "certifications" && <EmptyState title="Certifications" desc="Add certifications you've earned to boost credibility." />}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Preview */}
        <section className="rounded-2xl border border-border/60 bg-secondary/60 p-4 shadow-soft lg:sticky lg:top-[72px] lg:h-[calc(100vh-88px)] lg:overflow-auto">
          <div className="mb-3 flex items-center px-1">
            <div className="text-xs font-medium text-muted-foreground">Live preview · A4</div>
          </div>
          <ResumePreview data={data} theme={theme} accent={accent} />
        </section>
      </div>

      <AnimatePresence>
        {aiOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 backdrop-blur-sm p-4"
            onClick={() => setAiOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-border/60 bg-card p-6 shadow-elegant"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground"><Wand2 className="h-4 w-4" /></span>
                <div>
                  <div className="font-semibold">AI suggestions</div>
                  <div className="text-xs text-muted-foreground">Polish your summary with one click.</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  "Senior product designer with 8+ years shipping high-impact B2B SaaS experiences.",
                  "Specialist in design systems, accessibility and craft-driven product work that moves business metrics.",
                  "Designer-engineer hybrid focused on building beautiful, performant interfaces at scale.",
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => { update("summary", s); setAiOpen(false); }}
                    className="block w-full rounded-lg border border-border/60 bg-background p-3 text-left text-sm transition hover:border-primary hover:bg-primary/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={() => setAiOpen(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PersonalForm({ data, update }: { data: ResumeData; update: <K extends keyof ResumeData>(k: K, v: ResumeData[K]) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onPick = async (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please choose an image");
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB");
    setUploading(true);
    try {
      const ext = f.name.split(".").pop() || "jpg";
      const path = `public/photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, f, { upsert: true });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      update("photo", pub.publicUrl);
      toast.success("Photo uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Header title="Personal information" desc="The basics — keep it crisp and accurate. A profile photo is required." />
      <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-background p-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full border border-border/60 bg-secondary">
          {data.photo ? (
            <img src={data.photo} alt="profile" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-muted-foreground"><Camera className="h-5 w-5" /></span>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Profile photo <span className="text-destructive">*</span></div>
          <p className="text-xs text-muted-foreground">Required. PNG or JPG, up to 5 MB.</p>
          <div className="mt-2">
            <Button type="button" size="sm" variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Camera className="mr-1.5 h-3.5 w-3.5" />}
              {data.photo ? "Change photo" : "Upload photo"}
            </Button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => onPick(e.target.files?.[0] ?? null)} />
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><Input value={data.fullName} onChange={e => update("fullName", e.target.value)} /></Field>
        <Field label="Job title"><Input value={data.title} onChange={e => update("title", e.target.value)} /></Field>
        <Field label="Email"><Input value={data.email} onChange={e => update("email", e.target.value)} /></Field>
        <Field label="Phone"><Input value={data.phone} onChange={e => update("phone", e.target.value)} /></Field>
        <Field label="Location"><Input value={data.location} onChange={e => update("location", e.target.value)} /></Field>
        <Field label="Website"><Input value={data.website} onChange={e => update("website", e.target.value)} /></Field>
      </div>
    </div>
  );
}

function SummaryForm({ data, update, onAi }: { data: ResumeData; update: any; onAi: () => void }) {
  return (
    <div className="space-y-5">
      <Header title="About me" desc="A 2–3 sentence professional summary." action={<Button size="sm" variant="outline" onClick={onAi}><Wand2 className="mr-1.5 h-3.5 w-3.5" /> Improve with AI</Button>} />
      <Textarea rows={6} value={data.summary} onChange={e => update("summary", e.target.value)} />
      <p className="text-xs text-muted-foreground">{data.summary.length} characters · aim for 250–400.</p>
    </div>
  );
}

function ExperienceForm({ data, update }: { data: ResumeData; update: any }) {
  const add = () => update("experience", [...data.experience, { id: crypto.randomUUID(), role: "", company: "", period: "", bullets: "" }]);
  const remove = (id: string) => update("experience", data.experience.filter(e => e.id !== id));
  const set = (id: string, k: string, v: string) => update("experience", data.experience.map(e => e.id === id ? { ...e, [k]: v } : e));
  return (
    <div className="space-y-5">
      <Header title="Experience" desc="Most recent first. Use action verbs and quantify impact." action={<Button size="sm" onClick={add}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add</Button>} />
      <div className="space-y-4">
        {data.experience.map(e => (
          <div key={e.id} className="rounded-xl border border-border/60 bg-background p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Role"><Input value={e.role} onChange={ev => set(e.id, "role", ev.target.value)} /></Field>
              <Field label="Company"><Input value={e.company} onChange={ev => set(e.id, "company", ev.target.value)} /></Field>
              <Field label="Period" className="sm:col-span-2"><Input value={e.period} onChange={ev => set(e.id, "period", ev.target.value)} placeholder="2022 — Present" /></Field>
              <Field label="Achievements (one per line)" className="sm:col-span-2">
                <Textarea rows={4} value={e.bullets} onChange={ev => set(e.id, "bullets", ev.target.value)} />
              </Field>
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => remove(e.id)}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationForm({ data, update }: { data: ResumeData; update: any }) {
  const add = () => update("education", [...data.education, { id: crypto.randomUUID(), school: "", degree: "", period: "" }]);
  const remove = (id: string) => update("education", data.education.filter(e => e.id !== id));
  const set = (id: string, k: string, v: string) => update("education", data.education.map(e => e.id === id ? { ...e, [k]: v } : e));
  return (
    <div className="space-y-5">
      <Header title="Education" desc="School, degree and dates." action={<Button size="sm" onClick={add}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add</Button>} />
      <div className="space-y-4">
        {data.education.map(e => (
          <div key={e.id} className="rounded-xl border border-border/60 bg-background p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="School"><Input value={e.school} onChange={ev => set(e.id, "school", ev.target.value)} /></Field>
              <Field label="Degree"><Input value={e.degree} onChange={ev => set(e.id, "degree", ev.target.value)} /></Field>
              <Field label="Period" className="sm:col-span-2"><Input value={e.period} onChange={ev => set(e.id, "period", ev.target.value)} /></Field>
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => remove(e.id)}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsForm({ data, update }: { data: ResumeData; update: any }) {
  const [val, setVal] = useState("");
  const add = () => { if (!val.trim()) return; update("skills", [...data.skills, val.trim()]); setVal(""); };
  return (
    <div className="space-y-5">
      <Header title="Skills" desc="Tools, methods and competencies." />
      <div className="flex gap-2">
        <Input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())} placeholder="Add a skill and press Enter" />
        <Button onClick={add}><Plus className="h-4 w-4" /></Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.skills.map((s, i) => (
          <span key={i} className="group inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
            {s}
            <button onClick={() => update("skills", data.skills.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100">
              <Trash2 className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectsForm({ data, update }: { data: ResumeData; update: any }) {
  const add = () => update("projects", [...data.projects, { id: crypto.randomUUID(), name: "", desc: "" }]);
  const remove = (id: string) => update("projects", data.projects.filter(p => p.id !== id));
  const set = (id: string, k: string, v: string) => update("projects", data.projects.map(p => p.id === id ? { ...p, [k]: v } : p));
  return (
    <div className="space-y-5">
      <Header title="Projects" desc="Side projects and notable work." action={<Button size="sm" onClick={add}><Plus className="mr-1.5 h-3.5 w-3.5" /> Add</Button>} />
      <div className="space-y-4">
        {data.projects.map(p => (
          <div key={p.id} className="rounded-xl border border-border/60 bg-background p-4">
            <div className="grid gap-3">
              <Field label="Name"><Input value={p.name} onChange={ev => set(p.id, "name", ev.target.value)} /></Field>
              <Field label="Description"><Textarea rows={2} value={p.desc} onChange={ev => set(p.id, "desc", ev.target.value)} /></Field>
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguagesForm({ data, update }: { data: ResumeData; update: any }) {
  const [val, setVal] = useState("");
  return (
    <div className="space-y-5">
      <Header title="Languages" desc="Languages you speak with proficiency." />
      <div className="flex gap-2">
        <Input value={val} onChange={e => setVal(e.target.value)} placeholder="English (Native)" />
        <Button onClick={() => { if (val.trim()) { update("languages", [...data.languages, val.trim()]); setVal(""); } }}><Plus className="h-4 w-4" /></Button>
      </div>
      <ul className="space-y-1.5">
        {data.languages.map((l, i) => (
          <li key={i} className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
            {l}
            <button onClick={() => update("languages", data.languages.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Header({ title, desc, action }: { title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {desc && <p className="mt-1 text-sm text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 inline-block text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function EmptyState({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border/70 bg-secondary/40 px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground"><Award className="h-5 w-5" /></div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{desc}</p>
      <Button className="mt-5"><Plus className="mr-1.5 h-4 w-4" /> Add {title.toLowerCase()}</Button>
    </div>
  );
}

// silence unused import warnings
void themeAccents;
