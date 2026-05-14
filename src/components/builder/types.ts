export type ResumeData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  photo: string;
  summary: string;
  experience: { id: string; role: string; company: string; period: string; bullets: string }[];
  education: { id: string; school: string; degree: string; period: string }[];
  skills: string[];
  projects: { id: string; name: string; desc: string }[];
  languages: string[];
};

export type Theme = "modern" | "corporate" | "minimal" | "creative";

export const themeAccents: Record<Theme, string> = {
  modern: "oklch(0.55 0.22 264)",
  corporate: "oklch(0.22 0.05 265)",
  minimal: "oklch(0.3 0.02 260)",
  creative: "oklch(0.72 0.13 185)",
};

export const defaultResume: ResumeData = {
  fullName: "Alex Morgan",
  title: "Senior Product Designer",
  email: "alex.morgan@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  website: "alexmorgan.design",
  photo: "",
  summary:
    "Senior product designer with 8+ years crafting intuitive B2B SaaS experiences. Passionate about systems thinking, accessibility and shipping polished products that drive measurable business outcomes.",
  experience: [
    {
      id: "e1",
      role: "Senior Product Designer",
      company: "Linear",
      period: "2022 — Present",
      bullets:
        "Led redesign of core issue tracking flow, increasing weekly active usage by 34%.\nShipped a new design system adopted across 6 product teams.\nMentored 4 junior designers and ran weekly design critiques.",
    },
  ],
  education: [
    { id: "ed1", school: "Stanford University", degree: "B.S. Human-Computer Interaction", period: "2014 — 2018" },
  ],
  skills: [],
  projects: [],
  languages: ["English (Native)"],
};

export const emptyResume: ResumeData = {
  fullName: "", title: "", email: "", phone: "", location: "", website: "", photo: "",
  summary: "", experience: [], education: [], skills: [], projects: [], languages: [],
};
