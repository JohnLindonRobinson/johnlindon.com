'use client';

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, type Variants } from "framer-motion";

const projects = [
  {
    title: 'Project Name',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est tincidunt sit pharetra accumsan pellentesque purus non nulla. Curabitur mi sed ultrices nec leo fermentum amet pretium natoque. Nibh aenean',
    tags: ['#Tags', '#Tags', '#Tags', '#Tags'],
  },
  {
    title: 'Project Name',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est tincidunt sit pharetra accumsan pellentesque purus non nulla. Curabitur mi sed ultrices nec leo fermentum amet pretium natoque. Nibh aenean',
    tags: ['#Tags', '#Tags', '#Tags', '#Tags'],
  },
  {
    title: 'Project Name',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est tincidunt sit pharetra accumsan pellentesque purus non nulla. Curabitur mi sed ultrices nec leo fermentum amet pretium natoque. Nibh aenean',
    tags: ['#Tags', '#Tags', '#Tags', '#Tags'],
  },
  {
    title: 'Project Name',
    description: 'Lorem ipsum dolor sit amet consectetur. Ullamcorper est tincidunt sit pharetra accumsan pellentesque purus non nulla. Curabitur mi sed ultrices nec leo fermentum amet pretium natoque. Nibh aenean',
    tags: ['#Tags', '#Tags', '#Tags', '#Tags'],
  },
]

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

export function FeaturedWork() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="font-manrope font-extrabold text-4xl tracking-tighter mb-16"
        >
          FEATURED WORK
        </motion.h2>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`group relative rounded-xl overflow-hidden border border-white/20 shadow-lg ${
                index % 2 === 0 
                  ? 'bg-gradient-to-b from-[#EDE5F4]/90 to-[#EDE5F4]/70' 
                  : 'bg-gradient-to-b from-[#F5EAFD]/90 to-[#F5EAFD]/70'
              }`}
            >
              {/* Background Logo */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -bottom-1/4 -right-1/4 -left-1/4 flex items-end justify-end opacity-[0.06] blur-[2px]">
                  <img
                    src="/logo.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-[400px] max-w-none rotate-12 transform-gpu transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Project Image */}
              <div className="relative h-64 bg-[#EFE6E6]/50 rounded-t-xl">
                <div className="absolute inset-0 flex items-center justify-center gap-4 transition-transform duration-700 ease-out group-hover:scale-105">
                  <Image
                    src="/images/project-icon-1.svg"
                    alt=""
                    width={48}
                    height={48}
                    className="text-black transition-transform duration-500 ease-out group-hover:-translate-x-2"
                  />
                  <Image
                    src="/images/project-icon-2.svg"
                    alt=""
                    width={48}
                    height={48}
                    className="text-black transition-transform duration-500 ease-out group-hover:translate-x-2"
                  />
                </div>
              </div>

              {/* Project Content */}
              <div className="p-8">
                <h3 className="font-manrope font-bold text-2xl mb-4">
                  {project.title}
                </h3>

                <p className="font-work-sans font-light text-sm text-black/80 mb-6">
                  {project.description}
                </p>

                {/* Tags and Button Container */}
                <div className="flex items-center justify-between">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-primary/10 rounded-lg font-manrope font-light text-sm text-black/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="relative flex justify-end">
                    {/* Corner Flourish */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-2 border-b-2 border-primary/20 rounded-br-xl transition-colors duration-300 group-hover:border-primary/40" />
                    <Button 
                      asChild
                      variant="default" 
                      className="font-manrope font-bold hover:bg-transparent hover:text-primary transition-colors px-4"
                    >
                      <Link href={`/portfolio/${index + 1}`}>Learn More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 