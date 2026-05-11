import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Recycle, Bus, Trees, HandHeart, Bike, Sparkles,
  Coffee, Ticket, Waves, BookOpen, Award, Leaf, MapPin,
} from "lucide-react";
import heroImg from "@/assets/reykjavik-hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Reykjavík Stig — Earn social points for a kinder city" },
      {
        name: "description",
        content:
          "Reykjavík Stig rewards residents for civic actions like recycling, volunteering and using transit. Inspired by CopenPay.",
      },
      { property: "og:title", content: "Reykjavík Stig" },
      { property: "og:description", content: "Earn social points for a kinder Reykjavík." },
      { property: "og:image", content: heroImg },
    ],
  }),
});

type Action = {
  id: string;
  title: string;
  detail: string;
  points: number;
  icon: React.ComponentType<{ className?: string }>;
};

type Reward = {
  id: string;
  title: string;
  partner: string;
  cost: number;
  icon: React.ComponentType<{ className?: string }>;
};

const ACTIONS: Action[] = [
  { id: "recycle", title: "Recycle at a Sorpa station", detail: "Drop off plastics, paper or glass at any Sorpa.", points: 25, icon: Recycle },
  { id: "bus", title: "Ride Strætó instead of driving", detail: "Tap into the city bus for your commute.", points: 15, icon: Bus },
  { id: "bike", title: "Cycle 5 km in the city", detail: "Use Reykjavík bike paths for errands or commute.", points: 20, icon: Bike },
  { id: "volunteer", title: "Volunteer 1 hour", detail: "Help at Rauði Krossinn or a neighbourhood centre.", points: 60, icon: HandHeart },
  { id: "park", title: "Pick up litter in a park", detail: "Snap a before/after at Klambratún or Elliðaárdalur.", points: 30, icon: Trees },
  { id: "library", title: "Borrow a book from Borgarbókasafn", detail: "Read instead of buy — share when done.", points: 10, icon: BookOpen },
];

const REWARDS: Reward[] = [
  { id: "coffee", title: "Free filter coffee", partner: "Reykjavík Roasters", cost: 40, icon: Coffee },
  { id: "pool", title: "Day pass to Sundhöllin", partner: "Reykjavík Pools", cost: 80, icon: Waves },
  { id: "museum", title: "Entry to Listasafn Reykjavíkur", partner: "Reykjavík Art Museum", cost: 120, icon: Ticket },
  { id: "plant", title: "Native plant seedling", partner: "Grasagarður", cost: 60, icon: Leaf },
];

function Index() {
  const [points, setPoints] = useState(85);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());

  const tier = useMemo(() => {
    if (points >= 500) return { name: "Aurora", next: 1000 };
    if (points >= 200) return { name: "Glacier", next: 500 };
    return { name: "Sprout", next: 200 };
  }, [points]);

  const handleAction = (a: Action) => {
    if (completed.has(a.id)) return;
    setCompleted((s) => new Set(s).add(a.id));
    setPoints((p) => p + a.points);
    toast.success(`+${a.points} stig`, { description: a.title });
  };

  const handleRedeem = (r: Reward) => {
    if (redeemed.has(r.id)) return;
    if (points < r.cost) {
      toast.error("Not enough stig yet", { description: `Need ${r.cost - points} more.` });
      return;
    }
    setRedeemed((s) => new Set(s).add(r.id));
    setPoints((p) => p - r.cost);
    toast.success("Reward unlocked", { description: `${r.title} — show this at ${r.partner}.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-aurora animate-aurora">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Reykjavík Stig</span>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-card-soft sm:flex">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-semibold">{points}</span>
            <span className="text-muted-foreground">stig</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Aurora over Reykjavík rooftops"
          width={1536}
          height={896}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[var(--gradient-hero)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 lg:py-40">
          <Badge className="mb-6 border-0 bg-white/15 text-white backdrop-blur">
            Inspired by CopenPay · Pilot for Reykjavík
          </Badge>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Do good for the city.{" "}
            <span className="text-gradient-aurora bg-gradient-aurora animate-aurora">
              Earn social points.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">
            Recycle, ride the bus, volunteer or pick up litter — every small act becomes
            <em> stig</em> you can spend at pools, cafés and museums across Reykjavík.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="shadow-glow" onClick={() => document.getElementById("actions")?.scrollIntoView({ behavior: "smooth" })}>
              Start earning
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" onClick={() => document.getElementById("rewards")?.scrollIntoView({ behavior: "smooth" })}>
              See rewards
            </Button>
          </div>
        </div>
      </section>

      {/* Balance card */}
      <section className="mx-auto -mt-12 max-w-6xl px-6">
        <Card className="relative overflow-hidden border-0 bg-card p-6 shadow-card-soft sm:p-8">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-aurora opacity-30 blur-3xl animate-aurora" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wider text-muted-foreground">Your balance</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight">{points}</span>
                <span className="text-lg text-muted-foreground">stig</span>
              </div>
              <Badge variant="secondary" className="mt-3">{tier.name} tier</Badge>
            </div>
            <div className="w-full sm:max-w-xs">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Progress to next tier</span>
                <span>{points} / {tier.next}</span>
              </div>
              <Progress value={(points / tier.next) * 100} />
            </div>
          </div>
        </Card>
      </section>

      {/* Actions */}
      <section id="actions" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Civic actions</h2>
            <p className="mt-2 text-muted-foreground">Tap an action when you complete it. Honour system — for now.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIONS.map((a, i) => {
            const done = completed.has(a.id);
            const Icon = a.icon;
            return (
              <Card
                key={a.id}
                className="group relative overflow-hidden border-border bg-card p-6 transition-smooth hover:-translate-y-1 hover:shadow-card-soft animate-float-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-smooth group-hover:bg-gradient-aurora group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary">+{a.points}</Badge>
                </div>
                <h3 className="mt-4 font-semibold leading-snug">{a.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                <Button
                  size="sm"
                  variant={done ? "secondary" : "default"}
                  className="mt-5 w-full"
                  disabled={done}
                  onClick={() => handleAction(a)}
                >
                  {done ? "Logged today" : "I did this"}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Rewards */}
      <section id="rewards" className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Spend your stig</h2>
              <p className="mt-2 text-muted-foreground">Local partners across Reykjavík redeem your civic points.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/map">
                <MapPin className="mr-1 h-4 w-4" /> Find on map
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REWARDS.map((r, i) => {
              const Icon = r.icon;
              const isRedeemed = redeemed.has(r.id);
              const affordable = points >= r.cost;
              return (
                <Card
                  key={r.id}
                  className="flex flex-col border-border bg-card p-6 transition-smooth hover:shadow-card-soft animate-float-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-aurora text-primary-foreground animate-aurora">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{r.title}</h3>
                  <p className="text-sm text-muted-foreground">{r.partner}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold">{r.cost}</span>
                    <span className="text-sm text-muted-foreground">stig</span>
                  </div>
                  <Button
                    size="sm"
                    variant={isRedeemed ? "secondary" : affordable ? "default" : "outline"}
                    className="mt-4"
                    onClick={() => handleRedeem(r)}
                    disabled={isRedeemed}
                  >
                    {isRedeemed ? "Redeemed" : affordable ? "Redeem" : "Keep going"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        A civic prototype for Reykjavíkurborg · Inspired by CopenPay
      </footer>
    </div>
  );
}
