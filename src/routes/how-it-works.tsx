import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Smartphone, HandHeart, Award, Gift } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/how-it-works")({
  component: HowPage,
  head: () => ({
    meta: [
      { title: "How it works — Reykjavík Stig" },
      { name: "description", content: "Learn how Reykjavík Stig turns small good deeds into civic points you can spend at pools, cafés and museums in Reykjavík." },
      { property: "og:title", content: "How Reykjavík Stig works" },
      { property: "og:description", content: "Four simple steps: open the site, do a good deed, earn points, redeem rewards across Reykjavík." },
      { property: "og:url", content: "https://city-social-points.lovable.app/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "https://city-social-points.lovable.app/how-it-works" }],
  }),
});

const STEPS = [
  { icon: Smartphone, t: "how_s1_t", d: "how_s1_d" },
  { icon: HandHeart, t: "how_s2_t", d: "how_s2_d" },
  { icon: Award, t: "how_s3_t", d: "how_s3_d" },
  { icon: Gift, t: "how_s4_t", d: "how_s4_d" },
] as const;

function HowPage() {
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-aurora animate-aurora">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="flex items-baseline gap-2"><span className="text-lg font-semibold tracking-tight">{t("brand")}</span><span className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:inline">{t("brand_tag")}</span></span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> {t("learn_back")}</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-6">
        <Badge variant="secondary" className="mb-4">{t("how_badge")}</Badge>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl">{t("how_h")}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("how_sub")}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.t} className="border-border bg-card p-6 shadow-card-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-aurora text-primary-foreground animate-aurora">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{t(s.t)}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t(s.d)}</p>
              </Card>
            );
          })}
        </div>
        <div className="mt-10">
          <Button asChild size="lg" className="shadow-glow">
            <Link to="/">{t("how_cta")}</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">{t("footer")}</footer>
    </div>
  );
}