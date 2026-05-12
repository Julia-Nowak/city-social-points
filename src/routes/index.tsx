import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Recycle, Bus, Trees, HandHeart, Bike, Sparkles,
  Coffee, Ticket, Waves, BookOpen, Award, Leaf, MapPin, Languages,
  Users, Utensils, Shirt, Waves as WavesIcon, Camera, X,
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
  { id: "neighbour", titleKey: "a_neighbour_t", detailKey: "a_neighbour_d", points: 20, icon: Users },
  { id: "soup", titleKey: "a_soup_t", detailKey: "a_soup_d", points: 70, icon: Utensils },
  { id: "clothes", titleKey: "a_clothes_t", detailKey: "a_clothes_d", points: 25, icon: Shirt },
  { id: "beach", titleKey: "a_beach_t", detailKey: "a_beach_d", points: 45, icon: WavesIcon },
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
  const [pending, setPending] = useState<ActionDef | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement | null>(null);

  const tier = useMemo(() => {
    if (points >= 500) return { name: t("tier_aurora"), next: 1000 };
    if (points >= 200) return { name: t("tier_glacier"), next: 500 };
    return { name: t("tier_sprout"), next: 200 };
  }, [points, lang]);

  const handleAction = (a: ActionDef) => {
    if (completed.has(a.id)) return;
    setPhotoUrl(null);
    setPending(a);
  };

  const closeDialog = () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
    setPending(null);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const confirmAction = () => {
    if (!pending) return;
    const a = pending;
    setCompleted((s) => new Set(s).add(a.id));
    setPoints((p) => p + a.points);
    if (photoUrl) setPhotos((m) => ({ ...m, [a.id]: photoUrl }));
    toast.success(
      `+${a.points} ${t("points_label")} · ${photoUrl ? t("upload_thanks_with_photo") : t("toast_thanks")}`,
      { description: t(a.titleKey) },
    );
    setPending(null);
    setPhotoUrl(null);
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
            <span className="text-lg font-semibold tracking-tight">{t("brand")}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border border-border bg-card p-0.5 text-xs shadow-card-soft" role="group" aria-label="Language">
              <Languages className="ml-2 mr-1 h-3.5 w-3.5 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setLang("is")}
                aria-pressed={lang === "is"}
                className={`rounded-full px-2.5 py-1 font-medium transition-smooth ${lang === "is" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                IS
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                aria-pressed={lang === "en"}
                className={`rounded-full px-2.5 py-1 font-medium transition-smooth ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                EN
              </button>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-card-soft sm:flex">
              <Award className="h-4 w-4 text-primary" />
              <span className="font-semibold">{points}</span>
              <span className="text-muted-foreground">{t("points_label")}</span>
            </div>
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
            {t("hero_badge")}
          </Badge>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            {t("hero_title_a")}{" "}
            <span className="text-gradient-aurora bg-gradient-aurora animate-aurora">
              {t("hero_title_b")}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            {t("hero_lede")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" className="shadow-glow" onClick={() => document.getElementById("actions")?.scrollIntoView({ behavior: "smooth" })}>
              {t("cta_start")}
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById("rewards")?.scrollIntoView({ behavior: "smooth" })}>
              {t("cta_rewards")}
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
              <p className="text-sm uppercase tracking-wider text-muted-foreground">{t("balance")}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight">{points}</span>
                <span className="text-lg text-muted-foreground">{t("points_label")}</span>
              </div>
              <Badge variant="secondary" className="mt-3">{tier.name}{t("tier_suffix")}</Badge>
            </div>
            <div className="w-full sm:max-w-xs">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>{t("next_tier")}</span>
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
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("actions_h")}</h2>
            <p className="mt-2 text-muted-foreground">{t("actions_sub")}</p>
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
                <h3 className="mt-4 font-semibold leading-snug">{t(a.titleKey)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(a.detailKey)}</p>
                {done && photos[a.id] ? (
                  <img
                    src={photos[a.id]}
                    alt={t(a.titleKey)}
                    className="mt-4 h-28 w-full rounded-lg object-cover"
                  />
                ) : null}
                <Button
                  size="sm"
                  variant={done ? "secondary" : "default"}
                  className="mt-5 w-full"
                  disabled={done}
                  onClick={() => handleAction(a)}
                >
                  {done ? t("done") : t("do_it")}
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
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t("rewards_h")}</h2>
              <p className="mt-2 text-muted-foreground">{t("rewards_sub")}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/map">
                <MapPin className="mr-1 h-4 w-4" /> {t("nav_map")}
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
                  <h3 className="mt-4 font-semibold">{t(r.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(r.partnerKey)}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold">{r.cost}</span>
                    <span className="text-sm text-muted-foreground">{t("points_label")}</span>
                  </div>
                  <Button
                    size="sm"
                    variant={isRedeemed ? "secondary" : affordable ? "default" : "outline"}
                    className="mt-4"
                    onClick={() => handleRedeem(r)}
                    disabled={isRedeemed}
                  >
                    {isRedeemed ? t("redeemed") : affordable ? t("redeem") : t("keep_going")}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        {t("footer")}
      </footer>

      <Dialog open={!!pending} onOpenChange={(o) => { if (!o) closeDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("upload_title")}</DialogTitle>
            <DialogDescription>
              {pending ? t(pending.titleKey) : ""} · {t("upload_sub")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onPickFile}
            />
            {photoUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-border">
                <img src={photoUrl} alt="preview" className="block max-h-72 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { URL.revokeObjectURL(photoUrl); setPhotoUrl(null); }}
                  className="absolute right-2 top-2 rounded-full bg-background/80 p-1 text-foreground shadow-card-soft hover:bg-background"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/40 text-muted-foreground transition-smooth hover:border-primary/50 hover:text-foreground"
              >
                <Camera className="h-6 w-6" />
                <span className="text-sm font-medium">{t("upload_pick")}</span>
              </button>
            )}
            {photoUrl ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fileRef.current?.click()}
              >
                {t("upload_change")}
              </Button>
            ) : null}
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-2">
            <Button variant="ghost" onClick={confirmAction}>{t("upload_skip")}</Button>
            <Button onClick={confirmAction} className="shadow-glow">
              {t("upload_confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
