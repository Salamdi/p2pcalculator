import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { AdvGroup } from '@/components/rates/AdvGroup';
import { ResultsTable } from '@/components/rates/ResultsTable';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAdvertsStore } from '@/store/adverts';
import { useCallback } from 'react';

const ASSETS = ['USDT', 'BTC', 'USDC', 'ETH'] as const;

export const Route = createFileRoute('/rates/')({
  component: RateComponent,
  search: {
    middlewares: [
      ({ search: {
        asset,
        buyFor,
        sellFor,
        buyPayment,
        sellPayment,
      }, next }) => next({
        asset: asset.toUpperCase(),
        buyFor: buyFor.toUpperCase(),
        sellFor: sellFor.toUpperCase(),
        buyPayment: buyPayment.map((bp) => bp.toUpperCase()),
        sellPayment: sellPayment.map((sp) => sp.toUpperCase()),
      }),
    ]
  },
  validateSearch: (search: Record<string, unknown>): {
    asset: string;
    buyFor: string;
    sellFor: string;
    buyPayment: string[];
    sellPayment: string[];
  } => {
    return {
      asset: (search.asset as string) || 'USDT',
      buyFor: (search.buyFor as string) || 'KZT',
      sellFor: (search.sellFor as string) || 'MAD',
      buyPayment: (search.buyPayment as string[]) || [],
      sellPayment: (search.sellPayment as string[]) || [],
    }
  },
})

export function RateComponent() {
  const { asset } = useSearch({
    from: Route.id,
  });
  const navigate = useNavigate({ from: '/rates' });
  const resetAdverts = useAdvertsStore((state) => state.reset);

  const handleAssetChange = useCallback(async (newAsset: string) => {
    if (!newAsset) return;
    await navigate({ search: (prev) => ({ ...prev, asset: newAsset }) });
    resetAdverts();
  }, [navigate, resetAdverts]);

  return (
    <div>
      <div className="flex justify-center my-1">
        <ToggleGroup type="single" value={asset} onValueChange={handleAssetChange}>
          {ASSETS.map((assetItem) => (
            <ToggleGroupItem key={assetItem} value={assetItem}>
              {assetItem}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="text-sm lg:flex xl:w-2/f mx-auto">
        <AdvGroup
          title="Buy"
          variant="buy"
          tradeType="BUY"
        />
        <AdvGroup
          title="Sell"
          variant="sell"
          tradeType="SELL"
        />
      </div>
      <ResultsTable />
    </div>
  );
}
