import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import heroChef from "@/assets/hero-chef.jpg";
import healthyThali from "@/assets/healthy-thali.jpg";
import familyMeal from "@/assets/family-meal.jpg";
import chefPortrait from "@/assets/chef-portrait.jpg";
import professionalLunch from "@/assets/professional-lunch.jpg";
import chefCooking from "@/assets/chef-cooking.jpg";
import soruLogo from "@/assets/soru-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Soru — Choose Your Chef. Define Your Goals. Enjoy Healthy Food." },
      {
        name: "description",
        content:
          "India's chef-powered platform connecting talented cooks with people seeking healthy, trustworthy, and personalized meals.",
      },
    ],
  }),
  component: Landing,
});

/* ───────── Small primitives ───────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
      <span className="size-1.5 rounded-full bg-primary" />
      {children}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 text-balance text-base text-muted-foreground md:text-lg">{intro}</p>
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  href = "#waitlist",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
    >
      {children}
      <span className="transition-transform group-hover:translate-x-0.5">→</span>
    </a>
  );
}

function GhostButton({
  children,
  href = "#chefs",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-card"
    >
      {children}
    </a>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ───────── Page ───────── */

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Marquee />
      <Mission />
      <Vision />
      <Problem />
      <Solution />
      <HowItWorks />
      <Products />
      <OrderNow />
      <Personalized />
      <BecomeAChef />
      <Ambassador />
      <FoodLicense />
      <Impact />
      <Cities />
      <Waitlist />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ───────── Nav ───────── */

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg font-bold">
            S
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">Soru</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#mission" className="hover:text-foreground">Mission</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#chefs" className="hover:text-foreground">For Chefs</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <a
          href="#waitlist"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
        >
          Join Waitlist
        </a>
      </div>
    </header>
  );
}

/* ───────── Hero ───────── */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="grain-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative grid items-center gap-12 py-16 md:grid-cols-12 md:py-24 lg:py-28">
        <div className="md:col-span-7">
          <Eyebrow>Launching in Bengaluru · Chennai · Hyderabad</Eyebrow>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl lg:text-7xl">
            Choose your <span className="italic text-primary">chef.</span>{" "}
            Define your <span className="italic text-[color:var(--leaf)]">goals.</span>{" "}
            Enjoy healthy food.
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base text-muted-foreground md:text-lg">
            India's chef-powered platform connecting talented cooks with people seeking healthy,
            trustworthy, and personalized meals.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryButton>Join the Waitlist</PrimaryButton>
            <GhostButton href="#chefs">Become a Founding Chef</GhostButton>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6 text-sm">
            <Stat k="500+" v="Chefs onboarding" />
            <Stat k="3 cities" v="Pilot launch" />
            <Stat k="100%" v="Verified kitchens" />
          </div>
        </div>

        <div className="relative md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-glow)]">
            <img
              src={heroChef}
              alt="Indian chef plating a healthy thali"
              width={1536}
              height={1280}
              className="size-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-background/85 px-4 py-3 backdrop-blur">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Verified Chef
                </div>
                <div className="font-display text-lg font-semibold">Priya R. · South Indian</div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-[color:var(--spice)]">★</span> 4.9
              </div>
            </div>
          </div>
          <div className="absolute -left-6 -top-6 hidden rotate-[-6deg] rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] md:block">
            <img
              src={healthyThali}
              alt="Healthy Indian thali"
              loading="lazy"
              width={140}
              height={140}
              className="size-28 rounded-xl object-cover"
            />
            <div className="mt-2 px-1 text-xs font-medium">Today · High-Protein Thali</div>
          </div>
          <div className="absolute -bottom-6 -right-4 hidden rotate-[5deg] rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] md:block">
            <div className="flex items-center gap-2 px-1">
              <span className="grid size-8 place-items-center rounded-full bg-[color:var(--leaf)] text-xs font-bold text-white">
                ✓
              </span>
              <div className="text-xs">
                <div className="font-semibold">FSSAI guided</div>
                <div className="text-muted-foreground">Kitchen verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold text-foreground">{k}</div>
      <div className="text-xs text-muted-foreground">{v}</div>
    </div>
  );
}

/* ───────── Marquee ───────── */

function Marquee() {
  const items = [
    "Home-style meals",
    "High protein",
    "Diabetic-friendly",
    "Regional cuisine",
    "Weight loss",
    "Family plans",
    "Vegetarian",
    "Chef specials",
  ];
  return (
    <div className="border-y border-border bg-secondary/60 py-4">
      <div className="container-x flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="size-1 rounded-full bg-primary" />
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ───────── Mission ───────── */

function Mission() {
  const cards = [
    { t: "Income Opportunities for Chefs", d: "Recurring earnings, not one-off gigs.", i: "₹" },
    { t: "Healthy Food Access", d: "Trustworthy meals, every day.", i: "🥗" },
    { t: "Women's Entrepreneurship", d: "Homemakers building real food brands.", i: "👩‍🍳" },
    { t: "Support for Culinary Students", d: "A launchpad for the next generation.", i: "🎓" },
    { t: "Local Economic Growth", d: "Stronger neighborhood food ecosystems.", i: "🏘️" },
    { t: "Food Transparency & Trust", d: "Know who cooks what you eat.", i: "🔍" },
  ];
  return (
    <section id="mission" className="container-x py-20 md:py-28">
      <SectionHeading
        eyebrow="Our Mission"
        title={
          <>
            Empowering culinary talent.{" "}
            <span className="italic text-primary">Making healthy food accessible.</span>
          </>
        }
        intro="We believe every talented cook deserves a sustainable business — and everyone deserves access to healthy, trustworthy, and affordable food. We bridge both, building opportunities, healthier communities, and stronger local economies through food."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.t}>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-xl">
              {c.i}
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">{c.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ───────── Vision ───────── */

function Vision() {
  const points = [
    "Every talented cook can earn from their skills.",
    "Healthy food is easier to access than unhealthy food.",
    "Customers know who prepares their meals.",
    "Independent chefs can build successful food brands.",
    "Technology creates trust between chefs and customers.",
  ];
  return (
    <section className="relative overflow-hidden bg-[color:var(--ink)] text-[color:var(--cream)]">
      <div className="container-x grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/70">
            <span className="size-1.5 rounded-full bg-[color:var(--spice)]" /> Our Vision
          </div>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight md:text-5xl">
            Building India's largest community of{" "}
            <span className="italic text-[color:var(--spice)]">independent chefs.</span>
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-white/85">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--spice)]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10">
            <img
              src={chefPortrait}
              alt="Indian homemaker chef"
              loading="lazy"
              width={1024}
              height={1280}
              className="size-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-2xl bg-[color:var(--cream)] p-4 text-[color:var(--ink)] shadow-[var(--shadow-glow)]">
            <div className="font-display text-2xl font-semibold">Meera, 42</div>
            <div className="text-xs text-muted-foreground">Founding chef · Bengaluru</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Problem ───────── */

function Problem() {
  const customers = [
    "Rising dependence on processed food",
    "Lack of trust in food preparation",
    "Expensive healthy food options",
    "Limited personalized meal choices",
    "Repetitive food subscriptions",
  ];
  const chefs = [
    "Difficulty finding customers",
    "Limited visibility",
    "High business startup costs",
    "Lack of digital tools",
    "Compliance and licensing challenges",
  ];
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHeading
        align="center"
        eyebrow="Why we exist"
        title={
          <>
            Two problems.{" "}
            <span className="italic text-primary">One platform.</span>
          </>
        }
      />
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <ProblemCol title="For Customers" items={customers} tone="primary" />
        <ProblemCol title="For Chefs" items={chefs} tone="leaf" />
      </div>
    </section>
  );
}

function ProblemCol({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "primary" | "leaf";
}) {
  const color = tone === "primary" ? "bg-primary" : "bg-[color:var(--leaf)]";
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <span className={`size-2.5 rounded-full ${color}`} />
        <h3 className="font-display text-2xl font-semibold">{title}</h3>
      </div>
      <ul className="mt-6 divide-y divide-border">
        {items.map((i, idx) => (
          <li key={i} className="flex items-start gap-4 py-4">
            <span className="mt-1 w-6 text-sm font-medium text-muted-foreground">
              0{idx + 1}
            </span>
            <span className="text-base">{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── Solution ───────── */

function Solution() {
  const items = [
    { t: "Healthy Home-Style Meals", d: "Made the way it should be — at home, by a chef.", i: "🍲" },
    { t: "Personalized Nutrition Plans", d: "Designed around your goals, not menus.", i: "🎯" },
    { t: "Verified Independent Chefs", d: "Every chef is vetted and profile-verified.", i: "✅" },
    { t: "Meal Subscriptions", d: "Breakfast, lunch, dinner, or full-day.", i: "📅" },
    { t: "Chef Specials Marketplace", d: "Signature dishes & seasonal menus.", i: "✨" },
    { t: "Food Business Opportunities", d: "From a single tiffin to a real food brand.", i: "📈" },
    { t: "Kitchen Verification", d: "Hygiene & standards reviewed on-ground.", i: "🏠" },
    { t: "Food License Guidance", d: "FSSAI & compliance, handheld.", i: "📜" },
    { t: "Chef Growth Tools", d: "Insights, pricing & customer messaging.", i: "🛠️" },
    { t: "Community & Trust", d: "Real reviews from real households.", i: "❤️" },
  ];
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Our Solution"
          title={
            <>
              One platform.{" "}
              <span className="italic text-primary">Multiple solutions.</span>
            </>
          }
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {items.map((i) => (
            <div
              key={i.t}
              className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <div className="text-2xl">{i.i}</div>
              <h3 className="mt-3 text-base font-semibold">{i.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{i.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── How It Works ───────── */

function HowItWorks() {
  const customer = [
    { t: "Discover Verified Chefs", d: "Browse chefs by cuisine, specialties, ratings & meal plans." },
    { t: "Choose Your Subscription", d: "Breakfast, Lunch, Dinner, or Full-Day plans." },
    { t: "Customize Your Goals", d: "Weight loss, high protein, vegetarian, family meals & more." },
    { t: "Enjoy Healthy Food", d: "Chef-crafted meals delivered to home or workplace." },
  ];
  const chef = [
    { t: "Create Your Chef Profile", d: "Showcase your expertise and culinary style." },
    { t: "Get Verified", d: "Kitchen verification and food compliance assistance." },
    { t: "Launch Your Meals", d: "Offer subscriptions, personalized plans, and chef specials." },
    { t: "Build Your Food Business", d: "Gain customers, build reputation, earn recurring income." },
  ];
  return (
    <section id="how" className="container-x py-20 md:py-28">
      <SectionHeading
        align="center"
        eyebrow="How it works"
        title={
          <>
            Simple for customers.{" "}
            <span className="italic text-primary">Powerful for chefs.</span>
          </>
        }
      />
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <StepsColumn label="For Customers" steps={customer} image={professionalLunch} />
        <StepsColumn label="For Chefs" steps={chef} image={chefCooking} flip />
      </div>
    </section>
  );
}

function StepsColumn({
  label,
  steps,
  image,
  flip,
}: {
  label: string;
  steps: { t: string; d: string }[];
  image: string;
  flip?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-8">
      <div className={`grid gap-6 ${flip ? "md:grid-cols-[1fr_auto]" : "md:grid-cols-[auto_1fr]"}`}>
        <div className={`${flip ? "order-2" : ""}`}>
          <div className="aspect-square w-full overflow-hidden rounded-2xl md:w-44">
            <img
              src={image}
              alt={label}
              loading="lazy"
              width={400}
              height={400}
              className="size-full object-cover"
            />
          </div>
        </div>
        <div className={`${flip ? "order-1" : ""}`}>
          <Eyebrow>{label}</Eyebrow>
          <ol className="mt-6 space-y-5">
            {steps.map((s, idx) => (
              <li key={s.t} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-semibold">{s.t}</div>
                  <div className="text-sm text-muted-foreground">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/* ───────── Products ───────── */

function Products() {
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container-x space-y-16">
        {/* Subscriptions */}
        <div>
          <SectionHeading
            eyebrow="Subscriptions"
            title={
              <>
                Pick a plan that fits{" "}
                <span className="italic text-primary">your day.</span>
              </>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Breakfast Plans", d: "Energising mornings, chef-made.", p: "From ₹89/meal" },
              { t: "Lunch Plans", d: "Office-ready, balanced lunches.", p: "From ₹129/meal" },
              { t: "Dinner Plans", d: "Light, wholesome evenings.", p: "From ₹149/meal" },
              { t: "Full-Day Plans", d: "Breakfast, lunch & dinner — sorted.", p: "From ₹329/day" },
            ].map((p) => (
              <Card key={p.t}>
                <div className="text-xs font-medium uppercase tracking-widest text-primary">
                  {p.p}
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["High Protein", "Veg", "Family"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <SectionHeading eyebrow="Categories" title={<>Cook your way through India.</>} />
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "Home Style Meals",
              "High Protein Meals",
              "Vegetarian Plans",
              "Regional Cuisine",
              "Weight Loss Plans",
              "Family Plans",
            ].map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Today's specials */}
        <div>
          <SectionHeading
            eyebrow="Today's Specials"
            title={
              <>
                Chef-created.{" "}
                <span className="italic text-primary">Available now.</span>
              </>
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { t: "Signature Ghee Roast", c: "Mangalorean", chef: "Ravi N.", img: healthyThali },
              { t: "Monsoon Khichdi Bowl", c: "North Indian", chef: "Anita V.", img: familyMeal },
              { t: "Festival Sweets Box", c: "Bengali", chef: "Sourav D.", img: chefCooking },
            ].map((s) => (
              <article
                key={s.t}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.t}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="size-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {s.c}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-semibold">{s.t}</h3>
                  <div className="mt-2 text-sm text-muted-foreground">by {s.chef}</div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Top Rated Chefs */}
        <div>
          <SectionHeading
            eyebrow="Top Rated Chefs"
            title={<>The people behind the plate.</>}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: "Priya R.", c: "South Indian", r: 4.9, m: "1.2k", img: heroChef },
              { n: "Meera K.", c: "Home Style", r: 4.8, m: "980", img: chefPortrait },
              { n: "Ravi N.", c: "Coastal", r: 4.9, m: "1.5k", img: chefCooking },
              { n: "Anita V.", c: "North Indian", r: 4.7, m: "760", img: familyMeal },
            ].map((c) => (
              <div
                key={c.n}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.n}
                    loading="lazy"
                    width={400}
                    height={500}
                    className="size-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-display text-lg font-semibold">{c.n}</div>
                    <span className="rounded-full bg-[color:var(--leaf)]/10 px-2 py-0.5 text-xs font-medium text-[color:var(--leaf)]">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{c.c}</div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span><span className="text-[color:var(--spice)]">★</span> {c.r}</span>
                    <span className="text-muted-foreground">{c.m} meals</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chef of the Week */}
        <ChefOfWeek />
      </div>
    </section>
  );
}

function ChefOfWeek() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="grid md:grid-cols-2">
        <div className="aspect-[4/5] md:aspect-auto">
          <img
            src={chefPortrait}
            alt="Chef of the week"
            loading="lazy"
            width={800}
            height={1000}
            className="size-full object-cover"
          />
        </div>
        <div className="p-8 md:p-12">
          <Eyebrow>Chef of the Week</Eyebrow>
          <h3 className="mt-4 font-display text-3xl font-semibold md:text-4xl">
            Meera's journey: from family kitchen to 200+ households.
          </h3>
          <p className="mt-4 text-muted-foreground">
            “I always cooked for my family. Soru gave me the confidence — and the tools —
            to cook for my city.”
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-6 text-sm">
            <Stat k="200+" v="Customers served" />
            <Stat k="4.9★" v="Avg. rating" />
            <Stat k="14" v="Signature dishes" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Order on Demand ───────── */

function OrderNow() {
  const steps = [
    { t: "Browse Menus", d: "Explore dishes from verified chefs in your city." },
    { t: "Pick Your Meal", d: "Choose a single dish, a combo, or build your own plate." },
    { t: "Place Your Order", d: "One-tap ordering with scheduled or instant delivery." },
    { t: "Enjoy Fresh Food", d: "Hand-delivered from the chef's kitchen to your door." },
  ];
  return (
    <section className="container-x py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <Eyebrow>Order on Demand</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight md:text-5xl">
            Hungry now?{" "}
            <span className="italic text-primary">Order a single meal.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Not ready for a subscription? No problem. Browse chef menus and order exactly what you want,
            when you want it — from a comforting homestyle thali to a chef's special creation.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Single Meals", "Chef Combos", "Group Orders", "Scheduled Delivery", "Instant Delivery"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <ol className="space-y-6">
            {steps.map((s, idx) => (
              <li key={s.t} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                  {idx + 1}
                </span>
                <div>
                  <div className="font-semibold">{s.t}</div>
                  <div className="text-sm text-muted-foreground">{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <PrimaryButton>Explore Menus</PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Personalized Nutrition ───────── */

function Personalized() {
  const goals = [
    "Weight Loss",
    "Weight Gain",
    "High Protein",
    "Vegetarian",
    "Diabetic-Friendly",
    "Family Nutrition",
  ];
  return (
    <section className="container-x py-20 md:py-28">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <Eyebrow>Personalized Nutrition</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight md:text-5xl">
            Food designed around{" "}
            <span className="italic text-primary">your goals.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            You share your goals. Chefs design meal plans. The platform handles the rest —
            scheduling, delivery, feedback and iteration.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {goals.map((g) => (
              <span
                key={g}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border border-border">
            <img
              src={healthyThali}
              alt="Personalized healthy meal"
              loading="lazy"
              width={1280}
              height={960}
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Become a Chef ───────── */

function BecomeAChef() {
  const benefits = [
    "Access Customers",
    "Build Your Brand",
    "Earn Recurring Income",
    "Receive Compliance Guidance",
    "Grow Your Food Business",
  ];
  const targets = ["Home Chefs", "Homemakers", "Culinary Students", "Professional Chefs", "Caterers"];
  return (
    <section id="chefs" className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="container-x grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.18em]">
            <span className="size-1.5 rounded-full bg-white" /> For chefs
          </div>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight md:text-5xl">
            Turn your cooking skills into{" "}
            <span className="italic">income.</span>
          </h2>
          <p className="mt-5 max-w-xl text-white/85">
            Whether you cook for your family or run a tiny tiffin service — we help you turn it into
            a real, sustainable food brand.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {targets.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs"
              >
                {t}
              </span>
            ))}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-white/15 text-xs">
                  ✓
                </span>
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-6 py-3 text-sm font-semibold text-[color:var(--cream)] transition hover:-translate-y-0.5"
            >
              Apply as Founding Chef →
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/20">
            <img
              src={chefCooking}
              alt="Indian chef cooking"
              loading="lazy"
              width={1024}
              height={1280}
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Ambassador ───────── */

function Ambassador() {
  const benefits = [
    { t: "Early Access", d: "Be first on the platform." },
    { t: "Featured Visibility", d: "Spotlight on homepage & app." },
    { t: "Community Recognition", d: "Founding-Chef badge for life." },
    { t: "Growth Opportunities", d: "Co-created menus & marketing." },
    { t: "Priority Support", d: "Dedicated onboarding manager." },
  ];
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHeading
        align="center"
        eyebrow="Founding Chef Ambassador Program"
        title={
          <>
            Become a{" "}
            <span className="italic text-primary">founding chef ambassador.</span>
          </>
        }
        intro="We are inviting a limited number of chefs across Bengaluru, Chennai, and Hyderabad to help shape the future of healthy food and culinary entrepreneurship."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {benefits.map((b, i) => (
          <div
            key={b.t}
            className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="font-display text-xs text-muted-foreground">0{i + 1}</div>
            <h3 className="mt-2 font-semibold">{b.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── Food License ───────── */

function FoodLicense() {
  const features = [
    "FSSAI Guidance",
    "Compliance Checklists",
    "Kitchen Verification Support",
    "Onboarding Resources",
  ];
  return (
    <section className="bg-secondary/50 py-20 md:py-28">
      <div className="container-x grid items-center gap-12 md:grid-cols-2">
        <div>
          <Eyebrow>Food License Assistance</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight md:text-5xl">
            Helping chefs navigate{" "}
            <span className="italic text-primary">compliance.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            We provide guidance and resources to help chefs understand food registration
            requirements, kitchen standards, and compliance processes.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {features.map((f) => (
            <div
              key={f}
              className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-[color:var(--leaf)]/10 text-[color:var(--leaf)]">
                ✓
              </div>
              <div className="mt-4 font-semibold">{f}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Impact ───────── */

function Impact() {
  const cards = [
    { e: "👩‍🍳", t: "Empowering Homemakers" },
    { e: "🎓", t: "Supporting Culinary Students" },
    { e: "🥗", t: "Making Healthy Food Accessible" },
    { e: "💼", t: "Creating New Income Opportunities" },
    { e: "🏠", t: "Supporting Local Food Businesses" },
    { e: "❤️", t: "Building Trust Through Transparency" },
  ];
  return (
    <section className="container-x py-20 md:py-28">
      <SectionHeading
        align="center"
        title={
          <>
            Creating impact{" "}
            <span className="italic text-primary">beyond food.</span>
          </>
        }
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.t}
            className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]"
          >
            <div className="text-4xl">{c.e}</div>
            <div className="mt-4 font-display text-lg font-semibold">{c.t}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── Cities ───────── */

function Cities() {
  return (
    <section className="bg-[color:var(--ink)] py-20 text-[color:var(--cream)] md:py-28">
      <div className="container-x text-center">
        <Eyebrow>Launch Cities</Eyebrow>
        <h2 className="mx-auto mt-4 max-w-2xl text-balance font-display text-3xl font-semibold leading-tight md:text-5xl">
          Starting in three cities.{" "}
          <span className="italic text-[color:var(--spice)]">Cooking for India next.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          Launching first in Bengaluru, Chennai and Hyderabad, with plans for nationwide expansion.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {["Bengaluru", "Chennai", "Hyderabad"].map((c) => (
            <div
              key={c}
              className="rounded-3xl border border-white/15 bg-white/[0.04] p-10 transition hover:bg-white/[0.08]"
            >
              <div className="font-display text-3xl font-semibold">{c}</div>
              <div className="mt-2 text-sm text-white/60">Pilot launch</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Waitlist ───────── */

function Waitlist() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="waitlist" className="container-x py-20 md:py-28">
      <div className="grid gap-10 rounded-[2rem] border border-border bg-card p-8 shadow-[var(--shadow-soft)] md:grid-cols-2 md:p-12">
        <div>
          <Eyebrow>Join the Waitlist</Eyebrow>
          <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight md:text-5xl">
            Be among the first to{" "}
            <span className="italic text-primary">taste the future.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tell us about you. We'll reach out as we open up your city.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="grid size-9 place-items-center rounded-full bg-secondary">🔒</span>
            We respect your inbox. No spam — ever.
          </div>
        </div>

        {submitted ? (
          <div className="grid place-items-center rounded-2xl bg-secondary/60 p-10 text-center">
            <div className="text-4xl">🎉</div>
            <h3 className="mt-4 font-display text-2xl font-semibold">You're on the list.</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll be in touch as Soru launches in your city.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" placeholder="Your name" required />
              <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
              <Field label="Mobile Number" name="mobile" type="tel" placeholder="+91" required />
              <Select label="City" name="city" options={["Bengaluru", "Chennai", "Hyderabad", "Other"]} />
            </div>
            <Select
              label="I am a..."
              name="role"
              options={[
                "Customer",
                "Chef",
                "Culinary Student",
                "Homemaker",
                "Caterer",
                "Nutrition Enthusiast",
              ]}
            />
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5"
              >
                Join Waitlist →
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition hover:bg-secondary"
              >
                Become a Founding Chef
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        maxLength={120}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ───────── FAQ ───────── */

function FAQ() {
  const items = [
    {
      q: "What makes this different from food delivery apps?",
      a: "We are not a restaurant marketplace. Soru is a chef-powered ecosystem — every meal is cooked by a verified independent chef, designed around your goals, with full transparency.",
    },
    {
      q: "Can home chefs join?",
      a: "Yes. Homemakers, home chefs, culinary students, professional chefs and caterers are all welcome to apply.",
    },
    {
      q: "How does chef verification work?",
      a: "We verify chef identity, kitchen hygiene standards and culinary skill through a structured on-ground and remote review process.",
    },
    {
      q: "Do chefs need food registrations?",
      a: "We provide FSSAI guidance and compliance checklists to help chefs meet all required food registrations.",
    },
    {
      q: "How do personalized meal plans work?",
      a: "Customers share their goals (e.g. weight loss, high protein). Chefs design meal plans, and the platform manages scheduling, delivery and feedback.",
    },
    {
      q: "Can I subscribe monthly?",
      a: "Yes — weekly and monthly subscriptions across breakfast, lunch, dinner and full-day plans.",
    },
    {
      q: "Which cities are launching first?",
      a: "Bengaluru, Chennai and Hyderabad, with phased expansion across India.",
    },
  ];
  return (
    <section id="faq" className="bg-secondary/40 py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="FAQ"
          title={<>Questions, answered.</>}
        />
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
          {items.map((it, i) => (
            <details key={i} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-6">
                <span className="font-display text-lg font-semibold">{it.q}</span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Final CTA ───────── */

function FinalCTA() {
  return (
    <section className="container-x py-20 md:py-28">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-[color:var(--ink)] p-10 text-center text-[color:var(--cream)] md:p-16">
        <div className="grain-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative">
          <Eyebrow>The mission</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance font-display text-3xl font-semibold leading-tight md:text-5xl">
            We're not building another food delivery app. We're building{" "}
            <span className="italic text-[color:var(--spice)]">trust, one meal at a time.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/75">
            A platform where culinary talent thrives, healthy food becomes more accessible, and
            trust becomes the foundation of every meal. Whether you're a chef building a business or
            a customer looking for better food — this is for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#waitlist"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5"
            >
              Join Waitlist →
            </a>
            <a
              href="#chefs"
              className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Become a Founding Chef
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Footer ───────── */

function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg font-bold">
              T
            </span>
            <span className="font-display text-xl font-semibold">Soru</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Empowering culinary talent. Making healthy food accessible. Launching soon in
            Bengaluru, Chennai, and Hyderabad.
          </p>
        </div>
        <FooterCol
          title="Platform"
          links={["About", "Become a Chef", "Waitlist", "Contact"]}
        />
        <FooterCol
          title="Legal"
          links={["Privacy Policy", "Terms of Service", "Cookies", "Compliance"]}
        />
      </div>
      <div className="border-t border-border">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Soru. Made in India.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground">Instagram</a>
            <a href="#" className="hover:text-foreground">LinkedIn</a>
            <a href="#" className="hover:text-foreground">X</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-primary">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
