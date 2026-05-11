import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, ArrowLeft, Sparkles, Search, Navigation, Route as RouteIcon, LocateFixed, Footprints, Bike, Bus } from "lucide-react";
import { PARTNERS, REYKJAVIK_CENTER, haversineKm, type Partner } from "@/data/partners";

export const Route = createFileRoute("/map")({
  component: MapPage,
  head: () => ({
    meta: [
      { title: "Partner map — Reykjavík Stig" },
      {
        name: "description",
        content:
          "Find Reykjavík Stig partners near you. See pools, cafés and museums where you can spend your civic points.",
      },
      { property: "og:title", content: "Partner map — Reykjavík Stig" },
      { property: "og:description", content: "Find nearby places to spend your stig." },
    ],
  }),
});

const CATEGORIES = ["All", "Café", "Pool", "Museum", "Garden", "Library", "Shop"] as const;
type Category = (typeof CATEGORIES)[number];

type TravelMode = "walking" | "cycling" | "transit";

const TRAVEL_MODES: { id: TravelMode; label: string; icon: typeof Footprints; kmh: number }[] = [
  { id: "walking", label: "Walking", icon: Footprints, kmh: 5 },
  { id: "cycling", label: "Cycling", icon: Bike, kmh: 16 },
  { id: "transit", label: "Transit", icon: Bus, kmh: 22 },
];

function buildEmbedUrl(p: { lat: number; lng: number }, zoom = 0.012) {
  const bbox = [
    p.lng - zoom,
    p.lat - zoom / 2,
    p.lng + zoom,
    p.lat + zoom / 2,
  ].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${p.lat}%2C${p.lng}`;
}

function MapPage() {
  const [selectedId, setSelectedId] = useState<string>(PARTNERS[0].id);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<"idle" | "loading" | "denied" | "ok">("idle");
  const [travelMode, setTravelMode] = useState<TravelMode>("walking");

  const origin = userLoc ?? REYKJAVIK_CENTER;
  const originLabel = userLoc ? "your location" : "Reykjavík centre";

  function requestLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocStatus("denied");
      return;
    }
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocStatus("ok");
      },
      () => setLocStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  const partnersWithDistance = useMemo(
    () =>
      PARTNERS.map((p) => ({
        ...p,
        distance: haversineKm(REYKJAVIK_CENTER, p),
      })).sort((a, b) => a.distance - b.distance),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partnersWithDistance.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.reward.toLowerCase().includes(q)
      );
    });
  }, [partnersWithDistance, query, category]);

  const selected: Partner =
    PARTNERS.find((p) => p.id === selectedId) ?? PARTNERS[0];

  const modeMeta = TRAVEL_MODES.find((m) => m.id === travelMode)!;
  const osmEngine =
    travelMode === "cycling" ? "fossgis_osrm_bike" : "fossgis_osrm_foot";
  const gmapsTravelMode =
    travelMode === "cycling" ? "bicycling" : travelMode === "transit" ? "transit" : "walking";
  const directionsUrl = `https://www.openstreetmap.org/directions?engine=${osmEngine}&route=${origin.lat}%2C${origin.lng}%3B${selected.lat}%2C${selected.lng}`;
  const gmapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${selected.lat},${selected.lng}&travelmode=${gmapsTravelMode}`;
  const distanceFromOrigin = haversineKm(origin, selected);
  const travelMinutes = Math.max(1, Math.round((distanceFromOrigin / modeMeta.kmh) * 60));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-aurora animate-aurora">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Reykjavík Stig</span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Partner map</h1>
          <p className="mt-2 text-muted-foreground">
            Find pools, cafés and museums across Reykjavík where you can redeem stig.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Sidebar list */}
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search partners or rewards"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-3 py-1 text-xs transition-smooth ${
                    category === c
                      ? "border-transparent bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex max-h-[640px] flex-col gap-2 overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No partners match.
                </p>
              )}
              {filtered.map((p) => {
                const active = p.id === selectedId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`group relative w-full rounded-xl border p-4 text-left transition-smooth ${
                      active
                        ? "border-primary bg-card shadow-card-soft"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px]">
                            {p.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {p.distance.toFixed(1)} km
                          </span>
                        </div>
                        <h3 className="mt-1.5 truncate font-semibold">{p.name}</h3>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {p.address}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-sm font-semibold">{p.cost}</div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          stig
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map + details */}
          <div className="flex flex-col gap-4">
            <Card className="overflow-hidden border-border p-0 shadow-card-soft">
              <div className="relative aspect-[16/10] w-full bg-muted">
                <iframe
                  key={selected.id}
                  title={`Map of ${selected.name}`}
                  src={buildEmbedUrl(selected)}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                />
              </div>
            </Card>

            <Card className="border-border p-6 shadow-card-soft animate-float-up" key={selected.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge variant="secondary">{selected.category}</Badge>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    {selected.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.reward}</p>
                </div>
                <div className="rounded-xl bg-gradient-aurora px-4 py-2 text-primary-foreground animate-aurora">
                  <div className="text-2xl font-semibold leading-none">{selected.cost}</div>
                  <div className="text-[10px] uppercase tracking-wider opacity-90">stig</div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{selected.address}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{selected.hours}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <RouteIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    {distanceFromOrigin.toFixed(1)} km · ~{travelMinutes} min {modeMeta.label.toLowerCase()} from {originLabel}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <LocateFixed className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <button
                    onClick={requestLocation}
                    className="text-left underline-offset-2 hover:underline"
                    disabled={locStatus === "loading"}
                  >
                    {locStatus === "ok" && "Using your location"}
                    {locStatus === "loading" && "Locating…"}
                    {locStatus === "denied" && "Location blocked — tap to retry"}
                    {locStatus === "idle" && "Use my location for directions"}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="flex w-full flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-xs uppercase tracking-wider text-muted-foreground">
                    Mode
                  </span>
                  {TRAVEL_MODES.map((m) => {
                    const Icon = m.icon;
                    const active = m.id === travelMode;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setTravelMode(m.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-smooth ${
                          active
                            ? "border-transparent bg-foreground text-background"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                        aria-pressed={active}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
                <Button asChild>
                  <a href={gmapsDirectionsUrl} target="_blank" rel="noreferrer">
                    <RouteIcon className="mr-1 h-4 w-4" /> {modeMeta.label} directions
                  </a>
                </Button>
                {travelMode !== "transit" && (
                  <Button asChild variant="outline">
                    <a href={directionsUrl} target="_blank" rel="noreferrer">
                      {modeMeta.label} route (OSM)
                    </a>
                  </Button>
                )}
                <Button asChild>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=17/${selected.lat}/${selected.lng}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation className="mr-1 h-4 w-4" /> Open in maps
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Redeem on home</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}