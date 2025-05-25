import React from "react";
import { Mail, Github, Linkedin } from "lucide-react";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950 border-t border-t-zinc-800/80 px-6 py-8 mt-16 text-zinc-300">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        {/* Left: Copyright */}
        <div className="text-sm font-medium flex-shrink-0">
          © {currentYear} John Lindon
        </div>
        {/* Right: Social/Contact Links */}
        <nav className="flex items-center gap-5">
          <a
            href="mailto:john@johnlindon.com"
            aria-label="Email John Lindon"
            className="hover:text-purple-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/JohnLindonRobinson"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-purple-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/johnlindon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-purple-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </footer>
  );
} 