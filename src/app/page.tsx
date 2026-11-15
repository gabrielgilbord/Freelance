import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { ServicesBento } from "@/components/sections/services-bento";
import { SignalToSystem } from "@/components/sections/signal-to-system";
import { Process } from "@/components/sections/process";
import { SelectedWork } from "@/components/sections/selected-work";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { FinalCta } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <ServicesBento />
      <SignalToSystem />
      <SelectedWork />
      <Process />
      <AboutTeaser />
      <FinalCta />
    </>
  );
}
