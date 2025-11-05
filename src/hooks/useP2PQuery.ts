import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import { Adv } from '@/components/rates/types';

const p2purl = '/bapi/c2c/v2/friendly/c2c/adv/search';

type P2PQueryParams = {
  fiat: string;
  tradeType: 'BUY' | 'SELL';
  payTypes: string[];
  asset: string;
}

export function useP2PQuery({ fiat, tradeType, payTypes, asset }: P2PQueryParams) {
  const queryKey = [`binance-${fiat.toLowerCase()}`, tradeType, payTypes, asset];
  const rowsPerPage = 10;

  return useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const body = JSON.stringify({
        fiat,
        page: pageParam,
        rows: rowsPerPage,
        tradeType,
        asset,
        countries: [],
        proMerchantAds: false,
        shieldMerchantAds: false,
        filterType: "all",
        periods: [],
        additionalKycVerifyFilter: 0,
        publisherType: null,
        payTypes: [],
        classifies: ["mass", "profession", "fiat_trade"],
        tradedWith: false,
        followed: false,
      });

      const res = await fetch(p2purl, {
        method: 'POST',
        body,
        headers: {
          "content-type": "application/json",
        },
      });
      const json = await res.json();
      return json.data as Adv[];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < rowsPerPage) {
        return undefined;
      }
      return allPages.length + 1;
    },
    select: (data: InfiniteData<Adv[]>) => data.pages.flat(),
  });
}
