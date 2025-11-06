import { create } from 'zustand'
import type { Adv } from '@/components/rates/types'

type AdvertsState = {
  selectedSellAdv: Adv | undefined
  selectedBuyAdv: Adv | undefined
  setSelectedSellAdv: (adv: Adv | undefined) => void
  setSelectedBuyAdv: (adv: Adv | undefined) => void
  reset: () => void
}

export const useAdvertsStore = create<AdvertsState>((set) => ({
  selectedSellAdv: undefined,
  selectedBuyAdv: undefined,
  setSelectedSellAdv: (adv) => set({ selectedSellAdv: adv }),
  setSelectedBuyAdv: (adv) => set({ selectedBuyAdv: adv }),
  reset: () => set({ selectedSellAdv: undefined, selectedBuyAdv: undefined }),
}))
