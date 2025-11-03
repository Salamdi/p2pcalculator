import { createFileRoute } from '@tanstack/react-router'
import { AdvGroup } from '@/components/rates/AdvGroup';
import { ResultsTable } from '@/components/rates/ResultsTable';

export const Route = createFileRoute('/rates/')({
  component: RateComponent,
})

export function RateComponent() {
  return (
    <div>
      <div className="text-sm lg:flex xl:w-2/f mx-auto">
        <AdvGroup
          title="Buy"
          variant="buy"
          fiat="KZT"
          tradeType="BUY"
          payTypes={['KaspiBank']}
        />
        <AdvGroup
          title="Sell"
          variant="sell"
          fiat="MAD"
          tradeType="SELL"
          payTypes={['AttijariwafaNational']}
        />
      </div>
      <ResultsTable />
    </div>
  );
}
