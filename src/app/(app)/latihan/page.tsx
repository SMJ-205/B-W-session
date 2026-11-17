import type { Metadata } from "next";
import { PracticeView } from "@/components/app/practice-view";

export const metadata: Metadata = { title: "Latihan harian · Notes of Nopia" };

export default function PracticePage() {
  return <PracticeView />;
}
