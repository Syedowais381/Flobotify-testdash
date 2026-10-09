"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [activeNav, setActiveNav] = useState('Overview');

  return (
    <>
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <main className="main-content">
        <Dashboard activeNav={activeNav} />
      </main>
    </>
  );
}
