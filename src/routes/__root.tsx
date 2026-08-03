import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { CookieBanner } from "@/components/CookieBanner";
import { PerfMonitor } from "@/components/PerfMonitor";
import { Preloader } from "@/components/Preloader";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground tracking-[-0.04em]">404</h1>
        <h2 className="mt-4 text-xl font-bold text-foreground tracking-[-0.02em]">Sayfa Bulunamadı</h2>
        <p className="mt-2 text-sm text-secondary">
          Aradığın sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-primary text-[14px] px-6 py-3">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold tracking-[-0.02em] text-foreground">
          Sayfa Yüklenemedi
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Bir sorun oluştu. Sayfayı yenilemeyi deneyebilirsin.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-primary text-[13px] px-5 py-2.5"
          >
            Tekrar Dene
          </button>
          <a href="/" className="btn-secondary text-[13px] px-5 py-2.5">
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "OLD IRON — Disiplinden Dövülmüş" },
      { name: "description", content: "Almanya menşeili premium spor giyim & supplement. Old School zihniyeti, modern güç." },
      { property: "og:title", content: "OLD IRON — Disiplinden Dövülmüş" },
      { property: "og:description", content: "Almanya menşeili premium spor giyim & supplement. Old School zihniyeti, modern güç." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "OLD IRON — Disiplinden Dövülmüş" },
      { name: "twitter:description", content: "Almanya menşeili premium spor giyim & supplement. Old School zihniyeti, modern güç." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3dbab38f-3813-4915-8fc1-c0bacfa37ccc/id-preview-e7b9e356--1d98a88c-c10e-4031-b1b5-e037619a1e1d.lovable.app-1779702882774.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3dbab38f-3813-4915-8fc1-c0bacfa37ccc/id-preview-e7b9e356--1d98a88c-c10e-4031-b1b5-e037619a1e1d.lovable.app-1779702882774.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Preloader />
      <AuthSync />
      <SmoothScroll />
      <PaymentTestModeBanner />
      <Outlet />
      <CookieBanner />
      <Toaster theme="dark" position="bottom-right" />
      <PerfMonitor />
    </QueryClientProvider>
  );
}

function AuthSync() {
  const router = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, queryClient]);
  return null;
}
