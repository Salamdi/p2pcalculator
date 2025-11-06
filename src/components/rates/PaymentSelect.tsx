import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronsUpDown } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Item, ItemContent, ItemGroup, ItemTitle } from '../ui/item'
import { Spinner } from '../ui/spinner'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import type { ChangeEventHandler } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { useAdvertsStore } from '@/store/adverts'

interface IPaymentMethod {
  identifier: string
  tradeMethodName: string
  tradeMethodShortName: string
  tradeMethodBgColor: string
}

type PaymentSelectProps = {
  fiat: string
  variant: 'buy' | 'sell'
}

export function PaymentSelect({ fiat, variant }: PaymentSelectProps) {
  const { buyPayment, sellPayment } = useSearch({
    from: '/rates/',
  })
  const navigate = useNavigate({ from: '/rates' })
  const [query, setQuery] = useState('')
  const resetAdverts = useAdvertsStore((state) => state.reset)
  const { data: paymentMethods, isPending } = useQuery<Array<IPaymentMethod>>({
    queryKey: ['payment-methods', fiat],
    queryFn: async () => {
      const res = await fetch('/bapi/c2c/v2/public/c2c/adv/filter-conditions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          fiat,
          classifies: ['mass', 'profession', 'fiat_trade'],
        }),
      })
      const json: any = await res.json()
      return json.data.tradeMethods
    },
  })

  const handleQuery: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target
      setQuery(value)
    },
    [setQuery],
  )

  const payTypes = useMemo(() => {
    return variant === 'buy' ? buyPayment : sellPayment
  }, [variant, buyPayment, sellPayment])

  const current = useMemo(() => {
    if (!payTypes || payTypes.length === 0) {
      return 'All Payments'
    }
    return payTypes.join(', ')
  }, [payTypes])

  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handlePaymentSelect = useCallback(
    async (paymentMethod: string) => {
      const field = variant === 'buy' ? 'buyPayment' : 'sellPayment'
      let newPayTypes: Array<string> = []
      if (paymentMethod === 'all') {
        newPayTypes = []
      } else {
        const currentPayTypes = payTypes || []
        if (currentPayTypes.includes(paymentMethod)) {
          newPayTypes = currentPayTypes.filter((p) => p !== paymentMethod)
        } else {
          newPayTypes = [...currentPayTypes, paymentMethod]
        }
      }
      await navigate({ search: (prev) => ({ ...prev, [field]: newPayTypes }) })
      resetAdverts()
    },
    [variant, navigate, payTypes, resetAdverts],
  )

  const handleDrawerClose = useCallback(() => {
    setQuery('')
  }, [setQuery])

  const isChecked = (identifier: string) => {
    if (identifier === 'all') {
      return !payTypes || payTypes.length === 0
    }
    return payTypes?.includes(identifier) || false
  }

  return (
    <Drawer onClose={handleDrawerClose}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <p className="max-w-12 truncate">{isPending ? <Spinner /> : <>{current}</>}</p>
          <ChevronsUpDown />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <div className="flex gap-4 pb-4">
              <Input
                placeholder="Search"
                className="flex-1"
                value={query}
                onChange={handleQuery}
              />
              <DrawerClose ref={closeButtonRef}>Cancel</DrawerClose>
            </div>
          </DrawerTitle>
        </DrawerHeader>

        <ItemGroup>
          <div className="h-[65dvh] overflow-y-auto">
            {paymentMethods === undefined || isPending ? (
              <Spinner />
            ) : (
              <>
                <Item
                  key="all"
                  size="sm"
                  onClick={() => handlePaymentSelect('all')}
                >
                  <Checkbox checked={isChecked('all')} />
                  <ItemContent>
                    <ItemTitle className="font-bold">All Payments</ItemTitle>
                  </ItemContent>
                </Item>
                {paymentMethods
                  .filter((p) =>
                    p.tradeMethodName
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((p) => (
                    <Item
                      key={p.identifier}
                      size="sm"
                      onClick={() => handlePaymentSelect(p.identifier)}
                    >
                      <Checkbox checked={isChecked(p.identifier)} />
                      <ItemContent>
                        <ItemTitle className="font-bold">
                          {p.tradeMethodName}
                        </ItemTitle>
                      </ItemContent>
                    </Item>
                  ))}
              </>
            )}
          </div>
        </ItemGroup>
      </DrawerContent>
    </Drawer>
  )
}
