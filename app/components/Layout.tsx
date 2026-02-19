"use client";

import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-dvh w-full flex justify-center bg-bg font-body text-text overflow-hidden">
      <div className="w-full max-w-[480px] bg-bg h-full relative flex flex-col shadow-none border-x border-light-gray">
        {children}
      </div>
    </div>
  );
};

export default Layout;
