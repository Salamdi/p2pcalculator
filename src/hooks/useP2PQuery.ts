import { useInfiniteQuery } from '@tanstack/react-query';
import { Adv } from '@/components/rates/types';

const p2purl = '/bapi/c2c/v2/friendly/c2c/adv/search';

type P2PQueryParams = {
  fiat: string;
  tradeType: 'BUY' | 'SELL';
  payTypes: string[];
}

export function useP2PQuery({ fiat, tradeType, payTypes }: P2PQueryParams) {
  const queryKey = [`binance-${fiat.toLowerCase()}`, tradeType, payTypes];
  const rowsPerPage = 10;

  return useInfiniteQuery<Adv[], Error, Adv[], (string | string[])[]>({
    queryKey,
    queryFn: ({ pageParam = 1 }) => {
      const body = JSON.stringify({
        fiat,
        page: pageParam,
        rows: rowsPerPage,
        tradeType,
        asset: "USDT",
        countries: [],
        proMerchantAds: false,
        shieldMerchantAds: false,
        filterType: "all",
        periods: [],
        additionalKycVerifyFilter: 0,
        publisherType: null,
        payTypes,
        classifies: ["mass", "profession", "fiat_trade"],
        tradedWith: false,
        followed: false,
      });

      return fetch(p2purl, {
        method: 'POST',
        body,
        headers: {
          "content-type": "application/json",
        },
      }).then((res) => res.json())
        .then((json) => json.data)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < rowsPerPage) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });
}