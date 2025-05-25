import { testimonials } from '@/data/siteData';
import Image from 'next/image';

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#F5EAFD]/60 to-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-2 text-left">
          <h2 className="text-4xl font-bold mb-4">What Clients Say</h2>
          <p className="text-lg text-black/70 mb-10">Real feedback from people I've worked with.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-purple-100 hover:shadow-xl transition-shadow"
            >
              <Image
                src={t.avatar}
                alt={`Photo of ${t.name}`}
                width={64}
                height={64}
                className="rounded-full mb-4 border-2 border-purple-200 shadow-sm"
              />
              <blockquote className="text-lg font-medium text-black/80 mb-4">"{t.quote}"</blockquote>
              <div className="font-semibold text-purple-700">{t.name}</div>
              <div className="text-sm text-black/60 mb-1">{t.role} at {t.company}</div>
              {t.link && (
                <a
                  href={t.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-500 underline hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
                >
                  View Profile
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 