"use client";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Fragments } from "@/components/Fragments";
import { heroData } from "@/data/siteData";

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // CTA Glow State
  const [ctaHover, setCtaHover] = useState(false);
  const [ctaPos, setCtaPos] = useState({ x: 0, y: 0 });
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const { scrollY } = useScroll();
  // Parallax for hero image
  const yParallax = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : 60]);

  // Rotating typewriter effect for specialisation
  const specialisations = heroData.specialisations;
  const [specIndex, setSpecIndex] = useState(0);
  const [typedSpec, setTypedSpec] = useState(shouldReduceMotion ? specialisations[0] : "");
  const [phase, setPhase] = useState<'typing' | 'deleting'>('typing');
  const [charIndex, setCharIndex] = useState(0);
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!mounted) return;
    let timeout: NodeJS.Timeout;
    const current = specialisations[specIndex];
    if (phase === 'typing') {
      if (charIndex < current.length) {
        timeout = setTimeout(() => {
          setTypedSpec(current.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 48);
      } else {
        timeout = setTimeout(() => setPhase('deleting'), 2000);
      }
    } else if (phase === 'deleting') {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setTypedSpec(current.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 32);
      } else {
        timeout = setTimeout(() => {
          setSpecIndex((specIndex + 1) % specialisations.length);
          setPhase('typing');
        }, 300);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, phase, specIndex, mounted, shouldReduceMotion]);
  useEffect(() => {
    if (shouldReduceMotion) {
      setTypedSpec(specialisations[0]);
      setSpecIndex(0);
      setPhase('typing');
      setCharIndex(specialisations[0].length);
    } else {
      setTypedSpec("");
      setCharIndex(0);
      setPhase('typing');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion, mounted]);

  function handleCtaMove(e: React.MouseEvent) {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    setCtaPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  // Animation variants
  const headlineVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0, ease: [0.33, 1, 0.68, 1] } },
  };
  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2, ease: [0.33, 1, 0.68, 1] } },
  };
  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.4, ease: [0.33, 1, 0.68, 1] } },
  };
  const glowVariants = {
    animate: {
      scale: shouldReduceMotion ? [1, 1, 1] : [1, 1.03, 1],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative flex items-center justify-center bg-gradient-to-br from-[#18181B] to-[#232136] overflow-hidden pt-24 pb-32 md:pt-32 md:pb-40">
      <Fragments />
      {/* Animated glow accent behind headline (now with slow movement) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] md:w-[600px] md:h-[300px] rounded-full bg-purple-700/30 blur-3xl opacity-70"
        initial={{ left: '50%', top: '33%' }}
        animate={mounted ? {
          left: ["50%", "60%", "48%", "52%", "50%"],
          top: ["33%", "38%", "30%", "36%", "33%"],
          transition: {
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : {}}
        style={{ left: '50%', top: '33%' }}
      />
      {/* Profile Image with Glow */}
      <div className="hidden md:block absolute bottom-0 right-12 z-20 isolate">
        <motion.img
          src={heroData.profileImage}
          alt={heroData.name + " portrait"}
          style={{ y: yParallax, pointerEvents: 'none', maxWidth: '100vw' }}
          className="relative z-10 w-[40rem] h-auto object-contain rounded-2xl shadow-2xl transition-transform duration-300 ease-out hover:scale-105 hover:-rotate-1 m-0"
          draggable={false}
        />
        <div className="absolute -inset-8 z-0 rounded-2xl bg-gradient-to-br from-violet-500/20 to-transparent blur-2xl opacity-60" />
      </div>
      <div className="container mx-auto px-4 relative z-10 text-left">
        {/* User Image: Large, right-aligned, flush with bottom of hero */}
        
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg"
          initial="hidden"
          animate={mounted ? "visible" : false}
          variants={headlineVariants}
        >
          {heroData.name}
        </motion.h1>
        <motion.p
          className="text-2xl md:text-3xl text-gray-200 font-medium mb-10 max-w-2xl leading-tight"
          initial="hidden"
          animate={mounted ? "visible" : false}
          variants={subtitleVariants}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {heroData.headline} <span className="text-purple-400">{heroData.subtitle}</span>.
        </motion.p>
        <motion.div
          initial="hidden"
          animate={mounted ? "visible" : false}
          variants={ctaVariants}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Link
            ref={ctaRef}
            href="/contact"
            className={
              "relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl overflow-hidden shadow-lg transition-all duration-200 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 " +
              "hover:scale-105 group"
            }
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            onMouseMove={handleCtaMove}
          >
            {/* Radial Glow */}
            <span
              className={
                "pointer-events-none absolute z-10 block rounded-full transition-opacity duration-200 " +
                (ctaHover ? "opacity-60" : "opacity-0")
              }
              style={{
                left: ctaPos.x - 60,
                top: ctaPos.y - 60,
                width: 120,
                height: 120,
                background: "radial-gradient(circle, rgba(255,255,255,0.32) 0%, rgba(196,181,253,0.18) 60%, transparent 100%)",
                filter: "blur(6px)",
                transition: "left 0.1s, top 0.1s, opacity 0.2s",
                pointerEvents: "none",
              }}
              aria-hidden
            />
            {/* Pulse Glow (when not hovered) */}
            <span
              className={
                "pointer-events-none absolute z-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full " +
                (ctaHover ? "opacity-0" : "opacity-40 animate-cta-pulse")
              }
              style={{
                width: 120,
                height: 120,
                background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 80%)",
                filter: "blur(10px)",
                pointerEvents: "none",
              }}
              aria-hidden
            />
            Get In Touch
            <span
              aria-hidden="true"
              className="text-xl transform transition-transform duration-200 group-hover:translate-x-1"
            >
              ➜
            </span>
          </Link>
          {/* Pulse animation keyframes */}
          <style>{`
            @keyframes cta-pulse {
              0%, 100% { opacity: 0.6; transform: scale(1); }
              50% { opacity: 0.9; transform: scale(1.12); }
            }
            .animate-cta-pulse {
              animation: cta-pulse 6s cubic-bezier(0.33,1,0.68,1) infinite;
            }
          `}</style>
          {/* Specialisation Typewriter Badge */}
          <div className="mt-6">
            <span className="inline-block rounded-full bg-violet-700/20 text-purple-300 font-semibold px-5 py-2 text-base md:text-lg shadow-sm border border-violet-400/20 transition-all duration-300 ease-out" aria-label="Specialising in React, Next.js, and TypeScript.">
              Specialising in {typedSpec}
              <span className="inline-block w-2 animate-pulse align-baseline">|</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}