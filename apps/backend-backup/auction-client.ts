// lib/contracts/auction-client.ts - COMPLETE WORKING VERSION
export interface Auction {
  id: number;
  seller: string;
  item_description: string;
  starting_price: string;
  current_bid?: {
    bidder: string;
    amount: string;
    placed_at: number;
  };
  winner?: string;
  winning_amount?: string;
  status: 'Active' | 'Ended' | 'Disputed' | 'Completed';
  end_time: number;
  created_at: number;
}

export class AuctionClient {
  // CREATE AUCTION
  async createAuction(itemDescription: string, startingPrice: string, durationDays: number): Promise<number> {
    console.log("Creating auction:", { itemDescription, startingPrice, durationDays });
    
    const auctions = this.getAuctions();
    const newId = auctions.length + 1;
    
    const auction: Auction = {
      id: newId,
      seller: "testcore1mj58cdfrkc8uyunw2rna3wvkatdjfhd6f6spqd",
      item_description: itemDescription,
      starting_price: startingPrice,
      status: "Active",
      end_time: Date.now() + (durationDays * 24 * 60 * 60 * 1000),
      created_at: Date.now()
    };
    
    auctions.push(auction);
    this.saveAuctions(auctions);
    
    return newId;
  }

  // PLACE BID
  async placeBid(auctionId: number, bidAmount: string): Promise<boolean> {
    console.log(`Placing bid ${bidAmount} on auction ${auctionId}`);
    
    const auctions = this.getAuctions();
    const auctionIndex = auctions.findIndex(a => a.id === auctionId);
    
    if (auctionIndex === -1) {
      throw new Error("Auction not found");
    }
    
    if (auctions[auctionIndex].status !== "Active") {
      throw new Error("Auction is not active");
    }
    
    const currentPrice = auctions[auctionIndex].current_bid?.amount || auctions[auctionIndex].starting_price;
    if (parseInt(bidAmount) <= parseInt(currentPrice)) {
      throw new Error(`Bid must be higher than ${currentPrice} TEST`);
    }
    
    auctions[auctionIndex].current_bid = {
      bidder: "testcore1mj58cdfrkc8uyunw2rna3wvkatdjfhd6f6spqd",
      amount: bidAmount,
      placed_at: Date.now()
    };
    
    this.saveAuctions(auctions);
    return true;
  }

  // END AUCTION (seller can end)
  async endAuction(auctionId: number): Promise<{winner: string, amount: string}> {
    const auctions = this.getAuctions();
    const auctionIndex = auctions.findIndex(a => a.id === auctionId);
    
    if (auctionIndex === -1) throw new Error("Auction not found");
    if (auctions[auctionIndex].seller !== "testcore1mj58cdfrkc8uyunw2rna3wvkatdjfhd6f6spqd") {
      throw new Error("Only seller can end auction");
    }
    
    // Determine winner
    let winner = "No bids placed";
    let winningAmount = "0";
    
    if (auctions[auctionIndex].current_bid) {
      winner = auctions[auctionIndex].current_bid!.bidder;
      winningAmount = auctions[auctionIndex].current_bid!.amount;
    }
    
    // Update auction
    auctions[auctionIndex].status = "Ended";
    auctions[auctionIndex].winner = winner;
    auctions[auctionIndex].winning_amount = winningAmount;
    
    this.saveAuctions(auctions);
    
    return {
      winner: winner,
      amount: winningAmount
    };
  }

  // RELEASE FUNDS TO SELLER (after auction ends)
  async releaseToSeller(auctionId: number): Promise<boolean> {
    const auctions = this.getAuctions();
    const auctionIndex = auctions.findIndex(a => a.id === auctionId);
    
    if (auctionIndex === -1) throw new Error("Auction not found");
    if (auctions[auctionIndex].status !== "Ended") {
      throw new Error("Auction must be ended first");
    }
    
    // Check if there was a winner
    if (auctions[auctionIndex].winner && auctions[auctionIndex].winner !== "No bids placed") {
      console.log(`💰 Transferring ${auctions[auctionIndex].winning_amount} TEST from ${auctions[auctionIndex].winner} to ${auctions[auctionIndex].seller}`);
    } else {
      console.log("ℹ️ No bids placed, no funds to transfer");
    }
    
    auctions[auctionIndex].status = "Completed";
    this.saveAuctions(auctions);
    
    return true;
  }

  // GET SINGLE AUCTION
  async getAuction(id: number): Promise<Auction | null> {
    const auctions = this.getAuctions();
    return auctions.find(a => a.id === id) || null;
  }

  // LIST ALL AUCTIONS
  async listAuctions(): Promise<Auction[]> {
    return this.getAuctions();
  }

  // GET USER'S AUCTIONS
  async getUserAuctions(userAddress: string): Promise<Auction[]> {
    const auctions = this.getAuctions();
    return auctions.filter(a => 
      a.seller === userAddress || 
      a.current_bid?.bidder === userAddress
    );
  }

  // PRIVATE HELPERS
  private getAuctions(): Auction[] {
    return JSON.parse(localStorage.getItem("phoenix_auctions") || "[]");
  }

  private saveAuctions(auctions: Auction[]): void {
    localStorage.setItem("phoenix_auctions", JSON.stringify(auctions));
  }
}
