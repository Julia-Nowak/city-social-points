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
  Coffee, Ticket, Waves, BookOpen, Award, Leaf, MapPin, Languages,
} from "lucide-react";
import heroImg from "@/assets/reykjavik-hero.png";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Reykjavíkurstig — Vinnðu þér inn stig fyrir góðverk í borginni" },
      {
        name: "description",
        content:
          "Reykjavíkurstig verðlaunar borgarbúa fyrir endurvinnslu, sjálfboðastarf og að taka strætó. Innblásið af CopenPay.",
      },
      { property: "og:title", content: "Reykjavíkurstig" },
      { property: "og:description", content: "Safnaðu stigum fyrir hlýrri og grænni Reykjavík." },
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

type ActionDef = { id: string; titleKey: string; detailKey: string; points: number; icon: Action["icon"] };
const ACTIONS: ActionDef[] = [
  { id: "recycle", titleKey: "a_recycle_t", detailKey: "a_recycle_d", points: 25, icon: Recycle },
  { id: "bus", titleKey: "a_bus_t", detailKey: "a_bus_d", points: 15, icon: Bus },
  { id: "bike", titleKey: "a_bike_t", detailKey: "a_bike_d", points: 20, icon: Bike },
  { id: "volunteer", titleKey: "a_volunteer_t", detailKey: "a_volunteer_d", points: 60, icon: HandHeart },
  { id: "park", titleKey: "a_park_t", detailKey: "a_park_d", points: 30, icon: Trees },
  { id: "library", titleKey: "a_library_t", detailKey: "a_library_d", points: 10, icon: BookOpen },
];

type RewardDef = { id: string; titleKey: string; partnerKey: string; cost: number; icon: Reward["icon"] };
const REWARDS: RewardDef[] = [
  { id: "coffee", titleKey: "r_coffee_t", partnerKey: "r_coffee_p", cost: 40, icon: Coffee },
  { id: "pool", titleKey: "r_pool_t", partnerKey: "r_pool_p", cost: 80, icon: Waves },
  { id: "museum", titleKey: "r_museum_t", partnerKey: "r_museum_p", cost: 120, icon: Ticket },
  { id: "plant", titleKey: "r_plant_t", partnerKey: "r_plant_p", cost: 60, icon: Leaf },
];

function Index() {
  const { lang, setLang, t } = useLang();
  const [points, setPoints] = useState(85);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());

  const tier = useMemo(() => {
    if (points >= 500) return { name: t("tier_aurora"), next: 1000 };
    if (points >= 200) return { name: t("tier_glacier"), next: 500 };
    return { name: t("tier_sprout"), next: 200 };
  }, [points, lang]);

  const handleAction = (a: ActionDef) => {
    if (completed.has(a.id)) return;
    setCompleted((s) => new Set(s).add(a.id));
    setPoints((p) => p + a.points);
    toast.success(`+${a.points} ${t("points_label")} · ${t("toast_thanks")}`, { description: t(a.titleKey) });
  };

  const handleRedeem = (r: RewardDef) => {
    if (redeemed.has(r.id)) return;
    if (points < r.cost) {
      toast.error(t("toast_not_enough"), { description: t("toast_need", { n: r.cost - points }) });
      return;
    }
    setRedeemed((s) => new Set(s).add(r.id));
    setPoints((p) => p - r.cost);
    toast.success(t("toast_unlocked"), {
      description: t("toast_show_at", { title: t(r.titleKey), partner: t(r.partnerKey) }),
    });
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
            <span className="text-lg font-semibold tracking-tight">Reykjavíkurstig</span>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-card-soft sm:flex">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-semibold">{points}</span>
            <span className="text-muted-foreground">stig</span>
          </div>
        </div>
      </header>

      {/* Hero — illustrated Reykjavík banner */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-8">
          <div className="overflow-hidden rounded-3xl border border-border shadow-card-soft">
            <img
              src={heroImg}
              alt="Illustrated Reykjavík panorama with Hallgrímskirkja, an arctic fox and a puffin — Little good deeds"
              width={2172}
              height={724}
              className="block h-auto w-full"
            />
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-6">
          <Badge variant="secondary" className="mb-4">
            Velkomin · Tilraunaverkefni fyrir Reykjavíkurborg
          </Badge>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Gerðu vel við borgina þína.{" "}
            <span className="text-gradient-aurora bg-gradient-aurora animate-aurora">
              Safnaðu stigum.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Endurvinndu, taktu strætó, hjálpaðu nágranna eða tíndu rusl — hvert lítið verk verður að
            <em> stigum</em> sem þú getur eytt í sundlaugum, kaffihúsum og söfnum um alla Reykjavík.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="shadow-glow" onClick={() => document.getElementById("actions")?.scrollIntoView({ behavior: "smooth" })}>
              Byrjaðu að safna
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("rewards")?.scrollIntoView({ behavior: "smooth" })}>
              Sjá verðlaun
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
              <p className="text-sm uppercase tracking-wider text-muted-foreground">Staðan þín</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight">{points}</span>
                <span className="text-lg text-muted-foreground">stig</span>
              </div>
              <Badge variant="secondary" className="mt-3">{tier.name}-stig</Badge>
            </div>
            <div className="w-full sm:max-w-xs">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Næsta þrep</span>
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
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Góðverk dagsins</h2>
            <p className="mt-2 text-muted-foreground">Smelltu á verk þegar þú klárar það. Heiðurskerfi — í bili.</p>
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
                  {done ? "Skráð í dag" : "Ég gerði þetta"}
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
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Eyddu stigunum þínum</h2>
              <p className="mt-2 text-muted-foreground">Samstarfsaðilar um alla Reykjavík taka við stigunum þínum.</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/map">
                <MapPin className="mr-1 h-4 w-4" /> Sjá á korti
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
                    {isRedeemed ? "Innleyst" : affordable ? "Leysa út" : "Áfram nú"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        Borgaraleg frumgerð fyrir Reykjavíkurborg · Innblásið af CopenPay · Takk fyrir
      </footer>
    </div>
  );
}
