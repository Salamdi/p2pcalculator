import cn from 'classnames'
import React from 'react';

const variants = {
  buy: {
    list: 'border-blue-500',
    title: 'bg-blue-200',
  },
  sell: {
    list: 'border-green-500',
    title: 'bg-green-200',
  }
}

type AdvGroupProps = {
  title: string;
  children: React.ReactNode;
  variant: 'buy' | 'sell';
}

export function AdvGroup({ title, children, variant }: AdvGroupProps) {
  const styles = variants[variant];
  return (
    <ul className={cn("h-[38dvh] mb-4 overflow-y-scroll lg:flex-1 m-4 rounded-lg border-2", styles.list)}>
      <p className={cn("text-center sticky top-0 p-1", styles.title)}><strong>{title}</strong></p>
      {children}
    </ul>
  )
}
