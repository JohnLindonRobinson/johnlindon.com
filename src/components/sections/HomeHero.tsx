import React from 'react';

const HomeHero = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">John Robinson</h1>
        <p className="text-xl mb-4">Freelance Developer & Systems Consultant</p>
        <div className="prose prose-lg">
          <p>Welcome to my portfolio, where I showcase my work in software development and systems architecture.</p>
        </div>
      </div>
    </section>
  );
};

export default HomeHero; 