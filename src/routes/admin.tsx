import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Download, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — Soru" }] }),
  component: AdminPage,
});

type ChefRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  comments: string | null;
};

type CustRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  preferred_service: string;
  comments: string | null;
};

type WaitlistRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  role: string;
  comments: string | null;
};

type ResearchRow = {
  id: string;
  created_at: string;
  client_submission_id: string;
  audience: string;
  statements: string[];
  customer_order_frequency: string | null;
  customer_monthly_budget: string | null;
  chef_start_timeline: string | null;
  chef_support_needs: string[];
  city: string;
  contact: string | null;
  comments: string | null;
  source: string;
};

type AdminTab = "chefs" | "customers" | "waitlist" | "research";
type EnrollmentRow = ChefRow | CustRow | WaitlistRow;

const STATEMENT_LABELS: Record<string, string> = {
  monthly_plan: "Monthly plan ready",
  direct_from_chefs: "Buy direct from chefs",
  refer_a_cook: "Would refer a cook",
  earn_from_cooking: "Earn from cooking",
  personalized_nutrition: "Personalized nutrition",
  routine_meals: "Routine meals",
};

const AUDIENCE_LABELS: Record<string, string> = {
  customer: "Customer",
  home_cook: "Home cook / homemaker",
  professional_chef: "Professional chef / caterer",
  culinary_student: "Culinary student",
  both: "Customer + cook",
};

const FREQUENCY_LABELS: Record<string, string> = {
  "1_2_weekly": "1–2 meals/week",
  "3_5_weekly": "3–5 meals/week",
  "6_plus_weekly": "6+ meals/week",
};

const BUDGET_LABELS: Record<string, string> = {
  "2999_3999": "₹2,999–₹3,999",
  "4000_5999": "₹4,000–₹5,999",
  "6000_plus": "₹6,000+",
  unsure: "Unsure",
};

const TIMELINE_LABELS: Record<string, string> = {
  ready_now: "Ready now",
  "1_3_months": "Within 1–3 months",
  exploring: "Exploring",
};

const SUPPORT_LABELS: Record<string, string> = {
  customers_orders: "Customers & orders",
  food_license: "FSSAI & licensing",
  menu_pricing: "Menu & pricing",
  subscriptions: "Subscriptions",
  kitchen_verification: "Kitchen verification",
  delivery: "Delivery",
};

function AdminPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "noauth" | "notadmin" | "ok">("checking");
  const [tab, setTab] = useState<AdminTab>("chefs");
  const [chefs, setChefs] = useState<ChefRow[]>([]);
  const [customers, setCustomers] = useState<CustRow[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistRow[]>([]);
  const [research, setResearch] = useState<ResearchRow[]>([]);
  const [q, setQ] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setStatus("noauth");
        return;
      }
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        setStatus("notadmin");
        return;
      }

      const [c, cu, w, r] = await Promise.all([
        supabase.from("chef_enrollments").select("*").order("created_at", { ascending: false }),
        supabase.from("customer_enrollments").select("*").order("created_at", { ascending: false }),
        supabase.from("waitlist_entries").select("*").order("created_at", { ascending: false }),
        supabase
          .from("market_research_responses")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);
      setStatus("ok");
      if (c.error) toast.error(c.error.message);
      else setChefs(c.data as ChefRow[]);
      if (cu.error) toast.error(cu.error.message);
      else setCustomers(cu.data as CustRow[]);
      if (w.error) toast.error(w.error.message);
      else setWaitlist(w.data as WaitlistRow[]);
      if (r.error) toast.error(r.error.message);
      else setResearch(r.data as ResearchRow[]);
    })();
  }, []);

  const standardRows: EnrollmentRow[] =
    tab === "chefs" ? chefs : tab === "customers" ? customers : waitlist;
  const filteredStandardRows = standardRows.filter(
    (row) =>
      !q ||
      [
        row.name,
        row.email,
        row.phone,
        row.comments,
        "role" in row ? row.role : null,
        "preferred_service" in row ? row.preferred_service : null,
        "city" in row ? row.city : null,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );

  const filteredResearch = useMemo(() => {
    const query = q.trim().toLowerCase();
    return research.filter((row) => {
      const matchesAudience = audienceFilter === "all" || row.audience === audienceFilter;
      const matchesCity = cityFilter === "all" || row.city === cityFilter;
      const matchesQuery =
        !query ||
        [
          AUDIENCE_LABELS[row.audience],
          row.city,
          row.contact,
          row.comments,
          ...row.statements.map((item) => STATEMENT_LABELS[item]),
          ...row.chef_support_needs.map((item) => SUPPORT_LABELS[item]),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      return matchesAudience && matchesCity && matchesQuery;
    });
  }, [audienceFilter, cityFilter, q, research]);

  const cities = Array.from(new Set(research.map((row) => row.city))).sort();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  function changeTab(nextTab: AdminTab) {
    setTab(nextTab);
    setQ("");
  }

  function exportCsv() {
    if (tab === "research") {
      const headers: Array<keyof ResearchRow> = [
        "created_at",
        "audience",
        "statements",
        "customer_order_frequency",
        "customer_monthly_budget",
        "chef_start_timeline",
        "chef_support_needs",
        "city",
        "contact",
        "comments",
      ];
      downloadCsv(
        headers,
        filteredResearch.map((row) =>
          headers.map((header) => {
            const value = row[header];
            return Array.isArray(value) ? value.join(" | ") : String(value ?? "");
          }),
        ),
        "market-research",
      );
      return;
    }

    const headers =
      tab === "chefs"
        ? ["created_at", "name", "phone", "email", "role", "comments"]
        : tab === "customers"
          ? ["created_at", "name", "phone", "email", "preferred_service", "comments"]
          : ["created_at", "name", "phone", "email", "city", "role", "comments"];
    downloadCsv(
      headers,
      filteredStandardRows.map((row) => headers.map((header) => getEnrollmentValue(row, header))),
      tab,
    );
  }

  if (status === "checking") return <Centered>Loading…</Centered>;
  if (status === "noauth")
    return (
      <Centered>
        <p>Please sign in to access admin.</p>
        <Link
          to="/auth"
          className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          Sign in
        </Link>
      </Centered>
    );
  if (status === "notadmin")
    return (
      <Centered>
        <p className="text-lg font-medium">Not authorized</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account is signed in but doesn’t have admin access.
        </p>
        <button
          onClick={signOut}
          className="mt-4 rounded-full border border-border px-4 py-2 text-sm"
        >
          Sign out
        </button>
      </Centered>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-white/80 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo />
            <span className="hidden text-sm text-muted-foreground sm:inline">Admin</span>
          </Link>
          <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        </div>
      </header>

      <main className="container-x py-10">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">
              Soru admin
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
              Enrollments & market signals
            </h1>
          </div>
          {tab === "research" && (
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Private, aggregated evidence from people who chose to share their view.
            </p>
          )}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-1 border-b border-border">
          <TabBtn active={tab === "chefs"} onClick={() => changeTab("chefs")}>
            Chefs ({chefs.length})
          </TabBtn>
          <TabBtn active={tab === "customers"} onClick={() => changeTab("customers")}>
            Customers ({customers.length})
          </TabBtn>
          <TabBtn active={tab === "waitlist"} onClick={() => changeTab("waitlist")}>
            Waitlist ({waitlist.length})
          </TabBtn>
          <TabBtn active={tab === "research"} onClick={() => changeTab("research")}>
            Research ({research.length})
          </TabBtn>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {tab === "research" && (
            <>
              <select
                value={audienceFilter}
                onChange={(event) => setAudienceFilter(event.target.value)}
                aria-label="Filter research by audience"
                className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="all">All audiences</option>
                {Object.entries(AUDIENCE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={cityFilter}
                onChange={(event) => setCityFilter(event.target.value)}
                aria-label="Filter research by city"
                className="rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="all">All cities</option>
                {cities.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </>
          )}
          <label className="relative ml-auto min-w-56 flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Search</span>
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search…"
              className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Download className="size-4" /> Export CSV
          </button>
        </div>

        {tab === "research" ? (
          <ResearchDashboard rows={filteredResearch} />
        ) : (
          <EnrollmentTable tab={tab} rows={filteredStandardRows} />
        )}
      </main>
    </div>
  );
}

function ResearchDashboard({ rows }: { rows: ResearchRow[] }) {
  const customerRows = rows.filter(isCustomer);
  const chefRows = rows.filter(isChef);
  const monthlyPlan = metric(customerRows, (row) => row.statements.includes("monthly_plan"));
  const directChefs = metric(rows, (row) => row.statements.includes("direct_from_chefs"));
  const referrals = metric(rows, (row) => row.statements.includes("refer_a_cook"));
  const chefEarning = metric(chefRows, (row) => row.statements.includes("earn_from_cooking"));
  const dates = rows.map((row) => new Date(row.created_at).getTime()).filter(Number.isFinite);
  const dateRange = dates.length
    ? `${new Date(Math.min(...dates)).toLocaleDateString()} – ${new Date(Math.max(...dates)).toLocaleDateString()}`
    : "No responses in this view";

  return (
    <div className="mt-7 space-y-6">
      <div className="rounded-3xl bg-[color:var(--ink)] p-6 text-white md:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[color:var(--saffron)]">
              <BarChart3 className="size-4" /> Investor evidence
            </div>
            <h2 className="mt-3 font-display text-3xl font-medium md:text-4xl">
              What people are telling Soru
            </h2>
          </div>
          <p className="text-sm text-white/55">
            Visible sample: <strong className="text-white">{rows.length}</strong> · {dateRange}
          </p>
        </div>
        <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Monthly-plan intent" metric={monthlyPlan} />
          <MetricCard label="Excited to buy from chefs" metric={directChefs} />
          <MetricCard label="Would refer a great cook" metric={referrals} />
          <MetricCard label="Chef earning intent" metric={chefEarning} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <DistributionCard
          title="Expected order frequency"
          rows={customerRows}
          values={Object.entries(FREQUENCY_LABELS)}
          getValue={(row) => row.customer_order_frequency}
        />
        <DistributionCard
          title="Comfortable monthly budget"
          rows={customerRows}
          values={Object.entries(BUDGET_LABELS)}
          getValue={(row) => row.customer_monthly_budget}
        />
        <DistributionCard
          title="Chef readiness"
          rows={chefRows}
          values={Object.entries(TIMELINE_LABELS)}
          getValue={(row) => row.chef_start_timeline}
        />
        <MultiDistributionCard
          title="Support chefs need most"
          rows={chefRows}
          values={Object.entries(SUPPORT_LABELS)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-display text-2xl font-medium">Individual responses</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Private responses for follow-up and qualitative research.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Audience</th>
                <th className="px-4 py-3">Signals</th>
                <th className="px-4 py-3">Validation</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Contact & comment</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No research responses match these filters yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-border align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-medium">{AUDIENCE_LABELS[row.audience]}</td>
                    <td className="max-w-sm px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {row.statements.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary"
                          >
                            {STATEMENT_LABELS[item]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="max-w-xs px-4 py-4 text-xs leading-6 text-muted-foreground">
                      {row.customer_order_frequency && (
                        <div>{FREQUENCY_LABELS[row.customer_order_frequency]}</div>
                      )}
                      {row.customer_monthly_budget && (
                        <div>{BUDGET_LABELS[row.customer_monthly_budget]} monthly</div>
                      )}
                      {row.chef_start_timeline && (
                        <div>{TIMELINE_LABELS[row.chef_start_timeline]}</div>
                      )}
                      {row.chef_support_needs.length > 0 && (
                        <div>
                          {row.chef_support_needs.map((item) => SUPPORT_LABELS[item]).join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">{row.city}</td>
                    <td className="max-w-sm px-4 py-4">
                      <div className="font-medium">{row.contact || "No contact shared"}</div>
                      {row.comments && (
                        <div className="mt-1 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                          {row.comments}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function EnrollmentTable({
  tab,
  rows,
}: {
  tab: Exclude<AdminTab, "research">;
  rows: EnrollmentRow[];
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">
              {tab === "chefs" ? "Role" : tab === "customers" ? "Preferred Service" : "City · Role"}
            </th>
            <th className="px-4 py-3">Comments</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                No submissions yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-border">
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(row.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3">{row.phone}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{getEnrollmentCategory(row, tab)}</td>
                <td className="max-w-sm px-4 py-3 text-muted-foreground">{row.comments || "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function MetricCard({ label, metric: value }: { label: string; metric: Metric }) {
  return (
    <div className="bg-[color:var(--ink)] p-5 md:p-6">
      <div className="font-display text-4xl text-[color:var(--saffron)]">{value.percent}%</div>
      <div className="mt-2 text-sm font-semibold">{label}</div>
      <div className="mt-1 text-xs text-white/45">
        {value.count} of {value.sample} eligible responses
      </div>
    </div>
  );
}

function DistributionCard({
  title,
  rows,
  values,
  getValue,
}: {
  title: string;
  rows: ResearchRow[];
  values: Array<[string, string]>;
  getValue: (row: ResearchRow) => string | null;
}) {
  return (
    <DistributionShell title={title} sample={rows.length}>
      {values.map(([value, label]) => {
        const count = rows.filter((row) => getValue(row) === value).length;
        return <DistributionBar key={value} label={label} count={count} sample={rows.length} />;
      })}
    </DistributionShell>
  );
}

function MultiDistributionCard({
  title,
  rows,
  values,
}: {
  title: string;
  rows: ResearchRow[];
  values: Array<[string, string]>;
}) {
  return (
    <DistributionShell title={title} sample={rows.length}>
      {values.map(([value, label]) => {
        const count = rows.filter((row) => row.chef_support_needs.includes(value)).length;
        return <DistributionBar key={value} label={label} count={count} sample={rows.length} />;
      })}
    </DistributionShell>
  );
}

function DistributionShell({
  title,
  sample,
  children,
}: {
  title: string;
  sample: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl font-medium">{title}</h3>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
          n={sample}
        </span>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function DistributionBar({
  label,
  count,
  sample,
}: {
  label: string;
  count: number;
  sample: number;
}) {
  const percent = sample ? Math.round((count / sample) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between gap-3 text-xs">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {count} · {percent}%
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

type Metric = { count: number; sample: number; percent: number };

function metric(rows: ResearchRow[], predicate: (row: ResearchRow) => boolean): Metric {
  const count = rows.filter(predicate).length;
  return {
    count,
    sample: rows.length,
    percent: rows.length ? Math.round((count / rows.length) * 100) : 0,
  };
}

function isCustomer(row: ResearchRow) {
  return row.audience === "customer" || row.audience === "both";
}

function isChef(row: ResearchRow) {
  return row.audience !== "customer";
}

function downloadCsv(headers: readonly string[], rows: string[][], filename: string) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))];
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function getEnrollmentValue(row: EnrollmentRow, header: string) {
  if (header === "created_at") return row.created_at;
  if (header === "name") return row.name;
  if (header === "phone") return row.phone;
  if (header === "email") return row.email;
  if (header === "comments") return row.comments ?? "";
  if (header === "role" && "role" in row) return row.role;
  if (header === "preferred_service" && "preferred_service" in row) return row.preferred_service;
  if (header === "city" && "city" in row) return row.city;
  return "";
}

function getEnrollmentCategory(row: EnrollmentRow, tab: Exclude<AdminTab, "research">) {
  if (tab === "chefs" && "role" in row) return formatLabel(row.role);
  if (tab === "customers" && "preferred_service" in row) return row.preferred_service;
  if (tab === "waitlist" && "city" in row && "role" in row)
    return `${row.city} · ${formatLabel(row.role)}`;
  return "—";
}

function formatLabel(value: string) {
  return value
    ?.split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-sm font-medium transition ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
    >
      {children}
      {active && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-primary" />}
    </button>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-sm text-center">{children}</div>
    </div>
  );
}
