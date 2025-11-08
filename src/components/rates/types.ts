export type TradeMethod = {
  identifier: string
  tradeMethodName: string
  tradeMethodShortName: string
  tradeMethodBgColor: string
}

export type Adv = {
  adv: {
    payTimeLimit: number
    price: number
    fiatSymbol: string
    fiatUnit: string
    asset: string
    tradableQuantity: number
    minSingleTransAmount: number
    maxSingleTransAmount: number
    commissionRate: number
    tradeType: string
    tradeMethods: TradeMethod[];
    advNo: string
  }
  advertiser: {
    nickName: string
    monthOrderCount: number
    monthFinishRate: number
    positiveRate: number
  }
}
