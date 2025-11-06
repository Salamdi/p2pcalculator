import cn from 'classnames'
import { useSearch } from '@tanstack/react-router'
import { AdvItem } from './AdvItem'
import { PaymentSelect } from './PaymentSelect'
import { FiatSelect } from './FiatSelect'
import { Button } from '@/components/ui/button'
import { useP2PQuery } from '@/hooks/useP2PQuery'
import { useAdvertsStore } from '@/store/adverts'

const variants = {
  buy: {
    list: 'border-blue-500',
    title: 'bg-blue-200',
  },
  sell: {
    list: 'border-green-500',
    title: 'bg-green-200',
  },
}

type AdvGroupProps = {
  title: string
  variant: 'buy' | 'sell'
  tradeType: 'BUY' | 'SELL'
}

export function AdvGroup({ title, variant, tradeType }: AdvGroupProps) {
  const styles = variants[variant]
  const { asset, buyFor, sellFor, buyPayment, sellPayment } = useSearch({
    from: '/rates/',
  })

  const fiat = variant === 'buy' ? buyFor : sellFor
  const payType = variant === 'buy' ? buyPayment : sellPayment

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useP2PQuery({
    fiat,
    tradeType,
    payTypes: payType,
    asset: asset || 'USDT',
  })

  const {
    selectedSellAdv,
    selectedBuyAdv,
    setSelectedSellAdv,
    setSelectedBuyAdv,
  } = useAdvertsStore()
  const selectedAdvInStore =
    variant === 'buy' ? selectedSellAdv : selectedBuyAdv
  const onAdvSelect = variant === 'buy' ? setSelectedSellAdv : setSelectedBuyAdv

  const handleSelect = (advNo: string) => {
    const adv = data?.find((a) => a.adv.advNo === advNo)
    onAdvSelect(adv)
  }

  return (
    <ul
      className={cn(
        'h-[38dvh] mb-4 overflow-y-scroll lg:flex-1 mx-4 rounded-lg border-2',
        styles.list,
      )}
    >
      <div
        className={cn('flex items-center sticky top-0 p-1 px-4', styles.title)}
      >
        <p>
          <strong>{title}</strong>
        </p>
        <div className="flex-1 flex justify-end gap-1">
          <FiatSelect variant={variant} />
          <PaymentSelect fiat={fiat} variant={variant} />
        </div>
      </div>
      {data?.map((advItem) => (
        <AdvItem
          key={advItem.adv.advNo}
          item={advItem}
          isSelected={selectedAdvInStore?.adv.advNo === advItem.adv.advNo}
          onSelect={() => handleSelect(advItem.adv.advNo)}
          variant={variant}
        />
      ))}
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
