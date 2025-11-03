import cn from 'classnames'
import { Button } from '@/components/ui/button';
import { useP2PQuery } from '@/hooks/useP2PQuery';
import { AdvItem } from './AdvItem';
import { useAdvertsStore } from '@/store/adverts';

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
  variant: 'buy' | 'sell';
  fiat: string;
  tradeType: 'BUY' | 'SELL';
  payTypes: string[];
}

export function AdvGroup({ title, variant, fiat, tradeType, payTypes }: AdvGroupProps) {
  const styles = variants[variant];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useP2PQuery({ fiat, tradeType, payTypes });

  const { selectedSellAdv, selectedBuyAdv, setSelectedSellAdv, setSelectedBuyAdv } = useAdvertsStore();
  const selectedAdvInStore = variant === 'buy' ? selectedSellAdv : selectedBuyAdv;
  const onAdvSelect = variant === 'buy' ? setSelectedSellAdv : setSelectedBuyAdv;

  const handleSelect = (advNo: string) => {
    const adv = data?.find(a => a.adv.advNo === advNo);
    onAdvSelect(adv);
  }

  return (
    <ul className={cn("h-[38dvh] mb-4 overflow-y-scroll lg:flex-1 m-4 rounded-lg border-2", styles.list)}>
      <p className={cn("text-center sticky top-0 p-1", styles.title)}><strong>{title}</strong></p>
      {data?.map((advItem) => (
          <AdvItem
            key={advItem.adv.advNo}
            item={advItem}
            isSelected={selectedAdvInStore?.adv.advNo === advItem.adv.advNo}
            onSelect={() => handleSelect(advItem.adv.advNo)}
            variant={variant}
          />
        ))
      }
      {hasNextPage && (
        <div className="flex justify-center p-2">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        </div>
      )}
    </ul>
  )
}
