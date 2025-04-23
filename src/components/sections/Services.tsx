'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

const services = [
  {
    title: "Frontend Development",
    summary: "Building beautiful, responsive web applications",
    description:
      "Modern web development with React, Next.js, and TypeScript. Focus on performance, accessibility, and user experience.",
  },
  {
    title: "Backend Integration",
    summary: "Connecting your frontend to powerful services",
    description:
      "Seamless integration with APIs, databases, and third-party services. Building robust, scalable backend solutions.",
  },
  {
    title: "UI/UX Implementation",
    summary: "Bringing designs to life with precision",
    description:
      "Pixel-perfect implementation of designs, with smooth animations and interactions. Focus on maintainable, semantic code.",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <motion.section 
      ref={sectionRef}
      style={{ opacity, scale }}
      className="relative"
    >
      {/* Background that will overlap hero's logo */}
      <div className="absolute inset-0 bg-[#F9F5FC] z-10" />
      
      {/* Main content above the background */}
      <div className="relative z-20 py-20 px-4">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="font-manrope font-extrabold text-4xl tracking-tighter mb-16"
          >
            SERVICES
          </motion.h2>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={item}
                className={`group relative rounded-xl p-6 overflow-hidden border border-white/20 shadow-lg min-h-[252px] flex flex-col ${
                  index % 2 === 0 
                    ? 'bg-gradient-to-b from-[#EDE5F4]/90 to-[#EDE5F4]/70' 
                    : 'bg-gradient-to-b from-[#F5EAFD]/90 to-[#F5EAFD]/70'
                }`}
              >
                {/* Background Logo */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-y-0 -right-1/4 -left-1/4 flex items-center justify-end opacity-[0.06] blur-[2px]">
                    <img
                      src="/logo.svg"
                      alt=""
                      aria-hidden="true"
                      className="w-[400px] max-w-none rotate-12 transform-gpu transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Header with Icon and Title */}
                <div className="relative flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Image
                      src="/images/service-icon.svg"
                      alt=""
                      width={20}
                      height={20}
                      className="text-primary"
                    />
                  </div>
                  <h3 className="font-manrope font-bold text-xl">{service.title}</h3>
                </div>
                
                <p className="font-work-sans text-sm text-black/60 mb-3">
                  {service.summary}
                </p>

                <p className="font-work-sans font-light text-xs text-black/80">
                  {service.description}
                </p>

                <div className="relative mt-auto pt-6">
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/20 transition-colors duration-300 group-hover:bg-primary/40" />
                  <Button 
                    variant="secondary" 
                    className="font-manrope font-bold hover:bg-transparent hover:text-primary transition-colors px-0"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
} 