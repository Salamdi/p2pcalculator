import { useNavigate, useSearch } from '@tanstack/react-router'
import { ChevronsUpDown } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from '../ui/item'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Spinner } from '../ui/spinner'
import { Input } from '../ui/input'
import type { ChangeEventHandler, MouseEventHandler } from 'react'
import { useAdvertsStore } from '@/store/adverts'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

interface ICurrency {
  currencyCode: string
  currencySymbol: string
  currencyScale: number
  countryCode: string
  iconUrl: string
}

type FiatSelectProps = {
  variant: 'buy' | 'sell'
}

export function FiatSelect({ variant }: FiatSelectProps) {
  const { buyFor, sellFor } = useSearch({
    from: '/rates/',
  })
  const navigate = useNavigate({ from: '/rates' })
  const [query, setQuery] = useState('')
  const advState = useAdvertsStore()
  const { data: fiats, isPending } = useQuery<Array<ICurrency>>({
    queryKey: ['fiat-list'],
    queryFn: async () => {
      const res = await fetch(
        '/bapi/c2c/v1/friendly/c2c/trade-rule/fiat-list',
        {
          method: 'POST',
          body: '{}',
        },
      )
      const json: any = await res.json()
      return json.data
    },
    select: (data) =>
      data.map((currency) => {
        return {
          ...currency,
          iconUrl: `/currencyIcons/${currency.currencyCode}.png`,
        }
      }),
  })

  const handleQuery: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const { value } = event.target
      setQuery(value)
    },
    [setQuery],
  )

  const current = useMemo(() => {
    const code = variant === 'buy' ? buyFor : sellFor
    return fiats?.find((f) => f.currencyCode === code)
  }, [variant, buyFor, sellFor, fiats])

  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleFiatSelect: MouseEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      closeButtonRef.current?.click()
      const currency = event.currentTarget.dataset['code']
      const field = variant === 'buy' ? 'buyFor' : 'sellFor'
      await navigate({ search: (prev) => ({ ...prev, [field]: currency }) })
      if (variant === 'buy') {
        advState.setSelectedSellAdv(undefined)
      } else {
        advState.setSelectedBuyAdv(undefined)
      }
    },
    [variant, navigate],
  )

  const handleDrawerClose = useCallback(() => {
    setQuery('')
  }, [setQuery])

  return (
    <Drawer onClose={handleDrawerClose}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          {isPending ? (
            <Spinner />
          ) : (
            <>
              <Avatar className="w-5 h-5">
                <AvatarImage src={current?.iconUrl} />
                <AvatarFallback>{current?.currencySymbol}</AvatarFallback>
              </Avatar>
              {current?.currencyCode}
            </>
          )}
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
          <div className="h-[60dvh] overflow-y-auto">
            {fiats === undefined || isPending ? (
              <Spinner />
            ) : (
              fiats
                .filter((f) => f.currencyCode.includes(query.toUpperCase()))
                .map((f) => (
                  <Item
                    key={f.currencyCode}
                    size="sm"
                    onClick={handleFiatSelect}
                    data-code={f.currencyCode}
                  >
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage src={f.iconUrl} />
                        <AvatarFallback>{f.currencySymbol}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="font-bold">
                        {f.currencyCode}
                      </ItemTitle>
                    </ItemContent>
                  </Item>
                ))
            )}
          </div>
        </ItemGroup>
      </DrawerContent>
    </Drawer>
  )
}
