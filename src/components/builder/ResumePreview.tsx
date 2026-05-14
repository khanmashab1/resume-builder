import type { ResumeData, Theme } from "./types";
import { themeAccents } from "./types";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export function ResumePreview({ data, theme, accent }: { data: ResumeData; theme: Theme; accent?: string }) {
  const color = accent || themeAccents[theme];
  const isCreative = theme === "creative";
  const isMinimal = theme === "minimal";
  const isCorporate = theme === "corporate";

  return (
    <div
      className="print-area mx-auto w-full bg-white text-[#0F172A] shadow-soft"
      style={{
        aspectRatio: "1 / 1.4142",
        maxWidth: 820,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto',
      }}
    >
      <div className="grid h-full" style={{ gridTemplateColumns: isCreative ? "260px 1fr" : "1fr" }}>
        {isCreative && (
          <aside className="h-full p-7 text-white" style={{ background: color }}>
            {data.photo && (
              <img src={data.photo} alt={data.fullName} className="mb-4 h-24 w-24 rounded-full border-2 border-white/40 object-cover" />
            )}
            <div className="text-2xl font-semibold leading-tight">{data.fullName}</div>
            <div className="mt-1 text-sm opacity-90">{data.title}</div>
            <div className="mt-6 space-y-2 text-xs opacity-95">
              <Row icon={<Mail className="h-3 w-3" />} text={data.email} />
              <Row icon={<Phone className="h-3 w-3" />} text={data.phone} />
              <Row icon={<MapPin className="h-3 w-3" />} text={data.location} />
              <Row icon={<Globe className="h-3 w-3" />} text={data.website} />
            </div>
            <SideHeading>Skills</SideHeading>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {data.skills.map(s => (
                <span key={s} className="rounded bg-white/15 px-2 py-0.5 text-[10px]">{s}</span>
              ))}
            </div>
            <SideHeading>Languages</SideHeading>
            <ul className="mt-2 space-y-1 text-xs opacity-95">
              {data.languages.map(l => <li key={l}>{l}</li>)}
            </ul>
          </aside>
        )}

        <div className="h-full overflow-hidden p-9">
          {!isCreative && (
            <header className={isCorporate ? "border-b-2 pb-4" : "pb-4"} style={{ borderColor: color }}>
              <div className="flex items-center gap-4">
                {data.photo && (
                  <img src={data.photo} alt={data.fullName} className="h-20 w-20 rounded-full object-cover" style={{ border: `2px solid ${color}` }} />
                )}
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight" style={{ color: isMinimal ? "#0F172A" : color }}>
                    {data.fullName}
                  </h1>
                  <div className="mt-1 text-sm font-medium text-[#475569]">{data.title}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#475569]">
                <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{data.email}</span>
                <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{data.phone}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{data.location}</span>
                <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" />{data.website}</span>
              </div>
            </header>
          )}

          <Section title="Summary" color={color} minimal={isMinimal}>
            <p className="text-[12px] leading-relaxed text-[#334155]">{data.summary}</p>
          </Section>

          <Section title="Experience" color={color} minimal={isMinimal}>
            <div className="space-y-3">
              {data.experience.map(e => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between">
                    <div className="text-[12.5px] font-semibold">{e.role} · <span className="font-medium text-[#475569]">{e.company}</span></div>
                    <div className="text-[10.5px] text-[#64748B]">{e.period}</div>
                  </div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11.5px] leading-relaxed text-[#334155]">
                    {e.bullets.split("\n").filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Education" color={color} minimal={isMinimal}>
            {data.education.map(ed => (
              <div key={ed.id} className="flex items-baseline justify-between">
                <div className="text-[12px]">
                  <span className="font-semibold">{ed.school}</span> — <span className="text-[#475569]">{ed.degree}</span>
                </div>
                <div className="text-[10.5px] text-[#64748B]">{ed.period}</div>
              </div>
            ))}
          </Section>

          {!isCreative && (
            <Section title="Skills" color={color} minimal={isMinimal}>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map(s => (
                  <span key={s} className="rounded-md border px-2 py-0.5 text-[10.5px]" style={{ borderColor: color, color: isMinimal ? "#0F172A" : color }}>
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {data.projects.length > 0 && (
            <Section title="Projects" color={color} minimal={isMinimal}>
              {data.projects.map(p => (
                <div key={p.id} className="text-[11.5px]">
                  <span className="font-semibold">{p.name}</span> — <span className="text-[#475569]">{p.desc}</span>
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, minimal, children }: { title: string; color: string; minimal: boolean; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2
        className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${minimal ? "text-[#0F172A]" : ""}`}
        style={{ color: minimal ? undefined : color }}
      >
        {title}
      </h2>
      <div className={`mt-1 ${minimal ? "border-t border-[#E2E8F0] pt-2" : ""}`}>{children}</div>
    </section>
  );
}

function SideHeading({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">{children}</div>;
}
function Row({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex items-center gap-1.5">{icon}<span>{text}</span></div>;
}
