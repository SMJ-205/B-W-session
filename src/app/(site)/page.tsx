import { Hero } from "@/components/site/hero";
import { LevelList } from "@/components/site/level-list";
import { Stages } from "@/components/site/stages";
import { TempoShowcase } from "@/components/site/tempo-showcase";
import { Closing } from "@/components/site/closing";
import { SiteFooter } from "@/components/site/site-footer";

export default function Home() {
  return (
    <div className="dotted text-ink">
      <main>
        <Hero />
        <LevelList />
        <Stages />
        <TempoShowcase />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
