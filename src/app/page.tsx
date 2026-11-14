import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { ServicesBento } from "@/components/sections/services-bento";
import { Capabilities } from "@/components/sections/capabilities";
import { Process } from "@/components/sections/process";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { AboutTeaser } from "@/components/sections/about-teaser";
import { FinalCta } from "@/components/sections/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <ServicesBento />
      <Capabilities />
      <Process />
      <FeaturedProjects />
      <AboutTeaser />
      <FinalCta />
    </>
  );
}
