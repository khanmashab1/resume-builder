import { Link } from "@tanstack/react-router";
import { FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "glass border-b border-border/60" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-elegant">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-lg tracking-tight">Resumely</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</a>
          <a href="#templates" className="text-sm text-muted-foreground hover:text-foreground transition">Templates</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">Pricing</a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition">Reviews</a>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden md:inline-flex" asChild>
            <Link to="/login">Admin</Link>
          </Button>
          <Button asChild className="gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">
            <Link to="/builder">Create Resume</Link>
          </Button>
          <button className="md:hidden p-2"><Menu className="h-5 w-5" /></button>
        </div>
      </nav>
    </header>
  );
}
