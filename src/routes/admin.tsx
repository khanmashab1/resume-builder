import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Eye, ShieldCheck, Loader2, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ResumePreview } from "@/components/builder/ResumePreview";
import type { ResumeData, Theme } from "@/components/builder/types";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Resumely" }] }),
  component: AdminPage,
});

type Row = {
  id: string;
  user_id: string;
  data: ResumeData;
  theme: string;
  accent: string | null;
  updated_at: string;
  profiles?: { full_name: string | null; email: string; avatar_url: string } | null;
};

function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selected, setSelected] = useState<Row | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!isAdmin) return;
    (async () => {
      setFetching(true);
      const { data: resumes } = await supabase
        .from("resumes")
        .select("id, user_id, data, theme, accent, updated_at")
        .order("updated_at", { ascending: false });
      const ids = Array.from(new Set((resumes ?? []).map(r => r.user_id).filter((x): x is string => !!x)));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const byId = new Map((profiles ?? []).map(p => [p.id, p]));
      const merged: Row[] = (resumes ?? []).map(r => ({
        ...(r as any),
        profiles: r.user_id ? (byId.get(r.user_id) ?? null) : null,
      }));
      setRows(merged);
      setFetching(false);
    })();
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }
  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center px-4">
        <div className="max-w-md text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground" />
          <h1 className="mt-3 text-xl font-semibold">Admins only</h1>
          <p className="mt-1 text-sm text-muted-foreground">You don't have permission to view this page.</p>
          <Button className="mt-5" asChild><Link to="/">Go home</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-30 glass border-b border-border/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild><Link to="/"><ChevronLeft className="mr-1 h-4 w-4" />Back</Link></Button>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md gradient-primary text-primary-foreground"><ShieldCheck className="h-4 w-4" /></span>
              <span className="font-semibold">Admin panel</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {rows.length} resumes
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-6">
        {fetching ? (
          <div className="grid place-items-center py-24"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card px-6 py-16 text-center">
            <h3 className="text-lg font-semibold">No resumes yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Submitted resumes will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(r => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft transition hover:shadow-elegant"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={r.profiles?.avatar_url || r.data.photo || ""}
                    alt=""
                    className="h-11 w-11 rounded-full bg-secondary object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{r.data.fullName || r.profiles?.full_name || "Untitled"}</div>
                    <div className="truncate text-xs text-muted-foreground">{r.profiles?.email}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {r.data.title || "—"} · {r.theme}
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground">
                  Updated {new Date(r.updated_at).toLocaleDateString()}
                </div>
                <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => setSelected(r)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> Review resume
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl bg-card p-4 shadow-elegant" onClick={e => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="text-sm font-semibold">{selected.profiles?.full_name || selected.data.fullName}</div>
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Button>
            </div>
            <ResumePreview data={selected.data} theme={(selected.theme as Theme) || "modern"} accent={selected.accent || undefined} />
          </div>
        </div>
      )}
    </div>
  );
}
