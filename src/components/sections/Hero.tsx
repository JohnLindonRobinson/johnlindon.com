import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ParallaxLogo } from "@/components/ParallaxLogo";
import { TypewriterText } from "@/components/TypewriterText";

export function Hero() {
  return (
    <section className="relative bg-[#F9F5FC] pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="relative max-w-4xl">
          {/* Background Logo with Parallax */}
          <ParallaxLogo />

          {/* Main Content */}
          <div className="space-y-4 relative z-10">
            <p className="font-work-sans font-light text-base text-black/80 h-[1.5em] flex items-center">
              Specialising in&nbsp;<TypewriterText />
            </p>

            <h1 className="font-manrope font-extrabold text-4xl md:text-6xl tracking-tighter leading-tight">
              HEADLINE FOR THE WEBSITE,
              <br />
              SECOND LINE OF HEADLINE
            </h1>

            <p className="font-work-sans text-lg md:text-2xl text-black/80 max-w-[65ch]">
              Lorem ipsum dolor sit amet consectetur. Tincidunt feugiat purus nibh viverra
              tristique. Malesuada mus odio nulla vulputate at id in pulvinar et.
            </p>

            <div className="flex items-center space-x-8 pt-4 mb-4">
              <Button asChild size="lg">
                <Link href="/contact">Get In Touch</Link>
              </Button>
              <Button asChild variant="ghost" className="font-manrope font-extrabold text-lg hover:text-primary transition-colors">
                <Link href="/services">Second CTA &gt;</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 