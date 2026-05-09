"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import AIAssistant from '@/components/travel/AIAssistant';

const AIAssistantPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8 container mx-auto flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">AI Concierge</h1>
          <p className="text-slate-500 text-sm">Your personal travel assistant, powered by neural networks.</p>
        </div>
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <AIAssistant weather="Clear" distance={600} />
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPage;