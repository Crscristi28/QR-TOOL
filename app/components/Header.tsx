"use client";

import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="px-6 pt-8 pb-4 border-b border-light-gray bg-bg sticky top-0 z-10">
      <h1 className="font-heading font-semibold text-[28px] leading-tight text-text tracking-tight">
        {title}
      </h1>
      <p className="font-body text-sm text-gray mt-1">
        {subtitle}
      </p>
    </header>
  );
};

export default Header;
