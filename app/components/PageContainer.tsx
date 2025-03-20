import React from 'react';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`container mx-auto px-4 py-8 pt-24 md:pt-28 ${className}`}>
      {children}
    </div>
  );
} 