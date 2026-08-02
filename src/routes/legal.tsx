import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/legal")({
  component: LegalLayout,
});

function LegalLayout() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Nav />
      <main className="pt-[120px] pb-[80px] max-w-[820px] mx-auto px-[20px] md:px-[40px]">
        <article className="space-y-6 text-on-surface-variant leading-relaxed text-[15px] tracking-[-0.02em]">
          <Outlet />
        </article>
      </main>
      <Footer />
    </div>
  );
}
