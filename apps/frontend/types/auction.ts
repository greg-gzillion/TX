export interface Auction {
  id: number;
  title: string;
  currentBid: number;
  timeLeft: string;
  bids: number;
  metal: 'gold' | 'silver' | 'platinum' | 'palladium';
  seller: string;
  premium: string;
  image?: string;
}

export interface PriceData {
  gold: number;
  silver: number;
  platinum: number;
  palladium: number;
  lastUpdated: string;
}

export interface MarketStats {
  totalVolume: number;
  activeAuctions: number;
  totalBids: number;
  endingToday: number;
}
