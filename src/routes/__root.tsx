import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { SiteVisitTracker } from "@/components/site-visit-tracker";
import { MobileAppInstaller } from "@/components/mobile-app-installer";

const siteUrl = "https://www.soruindia.com";
const siteDescription =
  "Soru India is a chef-powered food services marketplace for affordable meals, home chef subscriptions, personalized nutrition plans, student lunchboxes, and verified skilled cooks across India.";
const socialImage =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/75154ba5-3786-40f0-b5b1-fcd2fbc636da/id-preview-0fd83b53--d04faae7-e8d2-4360-be41-206ffa76e1be.lovable.app-1781610836987.png";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Soru",
      alternateName: ["Soru India", "Soru food app", "Soru chef-powered meals"],
      url: siteUrl,
      logo: `${siteUrl}/soru-icon-512.png`,
      email: "hello@soruindia.com",
      sameAs: [
        "https://www.instagram.com/soru.india/",
        "https://www.linkedin.com/company/soru-india",
      ],
      description: siteDescription,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Soru India",
      alternateName: "Soru",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#homepage`,
      url: siteUrl,
      name: "Soru India — Chef-powered meals, home chefs, and personalized nutrition",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
      description: siteDescription,
    },
    {
      "@type": "MobileApplication",
      name: "Soru",
      alternateName: "Soru India",
      operatingSystem: "Web, iOS, Android",
      applicationCategory: "FoodDeliveryApplication",
      url: "https://app.soruindia.com",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
    },
  ],
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
      { name: "theme-color", content: "#F5B51B" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Soru" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "application-name", content: "Soru India" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { title: "Soru India — Every chef’s special, closer to home." },
      {
        name: "description",
        content: siteDescription,
      },
      {
        name: "keywords",
        content:
          "Soru, Soru India, Soru food app, chef meals India, home chef meals, personalized nutrition plans, student lunchbox India, verified home cooks",
      },
      { property: "og:site_name", content: "Soru India" },
      { property: "og:title", content: "Soru India — Every chef’s special, closer to home." },
      {
        property: "og:description",
        content: siteDescription,
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Soru India — Every chef’s special, closer to home." },
      {
        name: "twitter:description",
        content: siteDescription,
      },
      {
        property: "og:image",
        content: socialImage,
      },
      {
        name: "twitter:image",
        content: socialImage,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/soru-icon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/soru-icon-192.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <SiteVisitTracker />
      <MobileAppInstaller />
      <Toaster />
      <Analytics />
    </QueryClientProvider>
  );
}
