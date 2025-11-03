import cn from 'classnames'
import React from 'react';
import { Button } from '@/components/ui/button';

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
  hasNextPage?: boolean;
  onLoadMore: () => void;
  isFetchingNextPage?: boolean;
}

export function AdvGroup({ title, children, variant, hasNextPage, onLoadMore, isFetchingNextPage }: AdvGroupProps) {
  const styles = variants[variant];
  return (
    <ul className={cn("h-[38dvh] mb-4 overflow-y-scroll lg:flex-1 m-4 rounded-lg border-2", styles.list)}>
      <p className={cn("text-center sticky top-0 p-1", styles.title)}><strong>{title}</strong></p>
      {children}
      {hasNextPage && (
        <div className="flex justify-center p-2">
          <Button onClick={() => onLoadMore()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        </div>
      )}
    </ul>
  )
}
