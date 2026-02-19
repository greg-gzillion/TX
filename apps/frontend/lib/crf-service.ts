// lib/crf-service.ts
// Community Reserve Fund service

interface Transaction {
  id: string;
  auctionId: string;
  feeAmount: number;
  status: 'pending' | 'completed';
  timestamp: Date;
}

interface BalanceData {
  totalFees: number;
  transactionCount: number;
  lastUpdated: Date;
  transactions: Transaction[];
}

class CRFService {
  private totalFees: number = 12500000; // 12.5 RLUSD (example)
  private transactionCount: number = 28;
  private lastUpdated: Date = new Date();
  private transactions: Transaction[] = [
    {
      id: '1',
      auctionId: 'Auction #1',
      feeAmount: 5500000, // 5.5 RLUSD
      status: 'completed',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      id: '2',
      auctionId: 'Auction #2',
      feeAmount: 3200000, // 3.2 RLUSD
      status: 'completed',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      id: '3',
      auctionId: 'Auction #3',
      feeAmount: 3800000, // 3.8 RLUSD
      status: 'pending',
      timestamp: new Date()
    }
  ];

  getBalance(): BalanceData {
    return {
      totalFees: this.totalFees,
      transactionCount: this.transactionCount,
      lastUpdated: this.lastUpdated,
      transactions: this.transactions
    };
  }

  addFee(amount: number, auctionId: string) {
    this.totalFees += amount;
    this.transactionCount++;
    this.lastUpdated = new Date();
    this.transactions.push({
      id: `tx-${Date.now()}`,
      auctionId,
      feeAmount: amount,
      status: 'pending',
      timestamp: new Date()
    });
  }

  formatRLUSD(amount: number): string {
    return (amount / 1000000).toFixed(2); // Convert from micro units
  }
}

export const crfService = new CRFService();
