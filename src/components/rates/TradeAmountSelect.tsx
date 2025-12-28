import { useNavigate, useSearch } from '@tanstack/react-router'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { HoldButton } from '../ui/hold-button'
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

export function TradeAmountSelect() {
  const { tradeAmount } = useSearch({
    from: '/rates/',
  })
  const navigate = useNavigate({ from: '/rates' })
  const [localTradeAmount, setLocalTradeAmount] = useState(
    tradeAmount.toString(10),
  )

  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleSave = useCallback(async () => {
    await navigate({
      search: (prev) => ({
        ...prev,
        tradeAmount: parseFloat(localTradeAmount),
      }),
    })
    closeButtonRef.current?.click()
  }, [navigate, localTradeAmount])

  const handleDrawerOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        return
      }
      setLocalTradeAmount(tradeAmount.toString(10))
    },
    [tradeAmount, setLocalTradeAmount],
  )

  return (
    <Drawer onOpenChange={handleDrawerOpenChange}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="underline px-0">
          <p className="max-w-24">{tradeAmount}</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            <div className="flex flex-col gap-4 pb-4">
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Trade amount"
                value={localTradeAmount}
                enterKeyHint="enter"
                onChange={(e) => setLocalTradeAmount(e.target.value)}
                onFocus={(e) => e.target.select()}
                min={0}
              />
              <div className="flex gap-4">
                <HoldButton
                  className="flex-1 select-none"
                  variant="outline"
                  onHold={() =>
                    setLocalTradeAmount((prev) =>
                      (parseFloat(prev) - 10).toString(10),
                    )
                  }
                >
                  <MinusIcon />
                </HoldButton>
                <HoldButton
                  className="flex-1 select-none"
                  onHold={() =>
                    setLocalTradeAmount((prev) => {
                      if (!prev || isNaN(parseFloat(prev))) {
                        return '10'
                      }
                      return (parseFloat(prev) + 10).toString(10)
                    })
                  }
                >
                  <PlusIcon />
                </HoldButton>
              </div>
            </div>
          </DrawerTitle>
        </DrawerHeader>
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
