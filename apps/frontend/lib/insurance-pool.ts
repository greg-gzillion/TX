// Insurance Pool Service for PhoenixPME
// Initial balance: 0 RLUSD
// 1.1% fee on each transaction goes to pool

export interface Transaction {
  id: string;
  auctionId: string;
  buyer: string;
  seller: string;
  amount: number;           // Transaction amount in RLUSD
  feeAmount: number;        // 1.1% fee in RLUSD
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;          // Blockchain transaction hash when settled
}

export interface PoolBalance {
  totalFees: number;        // Total fees collected (RLUSD)
  transactionCount: number; // Number of transactions processed
  lastUpdated: Date;
  transactions: Transaction[];
}

class InsurancePoolService {
  private pool: PoolBalance = {
    totalFees: 0,            // Starts at ZERO
    transactionCount: 0,
    lastUpdated: new Date(),
    transactions: []
  };

  private readonly FEE_PERCENTAGE = 1.1; // 1.1% fee

  /**
   * Calculate fee for a transaction
   */
  calculateFee(amount: number): number {
    return (amount * this.FEE_PERCENTAGE) / 100;
  }

  /**
   * Add a transaction to the pool
   */
  async addTransaction(
    auctionId: string,
    buyer: string,
    seller: string,
    amount: number
  ): Promise<{ feeAmount: number; transaction: Transaction }> {
    const feeAmount = this.calculateFee(amount);
    
    const transaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      auctionId,
      buyer,
      seller,
      amount,
      feeAmount,
      timestamp: new Date(),
      status: 'pending'
    };

    // Add to pool (but don't update balance until completed)
    this.pool.transactions.push(transaction);
    this.pool.transactionCount++;
    this.pool.lastUpdated = new Date();

    return { feeAmount, transaction };
  }

  /**
   * Complete a transaction (when settled on blockchain)
   */
  async completeTransaction(transactionId: string, txHash: string): Promise<void> {
    const transaction = this.pool.transactions.find(t => t.id === transactionId);
    
    if (transaction && transaction.status === 'pending') {
      transaction.status = 'completed';
      transaction.txHash = txHash;
      
      // Add fee to pool balance
      this.pool.totalFees += transaction.feeAmount;
      this.pool.lastUpdated = new Date();
    }
  }

  /**
   * Get current pool balance
   */
  getBalance(): PoolBalance {
    return { ...this.pool };
  }

  /**
   * Get total fees collected
   */
  getTotalFees(): number {
    return this.pool.totalFees;
  }

  /**
   * Format RLUSD amount (6 decimals)
   */
  formatRLUSD(amount: number): string {
    return amount.toFixed(6);
  }

  /**
   * Reset pool (for testing)
   */
  resetPool(): void {
    this.pool = {
      totalFees: 0,
      transactionCount: 0,
      lastUpdated: new Date(),
      transactions: []
    };
  }
}

// Export a singleton instance
export const insurancePool = new InsurancePoolService();
