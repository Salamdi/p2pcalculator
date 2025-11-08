import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronsUpDown } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Item, ItemContent, ItemGroup, ItemTitle } from '../ui/item'
import { Spinner } from '../ui/spinner'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import type { ChangeEventHandler } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

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
  const searchParamName = useMemo(() => variant === 'buy' ? 'buyPayment' : 'sellPayment', [variant])
  const navigate = useNavigate({ from: '/rates' })
  const [query, setQuery] = useState('')
  const payTypes = useMemo(() => {
    return variant === 'buy' ? buyPayment : sellPayment
  }, [variant, buyPayment, sellPayment])
  const [localPayTypes, setLocalPayTypes] = useState<string[]>(payTypes)
  const { data: paymentMethods, isPending } = useQuery<IPaymentMethod[]>({
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

  const current = useMemo(() => {
    if (!payTypes || payTypes.length === 0) {
      return 'All Payments'
    }
    return payTypes.join(', ')
  }, [payTypes])

  useEffect(() => {
    const isSubset = payTypes.every(
      (pt) => paymentMethods?.findIndex((pm) => pt === pm.identifier) !== -1
    )
    if (isSubset) {
      return;
    }
    navigate({ search: (prev) => ({ ...prev, [searchParamName]: [] }) })
    setLocalPayTypes([])
  }, [payTypes, paymentMethods, navigate, searchParamName, setLocalPayTypes])

  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handlePaymentSelect = useCallback(
    (paymentMethod: string) => {
      let newPayTypes: string[] = []
      if (paymentMethod === 'all') {
        newPayTypes = []
      } else {
        const currentPayTypes = localPayTypes || []
        if (currentPayTypes.includes(paymentMethod)) {
          newPayTypes = currentPayTypes.filter((p) => p !== paymentMethod)
        } else {
          newPayTypes = [...currentPayTypes, paymentMethod]
        }
      }
      setLocalPayTypes(newPayTypes)
    },
    [localPayTypes],
  )

  const handleSave = useCallback(async () => {
    await navigate({ search: (prev) => ({ ...prev, [searchParamName]: localPayTypes }) })
    closeButtonRef.current?.click()
  }, [variant, navigate, localPayTypes])

  const handleDrawerClose = useCallback(() => {
    setQuery('')
    setLocalPayTypes(payTypes)
  }, [setQuery, payTypes])

  const isChecked = (identifier: string) => {
    if (identifier === 'all') {
      return !localPayTypes || localPayTypes.length === 0
    }
    return localPayTypes?.includes(identifier) || false
  }

  return (
    <Drawer onClose={handleDrawerClose}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <p className="max-w-12 truncate">
            {isPending ? <Spinner /> : <>{current}</>}
          </p>
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
            </div>
          </DrawerTitle>
        </DrawerHeader>

        <ItemGroup>
          <div className="h-[40dvh] overflow-y-auto">
            <ItemGroup>
              <Item
                key="all"
                size="sm"
                onClick={() => handlePaymentSelect('all')}
              >
                <Checkbox checked={isChecked('all')} />
                <ItemContent>
                  <ItemTitle className="font-bold">
                    All Payments methods
                  </ItemTitle>
                </ItemContent>
              </Item>
            </ItemGroup>
            <div className="px-4">
              <Separator />
            </div>
            {paymentMethods === undefined || isPending ? (
              <Spinner />
            ) : (
              paymentMethods
                .filter((p) =>
                  p.tradeMethodName.toLowerCase().includes(query.toLowerCase()),
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
                ))
            )}
          </div>
        </ItemGroup>
        <DrawerFooter className="flex-row gap-2">
          <DrawerClose asChild>
            <Button variant="outline" ref={closeButtonRef}>
              Cancel
            </Button>
          </DrawerClose>
          <Button onClick={handleSave} className="flex-1">
            Apply
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
