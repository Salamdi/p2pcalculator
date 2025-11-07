import cn from 'classnames'
import type { Adv } from './types'
import { Button } from '@/components/ui/button'

const variants = {
  buy: {
    item: {
      selected: 'bg-blue-300 sticky top-11 bottom-0',
      hover: 'hover:bg-blue-100',
    },
    button: 'min-w-25 bg-blue-500 hover:bg-blue-600',
  },
  sell: {
    item: {
      selected: 'bg-green-300 sticky top-11 bottom-0',
      hover: 'hover:bg-green-100',
    },
    button: 'min-w-25 bg-green-500 hover:bg-green-600',
  },
}

type AdvItemProps = {
  item: Adv
  isSelected: boolean
  onSelect: (advNo: string) => void
  variant: 'buy' | 'sell'
}

export function AdvItem({ item, isSelected, onSelect, variant }: AdvItemProps) {
  const styles = variants[variant]
  return (
    <li
      className={cn(
        'flex justify-between py-1 px-4 items-center cursor-pointer',
        {
          [styles.item.selected]: isSelected,
          [styles.item.hover]: !isSelected,
        },
      )}
      onClick={() => {
        if (isSelected) {
          onSelect('')
          return
        }
        onSelect(item.adv.advNo)
      }}
    >
      <span>
        {item.adv.price} {item.adv.fiatSymbol}
      </span>
      <Button
        className={cn(
          styles.button,
          'disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors',
        )}
      >
        {isSelected ? 'Deselect' : 'Select'}
      </Button>
    </li>
  )
}
