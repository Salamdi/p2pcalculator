import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { AdvGroup } from '@/components/rates/AdvGroup';
import { ResultsTable } from '@/components/rates/ResultsTable';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

const ASSETS = ['USDT', 'BTC', 'USDC', 'ETH'] as const;

export const Route = createFileRoute('/rates/')({
  component: RateComponent,
  validateSearch: (search: Record<string, unknown>): { asset: string } => {
    return {
      asset: (search.asset as string) || 'USDT',
    }
  },
})

export function RateComponent() {
  const { asset } = useSearch({
    from: Route.id,
  });
  const navigate = useNavigate({ from: '/rates' });

  const handleAssetChange = (newAsset: string) => {
    if (!newAsset) return;
    navigate({ search: (prev) => ({ ...prev, asset: newAsset }) });
  };

  return (
    <div className="pb-8">
      <div className="flex justify-center my-1">
        <ToggleGroup
          type="single"
          value={asset}
          onValueChange={handleAssetChange}
          variant="outline"
        >
          {ASSETS.map((assetItem) => (
            <ToggleGroupItem
              key={assetItem}
              value={assetItem}
              className={cn({
                'font-bold': asset.toUpperCase() === assetItem.toUpperCase(),
              })}
            >
              {assetItem}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
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
