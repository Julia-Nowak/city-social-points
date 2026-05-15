import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Sparkles, Users, Heart, Tag, BarChart3, Mail } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/for-businesses")({
  component: PartnersPage,
  head: () => ({
    meta: [
      { title: "For businesses — Reykjavík Stig" },
      { name: "description", content: "Become a Reykjavík Stig partner. Reward good deeds with a coffee, a swim or a museum ticket — and welcome new local customers." },
      { property: "og:title", content: "For businesses — Reykjavík Stig" },
      { property: "og:description", content: "Join Reykjavík cafés, pools and museums rewarding civic action with simple offers." },
      { property: "og:url", content: "https://city-social-points.lovable.app/for-businesses" },
    ],
    links: [{ rel: "canonical", href: "https://city-social-points.lovable.app/for-businesses" }],
  }),
});

const BENEFITS = [
  { icon: Users, t: "p_b1_t", d: "p_b1_d" },
  { icon: Heart, t: "p_b2_t", d: "p_b2_d" },
  { icon: Tag, t: "p_b3_t", d: "p_b3_d" },
  { icon: BarChart3, t: "p_b4_t", d: "p_b4_d" },
] as const;

function PartnersPage() {
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
        <Badge variant="secondary" className="mb-4">{t("p_badge")}</Badge>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl">{t("p_h")}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("p_sub")}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.t} className="border-border bg-card p-6 shadow-card-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-aurora text-primary-foreground animate-aurora">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{t(b.t)}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t(b.d)}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <Card className="border-border bg-card p-8 shadow-card-soft">
          <h2 className="text-2xl font-semibold tracking-tight">{t("p_how_h")}</h2>
          <ol className="mt-5 space-y-3 text-muted-foreground">
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-aurora text-xs font-semibold text-primary-foreground">1</span>{t("p_how_1")}</li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-aurora text-xs font-semibold text-primary-foreground">2</span>{t("p_how_2")}</li>
            <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-aurora text-xs font-semibold text-primary-foreground">3</span>{t("p_how_3")}</li>
          </ol>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <Card className="relative overflow-hidden border-border bg-card p-8 shadow-card-soft">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-aurora opacity-25 blur-3xl animate-aurora" />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t("p_cta_t")}</h2>
            <p className="mt-2 text-muted-foreground">{t("p_cta_d")}</p>
            <Button asChild size="lg" className="mt-5 shadow-glow">
              <a href="mailto:hello@reykjavikstig.is"><Mail className="mr-1 h-4 w-4" /> {t("p_cta_btn")}</a>
            </Button>
          </div>
        </Card>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">{t("footer")}</footer>
    </div>
  );
}