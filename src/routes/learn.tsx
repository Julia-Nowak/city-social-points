import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// FIX: removed duplicate import — "BarChart3 as BarChart3Icon" was identical to BarChart3
import { ArrowLeft, ExternalLink, Sparkles, Heart, BarChart3, BookOpen } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/learn")({
  component: LearnPage,
  head: () => ({
    meta: [
      { title: "Learn more about the cause — Reykjavík Stig" },
      {
        name: "description",
        content:
          "Trusted Icelandic sources about the people we serve, the scale of social challenges in Reykjavík, and their root causes.",
      },
      { property: "og:title", content: "Learn more about the cause — Reykjavík Stig" },
      { property: "og:description", content: "Beneficiaries, problem scale and root causes — sourced from public authorities and the social sector in Iceland." },
    ],
  }),
});

const GROUPS = [
  {
    group: "res_group_people",
    icon: Heart,
    items: [
      { t: "res_redcross_t", d: "res_redcross_d", url: "https://www.raudikrossinn.is" },
      { t: "res_samhjalp_t", d: "res_samhjalp_d", url: "https://samhjalp.is" },
      { t: "res_fjolskylduhjalp_t", d: "res_fjolskylduhjalp_d", url: "https://fjolskylduhjalp.is" },
    ],
  },
  {
    group: "res_group_problem",
    icon: BarChart3,
    items: [
      { t: "res_hagstofa_t", d: "res_hagstofa_d", url: "https://www.hagstofa.is" },
      { t: "res_borgin_t", d: "res_borgin_d", url: "https://reykjavik.is/velferd" },
      { t: "res_landlaeknir_t", d: "res_landlaeknir_d", url: "https://www.landlaeknir.is" },
    ],
  },
  {
    group: "res_group_roots",
    icon: BookOpen,
    items: [
      { t: "res_varda_t", d: "res_varda_d", url: "https://www.varda.is" },
      { t: "res_ust_t", d: "res_ust_d", url: "https://www.ust.is" },
      { t: "res_velferdarvaktin_t", d: "res_velferdarvaktin_d", url: "https://www.stjornarradid.is/verkefni/felags-og-vinnumarkadsmal/velferdarvaktin/" },
    ],
  },
] as const;

function LearnPage() {
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
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" /> {t("learn_back")}
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-6">
        <Badge variant="secondary" className="mb-4">{t("learn_badge")}</Badge>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-tight sm:text-5xl">
          {t("res_h")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("res_sub")}</p>
        <div className="mt-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/impact">
              {/* FIX: was using BarChart3Icon alias which no longer exists */}
              <BarChart3 className="mr-1 h-4 w-4" /> {t("learn_to_impact")}
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {GROUPS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.group} className="mb-12 last:mb-0">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-aurora text-primary-foreground animate-aurora">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {t(section.group)}
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((it) => (
                  <a
                    key={it.url}
                    href={it.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card-soft transition-smooth hover:-translate-y-0.5 hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-snug">{t(it.t)}</h3>
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-smooth group-hover:text-primary" />
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t(it.d)}</p>
                    <span className="mt-3 text-xs font-medium text-primary">{t("res_visit")}</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        {t("footer")}
      </footer>
    </div>
  );
}
