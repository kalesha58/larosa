import React from 'react';

export default function HeroSample() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8">
      <h1 className="text-5xl font-bold tracking-tight mb-4">Larosa Premium</h1>
      <p className="text-xl text-muted-foreground mb-8">Elevating aesthetic experiences with modern technology.</p>
      <button className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all font-medium">
        Get Started
      </button>
    </div>
  );
}
