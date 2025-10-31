import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import cn from 'classnames';

export const Route = createFileRoute('/rates/')({
  component: RateComponent,
})

const p2purl = '/bapi/c2c/v2/friendly/c2c/adv/search'
const sellBody = '{"fiat":"KZT","page":1,"rows":10,"tradeType":"BUY","asset":"USDT","countries":[],"proMerchantAds":false,"shieldMerchantAds":false,"filterType":"all","periods":[],"additionalKycVerifyFilter":0,"publisherType":null,"payTypes":["KaspiBank"],"classifies":["mass","profession","fiat_trade"],"tradedWith":false,"followed":false}'
const buyBody = '{"fiat":"MAD","page":1,"rows":10,"tradeType":"SELL","asset":"USDT","countries":[],"proMerchantAds":false,"shieldMerchantAds":false,"filterType":"all","periods":[],"additionalKycVerifyFilter":0,"publisherType":null,"payTypes":["AttijariwafaNational"],"classifies":["mass","profession","fiat_trade"],"tradedWith":false,"followed":false}'
const googleFinUrl = '/rates/KZT-MAD'
const tradeAmount = 5000
export function RateComponent() {
  const [selectedSellAdv, setSelectedSellAdv] = useState('');
  const { data: sellData } = useQuery<{
    adv: {
      payTimeLimit: number;
      price: number;
      fiatSymbol: string;
      fiatUnit: string;
      asset: string;
      tradableQuantity: number;
      minSingleTransAmount: number
      maxSingleTransAmount: number
      commissionRate: number;
      tradeType: string;
      advNo: string;
    },
    advertiser: {
      nickName: string;
      monthOrderCount: number;
      monthFinishRate: number;
      positiveRate: number;
    },
  }[]>({
    queryKey: ['binance-kzt'],
    queryFn: () => fetch(p2purl, {
      method: 'POST',
      body: sellBody,
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json())
      .then((json) => json.data),
    initialData: [],
    select: (data) => {
      return data;
    },
  })

  const [selectedBuyAdv, setSelectedBuyAdv] = useState("")
  const { data: buyData } = useQuery<{
    adv: {
      payTimeLimit: number;
      price: number;
      fiatSymbol: string;
      fiatUnit: string;
      asset: string;
      tradableQuantity: number;
      minSingleTransAmount: number
      maxSingleTransAmount: number
      commissionRate: number;
      tradeType: string;
      advNo: string;
    },
    advertiser: {
      nickName: string;
      monthOrderCount: number;
      monthFinishRate: number;
      positiveRate: number;
    },
  }[]>({
    queryKey: ['binance-mad'],
    queryFn: () => fetch(p2purl, {
      method: 'POST',
      body: buyBody,
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => res.json())
      .then((json) => json.data),
    initialData: [],
    select: (data) => {
      return data;
    },
  })

  const { data: googleRate } = useQuery<{ rate: number }>({
    queryKey: ['google-fin'],
    queryFn: () => fetch(googleFinUrl, {
      method: 'GET',
    }).then((res) => res.json()),
    initialData: { rate: -1 },
    select: ({ rate }) => ({ rate: rate }),
  })

  const binRate = useMemo(() => {
    if (!selectedBuyAdv || !selectedSellAdv) {
      return Infinity
    }

    const buyAdv = buyData.find((item) => item.adv.advNo === selectedBuyAdv)
    const sellAdv = sellData.find((item) => item.adv.advNo === selectedSellAdv)
    const buyPrice = buyAdv?.adv.price
    const sellPrice = sellAdv?.adv.price

    if (!buyPrice || !sellPrice) {
      return Infinity
    }

    return buyPrice / sellPrice;
  }, [selectedBuyAdv, selectedSellAdv, buyData, sellData])

  const absDiff = useMemo(() => {
    return binRate - googleRate.rate
  }, [binRate, googleRate])

  const relDiff = useMemo(() => {
    return (absDiff / binRate)
  }, [binRate, absDiff])

  const gain = useMemo(() => {
    return relDiff * tradeAmount
  }, [relDiff])

  return <div>
    <div className="text-sm lg:flex xl:w-2/3 mx-auto">
      <ul className="h-[38dvh] mb-4 overflow-y-scroll lg:flex-1 border-2 border-blue-500 m-4 rounded-lg">
        <p className="text-center sticky top-0 bg-blue-200 p-1"><strong>Buy</strong></p>
        {sellData.map((advItem) => (
          <li
            key={advItem.adv.advNo}
            className={
              cn(
                'flex justify-between py-1 px-4 items-center cursor-pointer',
                {
                  'bg-blue-300': selectedSellAdv === advItem.adv.advNo,
                  'hover:bg-blue-100': selectedSellAdv !== advItem.adv.advNo,
                },
              )
            }
            onClick={() => setSelectedSellAdv(advItem.adv.advNo)}
          >
            <span>{advItem.adv.price} {advItem.adv.fiatSymbol}</span>
            <button
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              onClick={() => setSelectedSellAdv(advItem.adv.advNo)}
            >Select</button>
          </li>
        ))}
      </ul>
      <ul className="h-[38dvh] overflow-y-scroll lg:flex-1 border-2 border-green-500 m-4 rounded-lg">
        <p className="text-center sticky top-0 bg-green-200 p-1"><strong>Sell</strong></p>
        {buyData.map((advItem) => (
          <li
            key={advItem.adv.advNo}
            className={
              cn(
                'flex justify-between py-1 px-4 items-center cursor-pointer',
                {
                  'bg-green-300': selectedBuyAdv === advItem.adv.advNo,
                  'hover:bg-green-100': selectedBuyAdv !== advItem.adv.advNo,
                },
              )
            }
            onClick={() => setSelectedBuyAdv(advItem.adv.advNo)}
          >
            <span>{advItem.adv.price} {advItem.adv.fiatSymbol}</span>
            <button
              className="bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
              onClick={() => setSelectedBuyAdv(advItem.adv.advNo)}
            >Select</button>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex justify-center mt-2">
      <table className="table-auto text-sm">
        <thead>
          <tr>
            <th className="border p-1">
              <pre>Bin MAD/KZT</pre>
            </th>
            <th className="border p-1">
              <pre>
                Goo MAD/KZT
              </pre>
            </th>
            <th className="border p-1">
              <pre>Abs diff</pre>
            </th>
            <th className="border p-1">
              <pre>Rel diff</pre>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-1">
              <pre>
                {binRate === Infinity ? 'N/A' : binRate.toFixed(4)}
              </pre>
            </td>
            <td className="border p-1">
              {googleRate.rate === -1 ? 'N/A' : googleRate.rate.toFixed(4)}
            </td>
            <td className="border p-1">
              {absDiff === Infinity ? 'N/A' : absDiff.toFixed(3)}
            </td>
            <td
              className={cn("border p-1", {
                'bg-red-300': !isNaN(relDiff) && relDiff !== Infinity && relDiff < 0,
                'bg-green-300': !isNaN(relDiff) && relDiff !== Infinity && relDiff > 0,
              })}>
              {googleRate.rate === -1 || isNaN(relDiff) ? 'N/A' : `${(relDiff * 100).toFixed(3)}%`}
            </td>
          </tr>
          <tr>
            <td
              colSpan={4}
              className={cn("border p-1", {
                'bg-red-300': !isNaN(relDiff) && relDiff !== Infinity && relDiff < 0,
                'bg-green-300': !isNaN(relDiff) && relDiff !== Infinity && relDiff > 0,
              })}
            >
              {googleRate.rate === -1 || isNaN(gain) ? 'N/A' : gain.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
}
