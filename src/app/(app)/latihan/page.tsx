import type { Metadata } from "next";
import { PracticeView } from "@/components/app/practice-view";

export const metadata: Metadata = { title: "Latihan harian · Piano Belajar" };

export default function PracticePage() {
  return <PracticeView />;
}
