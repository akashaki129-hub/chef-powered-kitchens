import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  ClipboardList,
  HeartPulse,
  LogOut,
  MapPin,
  PackageCheck,
  Search,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { BrandLogo } from "@/components/brand-logo";
import { supabase } from "@/integrations/supabase/client";
import {
  buildLunchboxSummary,
  buildMealPlanSummary,
  currency,
  db,
  getCurrentUser,
  joinList,
  lunchboxGoalOptions,
  nutritionFocusOptions,
  type ChefProfile,
  type CustomerOrder,
  type LunchboxRequest,
  type MealPlanRequest,
  type MenuItem,
  type Profile,
  type Subscription,
} from "@/lib/soru-app";

export const Route = createFileRoute("/app")({
  ssr: false,
  head: () => ({ meta: [{ title: "Soru App — Customer Dashboard" }] }),
  component: CustomerAppPage,
});

type Tab = "explore" | "subscriptions" | "meal-plans" | "lunchbox" | "orders";

function CustomerAppPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [chefs, setChefs] = useState<ChefProfile[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlanRequest[]>([]);
  const [lunchboxes, setLunchboxes] = useState<LunchboxRequest[]>([]);
  const [tab, setTab] = useState<Tab>("explore");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const user = await getCurrentUser();
    if (!user) {
      navigate({ to: "/soru-auth", search: { role: "customer" } });
      return;
    }
    setUserId(user.id);

    const [
      profileRes,
      chefsRes,
      menusRes,
      ordersRes,
      subscriptionsRes,
      mealPlansRes,
      lunchboxesRes,
    ] = await Promise.all([
      db.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      db.from("chef_profiles").select("*").order("created_at", { ascending: false }),
      db
        .from("chef_menu_items")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      db
        .from("customer_orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      db
        .from("customer_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      db
        .from("meal_plan_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      db
        .from("lunchbox_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (profileRes.error) toast.error("Could not load your profile.");
    if (chefsRes.error || menusRes.error) toast.error("Could not load chefs yet.");

    setProfile(profileRes.data || null);
    setChefs(chefsRes.data || []);
    setMenus(menusRes.data || []);
    setOrders(ordersRes.data || []);
    setSubscriptions(subscriptionsRes.data || []);
    setMealPlans(mealPlansRes.data || []);
    setLunchboxes(lunchboxesRes.data || []);
    setCityFilter(profileRes.data?.city || "");
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/soru-auth", search: { role: "customer" } });
  }

  const sortedChefs = useMemo(() => {
    const needle = cityFilter.trim().toLowerCase();
    return [...chefs].sort((a, b) => {
      const aMatch = needle && a.city.toLowerCase().includes(needle) ? 0 : 1;
      const bMatch = needle && b.city.toLowerCase().includes(needle) ? 0 : 1;
      return aMatch - bMatch || a.display_name.localeCompare(b.display_name);
    });
  }, [chefs, cityFilter]);

  async function createOrder(menu: MenuItem, chef: ChefProfile) {
    if (!profile?.city) {
      toast.error("Add your city in your profile before placing an order request.");
      return;
    }
    setSaving(true);
    const { error } = await db.from("customer_orders").insert({
      user_id: userId,
      chef_profile_id: chef.id,
      menu_item_id: menu.id,
      order_type: "menu_item",
      quantity: 1,
      delivery_city: profile.city,
      delivery_area: profile.city,
      notes: `Interested in ${menu.name}`,
      status: "pending",
    });
    setSaving(false);
    if (error) {
      toast.error("Could not create the order request.");
      return;
    }
    toast.success("Order request sent.");
    await load();
    setTab("orders");
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onSignOut={signOut} profile={profile} />
      <main className="container-x py-8 md:py-10">
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-soft md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Customer dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold md:text-5xl">Food that fits your life.</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                Explore nearby chefs, request subscriptions, personalize nutrition plans, and build
                healthy lunchboxes for kids.
              </p>
            </div>
            <Link
              to="/chef-studio"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-bold hover:bg-muted"
            >
              I’m also a chef
            </Link>
          </div>
        </section>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          <TabButton active={tab === "explore"} onClick={() => setTab("explore")} icon={<Search />}>
            Explore
          </TabButton>
          <TabButton
            active={tab === "subscriptions"}
            onClick={() => setTab("subscriptions")}
            icon={<CalendarDays />}
          >
            Subscriptions
          </TabButton>
          <TabButton
            active={tab === "meal-plans"}
            onClick={() => setTab("meal-plans")}
            icon={<Sparkles />}
          >
            Meal plans
          </TabButton>
          <TabButton
            active={tab === "lunchbox"}
            onClick={() => setTab("lunchbox")}
            icon={<HeartPulse />}
          >
            Lunchbox
          </TabButton>
          <TabButton
            active={tab === "orders"}
            onClick={() => setTab("orders")}
            icon={<PackageCheck />}
          >
            Orders
          </TabButton>
        </div>

        {loading ? (
          <EmptyCard title="Loading Soru…" text="Getting your dashboard ready." />
        ) : (
          <>
            {tab === "explore" && (
              <ExploreSection
                chefs={sortedChefs}
                menus={menus}
                cityFilter={cityFilter}
                setCityFilter={setCityFilter}
                createOrder={createOrder}
                saving={saving}
              />
            )}
            {tab === "subscriptions" && (
              <SubscriptionSection
                userId={userId}
                profile={profile}
                chefs={chefs}
                subscriptions={subscriptions}
                afterSave={load}
              />
            )}
            {tab === "meal-plans" && (
              <MealPlanSection
                userId={userId}
                profile={profile}
                mealPlans={mealPlans}
                afterSave={load}
              />
            )}
            {tab === "lunchbox" && (
              <LunchboxSection
                userId={userId}
                profile={profile}
                lunchboxes={lunchboxes}
                afterSave={load}
              />
            )}
            {tab === "orders" && <OrdersSection orders={orders} menus={menus} chefs={chefs} />}
          </>
        )}
      </main>
    </div>
  );
}

function AppHeader({ profile, onSignOut }: { profile: Profile | null; onSignOut: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" aria-label="Soru home">
          <BrandLogo />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {profile?.full_name || "Soru member"}
          </span>
          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

function ExploreSection({
  chefs,
  menus,
  cityFilter,
  setCityFilter,
  createOrder,
  saving,
}: {
  chefs: ChefProfile[];
  menus: MenuItem[];
  cityFilter: string;
  setCityFilter: (value: string) => void;
  createOrder: (menu: MenuItem, chef: ChefProfile) => void;
  saving: boolean;
}) {
  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[18rem_1fr]">
      <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-soft">
        <h2 className="text-xl font-semibold">Closest chefs</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We sort by your city first. Actual distance matching can be connected once chef addresses
          are verified.
        </p>
        <label className="mt-5 block">
          <span className="mb-1.5 block text-sm font-semibold">City / area</span>
          <input
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="app-input"
            placeholder="Search city"
          />
        </label>
      </aside>

      <div className="space-y-5">
        {chefs.length === 0 ? (
          <EmptyCard
            title="No chefs listed yet"
            text="Once verified chefs or home cooks publish their profile, they will appear here."
          />
        ) : (
          chefs.map((chef) => {
            const chefMenus = menus.filter((menu) => menu.chef_profile_id === chef.id);
            return (
              <article
                key={chef.id}
                className="rounded-3xl border border-border bg-card p-5 shadow-soft md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-semibold">
                        {chef.kitchen_name || chef.display_name}
                      </h3>
                      <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold">
                        {chef.verification_status === "verified" ? "Verified" : "Profile submitted"}
                      </span>
                    </div>
                    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4" />{" "}
                      {[chef.area, chef.city].filter(Boolean).join(", ")}
                    </p>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {chef.bio || "This chef has not added a bio yet."}
                    </p>
                    <p className="mt-3 text-sm">
                      <span className="font-bold">Speciality:</span> {joinList(chef.specialties)}
                    </p>
                    <p className="mt-1 text-sm">
                      <span className="font-bold">Cuisines:</span> {joinList(chef.cuisines)}
                    </p>
                  </div>
                  <ChefHat className="size-10 text-primary" />
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {chefMenus.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                      Menu not published yet.
                    </div>
                  ) : (
                    chefMenus.map((menu) => (
                      <div
                        key={menu.id}
                        className="rounded-2xl border border-border bg-background p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-bold">{menu.name}</h4>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {menu.description || "Chef-made meal"}
                            </p>
                          </div>
                          <span className="whitespace-nowrap text-sm font-extrabold">
                            {currency(menu.price_inr)}
                          </span>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">
                          {joinList(menu.dietary_tags)} · Allergens: {joinList(menu.allergens)}
                        </p>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => createOrder(menu, chef)}
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-60"
                        >
                          Request order <ArrowRight className="size-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
      <style>{inputStyles}</style>
    </section>
  );
}

function SubscriptionSection({
  userId,
  profile,
  chefs,
  subscriptions,
  afterSave,
}: {
  userId: string;
  profile: Profile | null;
  chefs: ChefProfile[];
  subscriptions: Subscription[];
  afterSave: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    chef_profile_id: "",
    plan_type: "Monthly weekday meals",
    meal_focus: "",
    meals_per_week: 5,
    budget_range: "₹2,999–₹3,999",
    dietary_preferences: "",
    allergies: "",
    delivery_city: profile?.city || "",
    delivery_area: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form.delivery_city.trim()) {
      toast.error("Please add your delivery city.");
      return;
    }
    setSaving(true);
    const { error } = await db.from("customer_subscriptions").insert({
      user_id: userId,
      chef_profile_id: form.chef_profile_id || null,
      plan_type: form.plan_type,
      meal_focus: form.meal_focus || null,
      meals_per_week: Number(form.meals_per_week),
      budget_range: form.budget_range,
      dietary_preferences: form.dietary_preferences
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      allergies: form.allergies || null,
      delivery_city: form.delivery_city,
      delivery_area: form.delivery_area || null,
      notes: form.notes || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Could not save subscription request.");
      return;
    }
    toast.success("Subscription request saved.");
    await afterSave();
  }

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem]">
      <form onSubmit={save} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <SectionTitle
          icon={<CalendarDays />}
          title="Choose your subscription"
          text="Request daily, weekly, or monthly chef-made meals."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Preferred chef">
            <select
              value={form.chef_profile_id}
              onChange={(e) => setForm({ ...form, chef_profile_id: e.target.value })}
              className="app-input"
            >
              <option value="">Match me with a chef</option>
              {chefs.map((chef) => (
                <option key={chef.id} value={chef.id}>
                  {chef.kitchen_name || chef.display_name} — {chef.city}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Plan type">
            <select
              value={form.plan_type}
              onChange={(e) => setForm({ ...form, plan_type: e.target.value })}
              className="app-input"
            >
              <option>Monthly weekday meals</option>
              <option>Weekly lunchbox subscription</option>
              <option>Family meal plan</option>
              <option>Office lunch plan</option>
              <option>Student meal plan</option>
            </select>
          </Field>
          <Field label="Meal focus">
            <input
              value={form.meal_focus}
              onChange={(e) => setForm({ ...form, meal_focus: e.target.value })}
              className="app-input"
              placeholder="High protein, vegetarian, regional…"
            />
          </Field>
          <Field label="Meals per week">
            <input
              type="number"
              min={1}
              max={21}
              value={form.meals_per_week}
              onChange={(e) => setForm({ ...form, meals_per_week: Number(e.target.value) })}
              className="app-input"
            />
          </Field>
          <Field label="Budget">
            <select
              value={form.budget_range}
              onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
              className="app-input"
            >
              <option>₹2,999–₹3,999</option>
              <option>₹4,000–₹5,999</option>
              <option>₹6,000+</option>
              <option>Not sure yet</option>
            </select>
          </Field>
          <Field label="Dietary preferences">
            <input
              value={form.dietary_preferences}
              onChange={(e) => setForm({ ...form, dietary_preferences: e.target.value })}
              className="app-input"
              placeholder="Vegan, Jain, low oil"
            />
          </Field>
          <Field label="Delivery city">
            <input
              required
              value={form.delivery_city}
              onChange={(e) => setForm({ ...form, delivery_city: e.target.value })}
              className="app-input"
            />
          </Field>
          <Field label="Delivery area">
            <input
              value={form.delivery_area}
              onChange={(e) => setForm({ ...form, delivery_area: e.target.value })}
              className="app-input"
              placeholder="Area / locality"
            />
          </Field>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Allergies">
            <input
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              className="app-input"
              placeholder="Nuts, dairy, gluten…"
            />
          </Field>
          <Field label="Notes">
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="app-input"
              placeholder="Timing, spice level, delivery preference…"
            />
          </Field>
        </div>
        <button
          disabled={saving}
          className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Request subscription"}
        </button>
      </form>

      <HistoryCard
        title="Your subscriptions"
        items={subscriptions}
        empty="No subscription requests yet."
      />
      <style>{inputStyles}</style>
    </section>
  );
}

function MealPlanSection({
  userId,
  profile,
  mealPlans,
  afterSave,
}: {
  userId: string;
  profile: Profile | null;
  mealPlans: MealPlanRequest[];
  afterSave: () => Promise<void>;
}) {
  const [focus, setFocus] = useState<string[]>([]);
  const [form, setForm] = useState({
    goal: "",
    diet_type: "flexible",
    allergies: "",
    meals_per_day: 2,
    budget_range: "₹2,999–₹3,999",
    city: profile?.city || "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form.goal.trim() || !form.city.trim()) {
      toast.error("Please add your goal and city.");
      return;
    }
    const aiSummary = buildMealPlanSummary({
      goal: form.goal,
      nutritionFocus: focus,
      dietType: form.diet_type,
      allergies: form.allergies,
      mealsPerDay: Number(form.meals_per_day),
      budgetRange: form.budget_range,
      notes: form.notes,
    });
    setSaving(true);
    const { error } = await db.from("meal_plan_requests").insert({
      user_id: userId,
      goal: form.goal,
      nutrition_focus: focus,
      diet_type: form.diet_type,
      allergies: form.allergies || null,
      meals_per_day: Number(form.meals_per_day),
      budget_range: form.budget_range,
      city: form.city,
      notes: form.notes || null,
      ai_summary: aiSummary,
    });
    setSaving(false);
    if (error) {
      toast.error("Could not save meal-plan request.");
      return;
    }
    toast.success("Personalized meal-plan request saved.");
    await afterSave();
  }

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem]">
      <form onSubmit={save} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <SectionTitle
          icon={<Sparkles />}
          title="Personalised nutrition meal plans"
          text="Tell Soru your goal, allergies, budget, and food style. We’ll create a chef-ready brief."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Primary goal">
            <input
              required
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              className="app-input"
              placeholder="Fitness, weight loss, clean vegetarian…"
            />
          </Field>
          <Field label="Diet type">
            <select
              value={form.diet_type}
              onChange={(e) => setForm({ ...form, diet_type: e.target.value })}
              className="app-input"
            >
              <option value="flexible">Flexible</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
              <option value="non_vegetarian">Non-vegetarian</option>
              <option value="jain">Jain</option>
            </select>
          </Field>
        </div>
        <CheckGroup options={nutritionFocusOptions} selected={focus} setSelected={setFocus} />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Allergies">
            <input
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              className="app-input"
              placeholder="Nuts, dairy, gluten…"
            />
          </Field>
          <Field label="Meals per day">
            <input
              type="number"
              min={1}
              max={6}
              value={form.meals_per_day}
              onChange={(e) => setForm({ ...form, meals_per_day: Number(e.target.value) })}
              className="app-input"
            />
          </Field>
          <Field label="Monthly budget">
            <select
              value={form.budget_range}
              onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
              className="app-input"
            >
              <option>₹2,999–₹3,999</option>
              <option>₹4,000–₹5,999</option>
              <option>₹6,000+</option>
              <option>Not sure yet</option>
            </select>
          </Field>
          <Field label="City">
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="app-input"
            />
          </Field>
        </div>
        <Field label="Anything else?">
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="app-input min-h-28"
            placeholder="Timing, taste preference, medical guidance from doctor, etc."
          />
        </Field>
        <button
          disabled={saving}
          className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Create meal-plan brief"}
        </button>
      </form>

      <HistoryCard title="Your meal plans" items={mealPlans} empty="No meal-plan requests yet." />
      <style>{inputStyles}</style>
    </section>
  );
}

function LunchboxSection({
  userId,
  profile,
  lunchboxes,
  afterSave,
}: {
  userId: string;
  profile: Profile | null;
  lunchboxes: LunchboxRequest[];
  afterSave: () => Promise<void>;
}) {
  const [goals, setGoals] = useState<string[]>([]);
  const [form, setForm] = useState({
    child_age: "",
    preferences: "",
    dislikes: "",
    allergies: "",
    school_timing: "",
    budget_range: "₹2,999–₹3,999",
    city: profile?.city || "",
  });
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form.city.trim()) {
      toast.error("Please add your city.");
      return;
    }
    const recommendation = buildLunchboxSummary({
      childAge: form.child_age,
      preferences: form.preferences,
      dislikes: form.dislikes,
      allergies: form.allergies,
      healthGoals: goals,
      schoolTiming: form.school_timing,
    });
    setSaving(true);
    const { error } = await db.from("lunchbox_requests").insert({
      user_id: userId,
      child_age: form.child_age || null,
      preferences: form.preferences || null,
      dislikes: form.dislikes || null,
      allergies: form.allergies || null,
      health_goals: goals,
      school_timing: form.school_timing || null,
      budget_range: form.budget_range,
      city: form.city,
      recommendation_summary: recommendation,
    });
    setSaving(false);
    if (error) {
      toast.error("Could not save lunchbox request.");
      return;
    }
    toast.success("Lunchbox request saved.");
    await afterSave();
  }

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_24rem]">
      <form onSubmit={save} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
        <SectionTitle
          icon={<HeartPulse />}
          title="Kids lunchbox customization"
          text="Build lunchboxes around kids’ preferences while nudging the plan toward healthier choices."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Child age">
            <input
              value={form.child_age}
              onChange={(e) => setForm({ ...form, child_age: e.target.value })}
              className="app-input"
            />
          </Field>
          <Field label="School timing">
            <input
              value={form.school_timing}
              onChange={(e) => setForm({ ...form, school_timing: e.target.value })}
              className="app-input"
              placeholder="8:30 AM lunch break"
            />
          </Field>
          <Field label="What they like">
            <input
              value={form.preferences}
              onChange={(e) => setForm({ ...form, preferences: e.target.value })}
              className="app-input"
              placeholder="Paneer, dosa, pasta…"
            />
          </Field>
          <Field label="What they avoid">
            <input
              value={form.dislikes}
              onChange={(e) => setForm({ ...form, dislikes: e.target.value })}
              className="app-input"
              placeholder="Too spicy, bitter vegetables…"
            />
          </Field>
          <Field label="Allergies">
            <input
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              className="app-input"
              placeholder="Nuts, dairy…"
            />
          </Field>
          <Field label="City">
            <input
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="app-input"
            />
          </Field>
        </div>
        <CheckGroup options={lunchboxGoalOptions} selected={goals} setSelected={setGoals} />
        <Field label="Monthly budget">
          <select
            value={form.budget_range}
            onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
            className="app-input"
          >
            <option>₹2,999–₹3,999</option>
            <option>₹4,000–₹5,999</option>
            <option>₹6,000+</option>
            <option>Not sure yet</option>
          </select>
        </Field>
        <button
          disabled={saving}
          className="mt-5 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Request lunchbox plan"}
        </button>
      </form>

      <HistoryCard title="Lunchbox requests" items={lunchboxes} empty="No lunchbox requests yet." />
      <style>{inputStyles}</style>
    </section>
  );
}

function OrdersSection({
  orders,
  menus,
  chefs,
}: {
  orders: CustomerOrder[];
  menus: MenuItem[];
  chefs: ChefProfile[];
}) {
  if (orders.length === 0) {
    return (
      <div className="mt-6">
        <EmptyCard
          title="No orders yet"
          text="When you request a chef menu item, it will appear here."
        />
      </div>
    );
  }
  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
      <SectionTitle
        icon={<ClipboardList />}
        title="Your orders"
        text="Order requests and status updates."
      />
      <div className="mt-5 space-y-3">
        {orders.map((order) => {
          const menu = menus.find((item) => item.id === order.menu_item_id);
          const chef = chefs.find((item) => item.id === order.chef_profile_id);
          return (
            <div key={order.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{menu?.name || titleFromType(order.order_type)}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {chef?.kitchen_name || chef?.display_name || "Chef matching pending"} ·{" "}
                    {order.delivery_city}
                  </p>
                </div>
                <StatusPill status={order.status} />
              </div>
              {order.notes && <p className="mt-3 text-sm text-muted-foreground">{order.notes}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HistoryCard({ title, items, empty }: { title: string; items: any[]; empty: string }) {
  return (
    <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-soft">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            {empty}
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold">
                    {item.plan_type ||
                      item.goal ||
                      item.recommendation_summary?.slice(0, 42) ||
                      "Request"}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <StatusPill status={item.status} />
              </div>
              {(item.ai_summary || item.recommendation_summary || item.notes) && (
                <p className="mt-3 text-xs leading-5 text-muted-foreground">
                  {item.ai_summary || item.recommendation_summary || item.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

function SectionTitle({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-foreground">
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function CheckGroup({
  options,
  selected,
  setSelected,
}: {
  options: string[];
  selected: string[];
  setSelected: (value: string[]) => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() =>
              setSelected(
                active ? selected.filter((item) => item !== option) : [...selected, option],
              )
            }
            className={`rounded-full border px-3 py-2 text-xs font-bold ${
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function TabButton({
  children,
  icon,
  active,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactElement;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon && <span className="[&_svg]:size-4">{icon}</span>}
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}

function EmptyCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center shadow-soft">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold capitalize text-foreground">
      {status.replace(/_/g, " ")}
    </span>
  );
}

function titleFromType(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const inputStyles = `
  .app-input {
    width: 100%;
    border-radius: 0.9rem;
    border: 1px solid var(--border);
    background: var(--background);
    padding: 0.78rem 0.95rem;
    font-size: 0.95rem;
    color: var(--foreground);
    outline: none;
  }
  .app-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 18%, transparent);
  }
`;
