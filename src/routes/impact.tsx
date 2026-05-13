import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Users, Building2, Plane, HandCoins, UserMinus, HandHeart, BookOpen } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/impact")({
  component: ImpactPage,
  head: () => ({
    meta: [
      { title: "Who could benefit — Reykjavík Stig" },
      {
        name: "description",
        content:
          "Key numbers about Reykjavík residents, visiting tourists, and people in need who could benefit from civic action.",
      },
      { property: "og:title", content: "Who could benefit — Reykjavík Stig" },
      { property: "og:description", content: "Population, tourism and social need figures for Reykjavík and Iceland." },
    ],
  }),
});

const STATS = [
  { icon: Users, vKey: "stat_residents_v", lKey: "stat_residents_l" },
  { icon: Building2, vKey: "stat_capital_v", lKey: "stat_capital_l" },
  { icon: Plane, vKey: "stat_tourists_v", lKey: "stat_tourists_l" },
  { icon: HandCoins, vKey: "stat_poverty_v", lKey: "stat_poverty_l" },
  { icon: UserMinus, vKey: "stat_lonely_v", lKey: "stat_lonely_l" },
  { icon: HandHeart, vKey: "stat_volunteers_v", lKey: "stat_volunteers_l" },
] as const;

function ImpactPage() {
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-aurora animate-aurora">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">{t("brand")}</span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" /> {t("learn_back")}
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-6">
        <Badge variant="secondary" className="mb-4">{t("impact_badge")}</Badge>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl">
          {t("stats_h")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("stats_sub")}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.vKey} className="flex items-start gap-4 border-border bg-card p-6 shadow-card-soft">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-aurora text-primary-foreground animate-aurora">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-3xl font-semibold tracking-tight">{t(s.vKey)}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{t(s.lKey)}</div>
                </div>
              </Card>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{t("stats_note")}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/learn">
              <BookOpen className="mr-1 h-4 w-4" /> {t("impact_to_sources")}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">{t("learn_back")}</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        {t("footer")}
      </footer>
    </div>
  );
}