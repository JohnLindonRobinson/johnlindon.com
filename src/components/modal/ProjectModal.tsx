import { useEffect, useRef, useState } from "react";
import FocusLock from "react-focus-lock";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ProjectModalProps {
  project: { 
    title: string; 
    contentHtml?: string; 
    description?: string;
    emoji?: string; 
    images?: string[]; 
    facts?: string[]; 
    factTooltips?: string[]; 
    links?: any[] 
  } | null;
  onClose: () => void;
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h3 className="uppercase font-bold tracking-widest text-xs text-purple-700 mb-2 mt-6 first:mt-0">
      {children}
    </h3>
  );
}

function MetaBadges({ facts = [], tooltips = [] }: { facts: string[]; tooltips?: string[] }) {
  if (!facts.length) return null;
  return (
    <div className="w-full mt-6 mb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {facts.map((fact, i) => (
        <span
          key={i}
          className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-1 text-xs text-purple-800 font-medium shadow-sm cursor-help text-center"
          title={tooltips && tooltips[i] ? tooltips[i] : undefined}
        >
          {fact}
        </span>
      ))}
    </div>
  );
}

function ImageCarousel({ images = [] }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return null;
  return (
    <div className="relative w-full max-w-lg aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center group transition-all md:max-w-2xl">
      {/* Subtle background shape */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="w-full h-full"
      >
        <Image
          src={images[idx]}
          alt="Project preview"
          fill
          className="object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105 group-hover:brightness-105"
          style={{ transition: 'transform 0.3s, filter 0.3s' }}
        />
      </motion.div>
      {images.length > 1 && (
        <>
          <button onClick={() => setIdx((idx - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white" aria-label="Previous image">‹</button>
          <button onClick={() => setIdx((idx + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white" aria-label="Next image">›</button>
        </>
      )}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-500 bg-white/80 rounded-full px-3 py-0.5 shadow-sm tracking-wide" style={{ letterSpacing: '0.04em' }}>
        Preview • {idx + 1}/{images.length}
      </div>
    </div>
  );
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  // Focus trap on open
  useEffect(() => {
    if (modalRef.current) modalRef.current.focus();
  }, []);

  if (!project) return null;

  // Enhance section headings in HTML
  function enhanceHeadings(html: string | undefined) {
    if (!html) return '';
    return html.replace(/<h3>(.*?)<\/h3>/g, (_, text) => `<h3 class='uppercase font-bold tracking-widest text-xs text-purple-700 mb-2 mt-4'>${text}</h3>`);
  }
  // Enhance links in HTML: add pill styles and icons
  function enhanceLinks(html: string) {
    if (!html) return '';
    return html.replace(
      /<a href=\"([^\"]*)\"[^>]*>(Live Demo|View Code)<\/a>/g,
      (match, href, label) => {
        const icon = label === 'Live Demo' ? '🔗' : '💻';
        return `<a href=\"${href}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm shadow-sm hover:bg-purple-200 transition-colors mr-2 mb-2 no-underline focus:outline-none focus:ring-2 focus:ring-purple-400\">${icon} ${label}</a>`;
      }
    );
  }
  // Compose enhanced HTML
  const enhancedHtml = enhanceLinks(enhanceHeadings(project.contentHtml)) || 
    `<p>${project?.description || 'No detailed description available.'}</p>
     <p>This project is currently showcased in our portfolio. Check back later for more detailed information.</p>`;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        className="fixed inset-0 bg-black/50 backdrop-blur z-40 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <FocusLock>
          <motion.div
            key="modal"
            ref={modalRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-0 relative z-50 outline-none focus:outline-none"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black focus:outline-none"
              onClick={onClose}
              aria-label="Close modal"
            >
              &times;
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
              {/* Left: Text only */}
              <div className="flex flex-col min-w-0 md:pr-6">
                <div className="flex items-center gap-3 mb-2">
                  {project.emoji && <span className="text-3xl" aria-hidden>{project.emoji}</span>}
                  <h2 className="text-3xl font-extrabold leading-tight tracking-tight mb-0">{project.title}</h2>
                </div>
                {/* Enhanced markdown content */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.1 }}
                  className="prose max-w-none text-lg mt-2"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: enhancedHtml }}
                />
              </div>
              {/* Right: Carousel, then tags, then links */}
              <div className="flex flex-col items-center justify-start min-w-0 md:pl-6 h-full">
                <SectionHeading>Screenshots</SectionHeading>
                <ImageCarousel images={project.images || []} />
                {/* Meta badges in a grid, below carousel */}
                {project.facts && <MetaBadges facts={project.facts} tooltips={project.factTooltips} />}
                {/* Render links from project.links, if present */}
                {Array.isArray(project.links) && project.links.length > 0 && (
                  <div className="mt-6 flex flex-col gap-2 items-center w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base text-purple-700 font-semibold tracking-wide">🔗 Links:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {project.links.map((link: any, i: number) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm shadow-sm hover:bg-purple-200 transition-colors no-underline focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                          {link.icon === 'link' ? '🔗' : link.icon === 'code' ? '💻' : ''} {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </FocusLock>
      </motion.div>
    </AnimatePresence>
  );
} 