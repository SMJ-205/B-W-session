import type { Metadata } from "next";
import { DashboardView } from "@/components/app/dashboard-view";

export const metadata: Metadata = { title: "Beranda · Notes of Nopia" };

export default function DashboardPage() {
  return <DashboardView />;
}
