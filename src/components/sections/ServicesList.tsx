import React, { useEffect, useRef } from 'react';

interface Service {
  id: string | number;
  title: string;
  description: string;
}

interface ServicesListProps {
  services: Service[];
}

const vibrate = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(30);
  }
};

export default function ServicesList({ services }: ServicesListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.service-card');
    if (!cards) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            vibrate();
          }
        });
      },
      { threshold: 0.7 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth" ref={containerRef}>
      {services.map((service, idx) => (
        <div className="service-card snap-start h-screen flex items-center justify-center" key={service.id || idx}>
          <h2>{service.title}</h2>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
} 