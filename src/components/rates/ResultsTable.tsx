import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import cn from 'classnames'
import { useSearch } from '@tanstack/react-router'
import { TradeAmountSelect } from './TradeAmountSelect'
import { useAdvertsStore } from '@/store/adverts'

export function ResultsTable() {
  const { selectedSellAdv, selectedBuyAdv } = useAdvertsStore()
  const { buyFor, sellFor, tradeAmount } = useSearch({ from: '/rates/' })

  const googleFinUrl = `/rates/${buyFor}-${sellFor}`

  const { data: googleRate } = useQuery<{ rate: number }>({
    queryKey: ['google-fin', buyFor, sellFor],
    queryFn: () =>
      buyFor === sellFor
        ? { rate: 1 }
        : fetch(googleFinUrl, {
          method: 'GET',
        }).then((res) => res.json()),
    initialData: { rate: -1 },
    select: ({ rate }) => ({ rate: rate }),
  })

  const binRate = useMemo(() => {
    if (!selectedBuyAdv || !selectedSellAdv) {
      return Infinity
    }
    const buyPrice = selectedBuyAdv.adv.price
    const sellPrice = selectedSellAdv.adv.price
    if (!buyPrice || !sellPrice) {
      return Infinity
    }
    return buyPrice / sellPrice
  }, [selectedBuyAdv, selectedSellAdv])

  const absDiff = useMemo(() => {
    return binRate - googleRate.rate
  }, [binRate, googleRate])

  const relDiff = useMemo(() => {
    return absDiff / binRate
  }, [binRate, absDiff])

  const gain = useMemo(() => {
    return relDiff * tradeAmount
  }, [relDiff, tradeAmount])

  return (
    <div className="flex justify-center mt-2 mb-8">
      <table className="table-auto text-sm">
        <thead>
          <tr>
            <th className="border p-1">
              Bin {sellFor}/{buyFor}
            </th>
            <th className="border p-1">
              Goo {sellFor}/{buyFor}
            </th>
            <th className="border p-1">
              Abs diff
            </th>
            <th className="border p-1">
              Rel diff
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-1">
              {binRate === Infinity || binRate === undefined
                ? 'N/A'
                : binRate.toFixed(4)}
            </td>
            <td className="border p-1">
              {googleRate.rate === -1 || googleRate?.rate === undefined
                ? 'N/A'
                : googleRate.rate.toFixed(4)}
            </td>
            <td className="border p-1">
              {absDiff === Infinity || absDiff === undefined
                ? 'N/A'
                : absDiff.toFixed(3)}
            </td>
            <td
              className={cn('border p-1', {
                'bg-red-300':
                  !isNaN(relDiff) && relDiff !== Infinity && relDiff < 0,
                'bg-green-300':
                  !isNaN(relDiff) && relDiff !== Infinity && relDiff > 0,
              })}
            >
              {googleRate.rate === -1 || isNaN(relDiff)
                ? 'N/A'
                : `${(relDiff * 100).toFixed(3)}%`}
            </td>
          </tr>
          <tr>
            <td
              colSpan={4}
              className={cn('border p-1', {
                'bg-red-300':
                  !isNaN(relDiff) && relDiff !== Infinity && relDiff < 0,
                'bg-green-300':
                  !isNaN(relDiff) && relDiff !== Infinity && relDiff > 0,
              })}
            >
              {googleRate.rate === -1 || isNaN(gain) || gain === undefined ? (
                'N/A'
              ) : (
                <>
                  <strong>
                    {gain < 0 ? 'Loss' : 'Gain'} from <TradeAmountSelect />
                    :{' '}
                  </strong>
                  {gain.toFixed(2)}
                </>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
