import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

function AdminPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "noauth" | "notadmin" | "ok">("checking");
  const [tab, setTab] = useState<"chefs" | "customers" | "waitlist">("chefs");
  const [chefs, setChefs] = useState<ChefRow[]>([]);
  const [customers, setCustomers] = useState<CustRow[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistRow[]>([]);
  const [q, setQ] = useState("");

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
      setStatus("ok");
      const [c, cu, w] = await Promise.all([
        supabase.from("chef_enrollments").select("*").order("created_at", { ascending: false }),
        supabase.from("customer_enrollments").select("*").order("created_at", { ascending: false }),
        supabase.from("waitlist_entries").select("*").order("created_at", { ascending: false }),
      ]);
      if (c.error) toast.error(c.error.message);
      else setChefs(c.data as ChefRow[]);
      if (cu.error) toast.error(cu.error.message);
      else setCustomers(cu.data as CustRow[]);
      if (w.error) toast.error(w.error.message);
      else setWaitlist(w.data as WaitlistRow[]);
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
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
          Your account is signed in but doesn't have admin access.
        </p>
        <button
          onClick={signOut}
          className="mt-4 rounded-full border border-border px-4 py-2 text-sm"
        >
          Sign out
        </button>
      </Centered>
    );

  const rows = tab === "chefs" ? chefs : tab === "customers" ? customers : waitlist;
  const filtered = rows.filter(
    (r: any) =>
      !q ||
      [r.name, r.email, r.phone, r.role, r.preferred_service, r.city, r.comments]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );

  function exportCsv() {
    const headers =
      tab === "chefs"
        ? ["created_at", "name", "phone", "email", "role", "comments"]
        : tab === "customers"
          ? ["created_at", "name", "phone", "email", "preferred_service", "comments"]
          : ["created_at", "name", "phone", "email", "city", "role", "comments"];
    const lines = [headers.join(",")].concat(
      filtered.map((r: any) =>
        headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","),
      ),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
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
        <h1 className="text-3xl font-semibold tracking-tight">Enrollments</h1>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-border">
          <TabBtn active={tab === "chefs"} onClick={() => setTab("chefs")}>
            Chefs ({chefs.length})
          </TabBtn>
          <TabBtn active={tab === "customers"} onClick={() => setTab("customers")}>
            Customers ({customers.length})
          </TabBtn>
          <TabBtn active={tab === "waitlist"} onClick={() => setTab("waitlist")}>
            Waitlist ({waitlist.length})
          </TabBtn>
          <div className="ml-auto flex items-center gap-2 pb-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="rounded-full border border-border bg-background px-4 py-1.5 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={exportCsv}
              className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-muted"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">
                  {tab === "chefs"
                    ? "Role"
                    : tab === "customers"
                      ? "Preferred Service"
                      : "City · Role"}
                </th>
                <th className="px-4 py-3">Comments</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                filtered.map((r: any) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium">{r.name}</td>
                    <td className="px-4 py-3">{r.phone}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">
                      {tab === "chefs"
                        ? formatRole(r.role)
                        : tab === "customers"
                          ? r.preferred_service
                          : `${r.city} · ${formatRole(r.role)}`}
                    </td>
                    <td className="max-w-sm px-4 py-3 text-muted-foreground">
                      {r.comments || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function formatRole(r: string) {
  return r
    ?.split("_")
    .map((s) => s[0].toUpperCase() + s.slice(1))
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
