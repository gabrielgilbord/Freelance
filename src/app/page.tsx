import { Hero } from "@/components/sections/hero";
import { PromiseStrip } from "@/components/sections/promise-strip";
import { ServicesBento } from "@/components/sections/services-bento";
import { EntryPoints } from "@/components/sections/entry-points";
import { Capabilities } from "@/components/sections/capabilities";
import { Process } from "@/components/sections/process";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { FinalCta } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromiseStrip />
      <ServicesBento />
      <EntryPoints />
      <Capabilities />
      <Process />
      <FeaturedProjects />
      <AboutTeaser />
      <FinalCta />
    </>
  );
}
