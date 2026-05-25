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
      <main className="pt-[120px] max-w-[820px] mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
        <article className="prose-old-iron space-y-stack-md text-on-surface-variant leading-relaxed">
          <Outlet />
        </article>
      </main>
      <Footer />
    </div>
  );
}
