// SIMPLE FEE COLLECTOR FOR AUCTION PLATFORM
// Just accumulates 1.1% fees for future insurance module

export interface FeeRecord {
  id: string;
  auctionId: string;
  amount: number;        // Transaction amount
  feeAmount: number;      // 1.1% fee
  timestamp: Date;
  fromWallet: string;
}

class FeeCollector {
  private totalFees: number = 0;
  private fees: FeeRecord[] = [];
  private readonly FEE_PERCENTAGE = 1.1;

  /**
   * Record a fee from an auction
   */
  recordFee(auctionId: string, amount: number, fromWallet: string): FeeRecord {
    const feeAmount = (amount * this.FEE_PERCENTAGE) / 100;
    
    const record: FeeRecord = {
      id: `fee_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      auctionId,
      amount,
      feeAmount,
      timestamp: new Date(),
      fromWallet
    };

    this.fees.push(record);
    this.totalFees += feeAmount;
    
    console.log(`💰 Fee collected: ${feeAmount.toFixed(6)} RLUSD for auction ${auctionId}`);
    
    return record;
  }

  /**
   * Get total accumulated fees (for future insurance module)
   */
  getTotalAccumulated(): number {
    return this.totalFees;
  }

  /**
   * Get all fee records (for auditing)
   */
  getAllFees(): FeeRecord[] {
    return [...this.fees];
  }

  /**
   * Format RLUSD amount
   */
  formatRLUSD(amount: number): string {
    return amount.toFixed(6);
  }
}

// Export singleton
export const feeCollector = new FeeCollector();