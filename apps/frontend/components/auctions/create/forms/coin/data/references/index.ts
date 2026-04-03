export interface CoinReference {
  pcgsUrl?: string;
  ngcUrl?: string;
  redbook?: string;
  notes?: string;
}

export const coinReferences: Record<string, CoinReference> = {
  "Morgan Silver Dollar": {
    pcgsUrl: "https://www.pcgs.com/coinfacts/category/morgan-dollars",
    ngcUrl:
      "https://www.ngccoin.com/coin-explorer/united-states/morgan-dollars",
    redbook: "https://www.redbook.com/coins/morgan-dollars",
    notes: "Mintage varies by year and mint. 1893-S is key date.",
  },
  "Peace Dollar": {
    pcgsUrl: "https://www.pcgs.com/coinfacts/category/peace-dollars",
    ngcUrl: "https://www.ngccoin.com/coin-explorer/united-states/peace-dollars",
    notes: "1928 is key date with only 360,649 minted.",
  },
  "Saint-Gaudens Gold $20": {
    pcgsUrl:
      "https://www.pcgs.com/coinfacts/category/saint-gaudens-double-eagles",
    ngcUrl:
      "https://www.ngccoin.com/coin-explorer/united-states/saint-gaudens-double-eagles",
    notes: "1933 is extremely rare. Most melted.",
  },
  "Mercury Dime": {
    pcgsUrl: "https://www.pcgs.com/coinfacts/category/mercury-dimes",
    ngcUrl: "https://www.ngccoin.com/coin-explorer/united-states/mercury-dimes",
    notes: "1916-D is key date with only 264,000 minted.",
  },
  "Lincoln Wheat Cent": {
    pcgsUrl:
      "https://www.pcgs.com/coinfacts/category/lincoln-cents-wheat-reverse",
    ngcUrl:
      "https://www.ngccoin.com/coin-explorer/united-states/lincoln-cents-wheat-reverse",
    notes: "1909-S VDB is key date with only 484,000 minted.",
  },
  "Buffalo Nickel": {
    pcgsUrl: "https://www.pcgs.com/coinfacts/category/buffalo-nickels",
    ngcUrl:
      "https://www.ngccoin.com/coin-explorer/united-states/buffalo-nickels",
    notes: "1913-S Type 2 is key date.",
  },
  "Standing Liberty Quarter": {
    pcgsUrl:
      "https://www.pcgs.com/coinfacts/category/standing-liberty-quarters",
    ngcUrl:
      "https://www.ngccoin.com/coin-explorer/united-states/standing-liberty-quarters",
    notes: "1916 is key date with only 52,000 minted.",
  },
  "Walking Liberty Half Dollar": {
    pcgsUrl:
      "https://www.pcgs.com/coinfacts/category/walking-liberty-half-dollars",
    ngcUrl:
      "https://www.ngccoin.com/coin-explorer/united-states/walking-liberty-half-dollars",
    notes: "1921 and 1921-D are key dates.",
  },
};
