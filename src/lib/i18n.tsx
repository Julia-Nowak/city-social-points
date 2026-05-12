import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "is" | "en";

type Dict = Record<string, string>;

const IS: Dict = {
  brand: "Reykjavíkurstig",
  nav_map: "Sjá á korti",
  hero_badge: "Velkomin · Tilraunaverkefni fyrir Reykjavíkurborg",
  hero_title_a: "Gerðu vel við borgina þína.",
  hero_title_b: "Safnaðu stigum.",
  hero_lede:
    "Endurvinndu, taktu strætó, hjálpaðu nágranna eða tíndu rusl — hvert lítið verk verður að stigum sem þú getur eytt í sundlaugum, kaffihúsum og söfnum um alla Reykjavík.",
  cta_start: "Byrjaðu að safna",
  cta_rewards: "Sjá verðlaun",
  balance: "Staðan þín",
  next_tier: "Næsta þrep",
  tier_suffix: "-stig",
  tier_sprout: "Lúpína",
  tier_glacier: "Jökull",
  tier_aurora: "Norðurljós",
  actions_h: "Góðverk dagsins",
  actions_sub: "Smelltu á verk þegar þú klárar það. Heiðurskerfi — í bili.",
  done: "Skráð í dag",
  do_it: "Ég gerði þetta",
  rewards_h: "Eyddu stigunum þínum",
  rewards_sub: "Samstarfsaðilar um alla Reykjavík taka við stigunum þínum.",
  redeemed: "Innleyst",
  redeem: "Leysa út",
  keep_going: "Áfram nú",
  toast_thanks: "Takk fyrir!",
  toast_not_enough: "Ekki nógu mörg stig ennþá",
  toast_need: "Vantar {n} til viðbótar.",
  toast_unlocked: "Verðlaun opnuð · Gjörðu svo vel",
  toast_show_at: "{title} — sýndu þetta hjá {partner}.",
  footer: "Borgaraleg frumgerð fyrir Reykjavíkurborg · Innblásið af CopenPay · Takk fyrir",
  // actions
  a_recycle_t: "Endurvinna hjá Sorpu",
  a_recycle_d: "Skilaðu plasti, pappír eða gleri á næstu Sorpu-stöð.",
  a_bus_t: "Taktu Strætó í stað bílsins",
  a_bus_d: "Pikkaðu þig inn í gulu vagnana á leið í vinnu eða skóla.",
  a_bike_t: "Hjólaðu 5 km í borginni",
  a_bike_d: "Notaðu hjólastíga Reykjavíkur fyrir snúninga dagsins.",
  a_volunteer_t: "Sjálfboðastarf í eina klst.",
  a_volunteer_d: "Hjálpaðu hjá Rauða krossinum eða í þínu hverfi.",
  a_park_t: "Tíndu rusl í garðinum",
  a_park_d: "Hreinsaðu Klambratún eða Elliðaárdal — fyrir og eftir mynd.",
  a_library_t: "Fáðu bók að láni á Borgarbókasafninu",
  a_library_d: "Lestu í staðinn fyrir að kaupa — deildu svo áfram.",
  // rewards
  r_coffee_t: "Frír uppáhellingur",
  r_coffee_p: "Reykjavík Roasters",
  r_pool_t: "Sundferð í Sundhöllina",
  r_pool_p: "Sundlaugar Reykjavíkur",
  r_museum_t: "Aðgangur að Listasafni Reykjavíkur",
  r_museum_p: "Listasafn Reykjavíkur",
  r_plant_t: "Íslenskur plöntugræðlingur",
  r_plant_p: "Grasagarðurinn",
  points_label: "stig",
};

const EN: Dict = {
  brand: "Reykjavík Stig",
  nav_map: "Find on map",
  hero_badge: "Welcome · A pilot for the City of Reykjavík",
  hero_title_a: "Do good for the city.",
  hero_title_b: "Earn social points.",
  hero_lede:
    "Recycle, ride the bus, help a neighbour or pick up litter — every small act becomes points you can spend at pools, cafés and museums across Reykjavík.",
  cta_start: "Start earning",
  cta_rewards: "See rewards",
  balance: "Your balance",
  next_tier: "Progress to next tier",
  tier_suffix: " tier",
  tier_sprout: "Sprout",
  tier_glacier: "Glacier",
  tier_aurora: "Aurora",
  actions_h: "Civic actions",
  actions_sub: "Tap an action when you complete it. Honour system — for now.",
  done: "Logged today",
  do_it: "I did this",
  rewards_h: "Spend your stig",
  rewards_sub: "Local partners across Reykjavík redeem your civic points.",
  redeemed: "Redeemed",
  redeem: "Redeem",
  keep_going: "Keep going",
  toast_thanks: "Thank you!",
  toast_not_enough: "Not enough stig yet",
  toast_need: "Need {n} more.",
  toast_unlocked: "Reward unlocked",
  toast_show_at: "{title} — show this at {partner}.",
  footer: "A civic prototype for the City of Reykjavík · Inspired by CopenPay",
  a_recycle_t: "Recycle at a Sorpa station",
  a_recycle_d: "Drop off plastics, paper or glass at any Sorpa.",
  a_bus_t: "Ride Strætó instead of driving",
  a_bus_d: "Tap into the city bus for your commute.",
  a_bike_t: "Cycle 5 km in the city",
  a_bike_d: "Use Reykjavík bike paths for errands or commute.",
  a_volunteer_t: "Volunteer for 1 hour",
  a_volunteer_d: "Help at Rauði Krossinn or a neighbourhood centre.",
  a_park_t: "Pick up litter in a park",
  a_park_d: "Snap a before/after at Klambratún or Elliðaárdalur.",
  a_library_t: "Borrow a book from Borgarbókasafn",
  a_library_d: "Read instead of buy — share when done.",
  r_coffee_t: "Free filter coffee",
  r_coffee_p: "Reykjavík Roasters",
  r_pool_t: "Day pass to Sundhöllin",
  r_pool_p: "Reykjavík Pools",
  r_museum_t: "Entry to Listasafn Reykjavíkur",
  r_museum_p: "Reykjavík Art Museum",
  r_plant_t: "Native plant seedling",
  r_plant_p: "Grasagarður",
  points_label: "points",
};

const DICTS: Record<Lang, Dict> = { is: IS, en: EN };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string, vars?: Record<string, string | number>) => string };
const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("is");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (stored === "en" || stored === "is") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = DICTS[lang][key] ?? DICTS.en[key] ?? key;
    if (vars) for (const k in vars) s = s.replace(`{${k}}`, String(vars[k]));
    return s;
  };

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
