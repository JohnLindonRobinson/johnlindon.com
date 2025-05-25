import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FeaturedWork from "@/components/sections/FeaturedWork";
import Testimonials from "@/components/sections/Testimonials";

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  import('@/utils/logPlaceholders').then(mod => mod.logPlaceholders());
}

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedWork />
      <Testimonials />
    </>
  );
}
