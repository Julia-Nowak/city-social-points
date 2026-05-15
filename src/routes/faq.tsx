import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "FAQ — Reykjavík Stig" },
      { name: "description", content: "Answers to common questions about Reykjavík Stig — pricing, how points work, where to redeem and how businesses can join." },
      { property: "og:title", content: "Reykjavík Stig — Frequently asked questions" },
      { property: "og:description", content: "Pricing, redeeming points, partner businesses and more." },
      { property: "og:url", content: "https://city-social-points.lovable.app/faq" },
    ],
    links: [{ rel: "canonical", href: "https://city-social-points.lovable.app/faq" }],
  }),
});

const QA = [
  ["faq_q1", "faq_a1"],
  ["faq_q2", "faq_a2"],
  ["faq_q3", "faq_a3"],
  ["faq_q4", "faq_a4"],
  ["faq_q5", "faq_a5"],
  ["faq_q6", "faq_a6"],
] as const;

function FaqPage() {
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

      <section className="mx-auto max-w-3xl px-6 pt-12 pb-6">
        <Badge variant="secondary" className="mb-4">{t("faq_badge")}</Badge>
        <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">{t("faq_h")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("faq_sub")}</p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <Accordion type="single" collapsible className="w-full">
          {QA.map(([q, a], i) => (
            <AccordionItem key={q} value={`q-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">{t(q)}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{t(a)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card-soft">
          <h2 className="font-semibold">{t("faq_more")}</h2>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link to="/learn"><BookOpen className="mr-1 h-4 w-4" /> {t("faq_more_btn")}</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">{t("footer")}</footer>
    </div>
  );
}