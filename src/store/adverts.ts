import { create } from 'zustand';
import { Adv } from '@/components/rates/types';

type AdvertsState = {
  selectedSellAdv: Adv | undefined;
  selectedBuyAdv: Adv | undefined;
  setSelectedSellAdv: (adv: Adv | undefined) => void;
  setSelectedBuyAdv: (adv: Adv | undefined) => void;
}

export const useAdvertsStore = create<AdvertsState>((set) => ({
  selectedSellAdv: undefined,
  selectedBuyAdv: undefined,
  setSelectedSellAdv: (adv) => set({ selectedSellAdv: adv }),
  setSelectedBuyAdv: (adv) => set({ selectedBuyAdv: adv }),
}));
