"use client";

import { useEffect, useMemo } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Trip } from "@/lib/api";
import { tripHref } from "@/lib/api";
import "leaflet/dist/leaflet.css";

const PINS: { slug: string; lat: number; lng: number }[] = [
  { slug: "australian-camp-dhampus", lat: 28.301, lng: 83.87 },
  { slug: "sarangkot-naudanda", lat: 28.244, lng: 83.938 },
  { slug: "panchase", lat: 28.232, lng: 83.8 },
  { slug: "ghandruk-village", lat: 28.375, lng: 83.807 },
  { slug: "sikles", lat: 28.345, lng: 84.1 },
  { slug: "kuri-danda", lat: 28.28, lng: 83.72 },
  { slug: "ghorepani-poon-hill", lat: 28.4, lng: 83.6989 },
  { slug: "mardi-himal", lat: 28.473, lng: 83.946 },
  { slug: "mohare-danda", lat: 28.37, lng: 83.65 },
  { slug: "annapurna-base-camp", lat: 28.5304, lng: 83.878 },
  { slug: "khopra-danda", lat: 28.385, lng: 83.67 },
  { slug: "annapurna-circuit", lat: 28.6667, lng: 84.0167 },
  { slug: "upper-mustang", lat: 29.183, lng: 83.958 },
  { slug: "kaligandaki-1-day", lat: 28.478, lng: 83.605 },
  { slug: "kaligandaki-2-day", lat: 28.52, lng: 83.62 },
  { slug: "kaligandaki-3-day", lat: 28.56, lng: 83.64 },
];

function FitPins({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    map.fitBounds(points, { padding: [36, 36], maxZoom: 10 });
  }, [map, points]);
  return null;
}

export default function PokharaMapCanvas({ trips }: { trips: Trip[] }) {
  const t = useTranslations("map");
  const markers = useMemo(
    () =>
      PINS.map((pin) => ({
        ...pin,
        trip: trips.find((x) => x.slug === pin.slug),
      })).filter((m) => m.trip),
    [trips],
  );
  const points = useMemo(
    () => markers.map((m) => [m.lat, m.lng] as [number, number]),
    [markers],
  );

  return (
    <MapContainer
      center={[28.4, 83.9]}
      zoom={8}
      scrollWheelZoom={false}
      className="z-0 h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <FitPins points={points} />
      {markers.map(({ slug, lat, lng, trip }) => {
        const river = trip!.kind === "rafting";
        return (
          <CircleMarker
            key={slug}
            center={[lat, lng]}
            radius={9}
            pathOptions={{
              color: "#ffffff",
              weight: 2,
              fillColor: river ? "#0f9d9a" : "#2f6fed",
              fillOpacity: 1,
            }}
          >
            <Popup>
              <p className="text-[10px] uppercase tracking-[0.14em] text-sky">
                {river ? trip!.grade : trip!.difficultyLabel}
              </p>
              <p className="mt-1 font-serif text-lg leading-tight text-ink">{trip!.name}</p>
              <p className="mt-1 text-xs text-ink-soft">{trip!.summary}</p>
              <Link href={tripHref(trip!)} className="mt-2 inline-block text-sm text-sky underline-offset-4 hover:underline">
                {t("open")}
              </Link>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
