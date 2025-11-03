export type Adv = {
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
}
