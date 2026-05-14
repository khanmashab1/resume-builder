import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Features, Templates, HowItWorks, Testimonials, Pricing, Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Resumely — Build a Professional Resume in Minutes" },
      { name: "description", content: "Premium AI-powered resume builder with ATS-friendly templates, real-time preview and one-click PDF export." },
      { property: "og:title", content: "Resumely — AI Resume Builder" },
      { property: "og:description", content: "Build ATS-friendly resumes with AI assistance and beautiful templates." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Templates />
        <HowItWorks />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
