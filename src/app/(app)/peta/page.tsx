import type { Metadata } from "next";
import { MapView } from "@/components/app/map-view";

export const metadata: Metadata = { title: "Peta level · Piano Belajar" };

export default function MapPage() {
  return <MapView />;
}
