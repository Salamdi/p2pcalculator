import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import cn from 'classnames';
import { AdvItem } from '@/components/rates/AdvItem';
import { AdvGroup } from '@/components/rates/AdvGroup';
import { useP2PQuery } from '@/hooks/useP2PQuery';

export const Route = createFileRoute('/rates/')({
  component: RateComponent,
})

const googleFinUrl = '/rates/KZT-MAD'
const tradeAmount = 5000
export function RateComponent() {
  const [selectedSellAdv, setSelectedSellAdv] = useState('');
  const {
    data: sellData,
    fetchNextPage: fetchNextSellPage,
    hasNextPage: hasNextSellPage,
    isFetchingNextPage: isFetchingNextSellPage,
  } = useP2PQuery({ fiat: 'KZT', tradeType: 'BUY', payTypes: ['KaspiBank'] });

  const [selectedBuyAdv, setSelectedBuyAdv] = useState("")
  const { 
    data: buyData,
    fetchNextPage: fetchNextBuyPage,
    hasNextPage: hasNextBuyPage,
    isFetchingNextPage: isFetchingNextBuyPage,
  } = useP2PQuery({ fiat: 'MAD', tradeType: 'SELL', payTypes: ['AttijariwafaNational'] });

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

    const buyAdv = buyData?.pages.flat().find((item) => item.adv.advNo === selectedBuyAdv)
    const sellAdv = sellData?.pages.flat().find((item) => item.adv.advNo === selectedSellAdv)
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
      <AdvGroup
        title="Buy"
        variant="buy"
        hasNextPage={hasNextSellPage}
        onLoadMore={() => fetchNextSellPage()}
        isFetchingNextPage={isFetchingNextSellPage}
      >
        {sellData?.pages.map((page) =>
          page.map((advItem) => (
            <AdvItem
              key={advItem.adv.advNo}
              item={advItem}
              isSelected={selectedSellAdv === advItem.adv.advNo}
              onSelect={setSelectedSellAdv}
              variant="buy"
            />
          ))
        )}
      </AdvGroup>
      <AdvGroup
        title="Sell"
        variant="sell"
        hasNextPage={hasNextBuyPage}
        onLoadMore={() => fetchNextBuyPage()}
        isFetchingNextPage={isFetchingNextBuyPage}
      >
        {buyData?.pages.map((page) =>
          page.map((advItem) => (
            <AdvItem
              key={advItem.adv.advNo}
              item={advItem}
              isSelected={selectedBuyAdv === advItem.adv.advNo}
              onSelect={setSelectedBuyAdv}
              variant="sell"
            />
          ))
        )}
      </AdvGroup>
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
