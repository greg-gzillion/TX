// lib/contracts/auction-client.ts

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

export interface Bid {
  bidder: string;
  amount: string;
  timestamp: number;
}

// Real contract client (for production)
class RealAuctionClient {
  private contractAddress: string = "";
  private rpcEndpoint: string = "https://full-node.testnet-1.coreum.dev:26657";
  
  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
  }

  async createAuction(
    itemDescription: string, 
    startingPrice: string, 
    durationDays: number
  ): Promise<number> {
    console.log("📡 Creating auction on blockchain...");
    
    // TODO: Replace with actual contract call
    // This will be implemented when you have the contract deployed
    
    // For now, return mock ID
    return Math.floor(Math.random() * 1000) + 1;
  }

  async placeBid(auctionId: number, bidAmount: string): Promise<boolean> {
    console.log(`📡 Placing bid of ${bidAmount} on auction ${auctionId}...`);
    
    // TODO: Replace with actual contract call
    
    return true;
  }

  async endAuction(auctionId: number): Promise<{winner: string, amount: string}> {
    console.log(`📡 Ending auction ${auctionId}...`);
    
    // TODO: Replace with actual contract call
    
    return {
      winner: "testcore1...winner",
      amount: "0"
    };
  }

  async releaseToSeller(auctionId: number): Promise<boolean> {
    console.log(`📡 Releasing funds for auction ${auctionId}...`);
    
    // TODO: Replace with actual contract call
    
    return true;
  }

  async getAuction(id: number): Promise<Auction | null> {
    console.log(`📡 Fetching auction ${id} from blockchain...`);
    
    // TODO: Replace with actual query
    
    return null;
  }

  async listAuctions(): Promise<Auction[]> {
    console.log("📡 Fetching auctions from blockchain...");
    
    // TODO: Replace with actual query
    
    return [];
  }

  async getUserAuctions(userAddress: string): Promise<Auction[]> {
    console.log(`📡 Fetching auctions for user ${userAddress}...`);
    
    // TODO: Replace with actual query
    
    return [];
  }
}

// Mock client (for development)
export class MockAuctionClient {
  async createAuction(
    itemDescription: string, 
    startingPrice: string, 
    durationDays: number
  ): Promise<number> {
    console.log("🔄 [MOCK] Creating auction:", { itemDescription, startingPrice, durationDays });
    
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

  async placeBid(auctionId: number, bidAmount: string): Promise<boolean> {
    console.log(`🔄 [MOCK] Placing bid ${bidAmount} on auction ${auctionId}`);
    
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

  async endAuction(auctionId: number): Promise<{winner: string, amount: string}> {
    const auctions = this.getAuctions();
    const auctionIndex = auctions.findIndex(a => a.id === auctionId);
    
    if (auctionIndex === -1) throw new Error("Auction not found");
    if (auctions[auctionIndex].seller !== "testcore1mj58cdfrkc8uyunw2rna3wvkatdjfhd6f6spqd") {
      throw new Error("Only seller can end auction");
    }
    
    let winner = "No bids placed";
    let winningAmount = "0";
    
    if (auctions[auctionIndex].current_bid) {
      winner = auctions[auctionIndex].current_bid!.bidder;
      winningAmount = auctions[auctionIndex].current_bid!.amount;
    }
    
    auctions[auctionIndex].status = "Ended";
    auctions[auctionIndex].winner = winner;
    auctions[auctionIndex].winning_amount = winningAmount;
    
    this.saveAuctions(auctions);
    
    return { winner, amount: winningAmount };
  }

  async releaseToSeller(auctionId: number): Promise<boolean> {
    const auctions = this.getAuctions();
    const auctionIndex = auctions.findIndex(a => a.id === auctionId);
    
    if (auctionIndex === -1) throw new Error("Auction not found");
    if (auctions[auctionIndex].status !== "Ended") {
      throw new Error("Auction must be ended first");
    }
    
    if (auctions[auctionIndex].winner && auctions[auctionIndex].winner !== "No bids placed") {
      console.log(`💰 [MOCK] Transferring ${auctions[auctionIndex].winning_amount} TEST from ${auctions[auctionIndex].winner} to ${auctions[auctionIndex].seller}`);
    } else {
      console.log("ℹ️ [MOCK] No bids placed, no funds to transfer");
    }
    
    auctions[auctionIndex].status = "Completed";
    this.saveAuctions(auctions);
    
    return true;
  }

  async getAuction(id: number): Promise<Auction | null> {
    const auctions = this.getAuctions();
    return auctions.find(a => a.id === id) || null;
  }

  async listAuctions(): Promise<Auction[]> {
    return this.getAuctions();
  }

  async getUserAuctions(userAddress: string): Promise<Auction[]> {
    const auctions = this.getAuctions();
    return auctions.filter(a => 
      a.seller === userAddress || 
      a.current_bid?.bidder === userAddress
    );
  }

  private getAuctions(): Auction[] {
    return JSON.parse(localStorage.getItem("phoenix_auctions") || "[]");
  }

  private saveAuctions(auctions: Auction[]): void {
    localStorage.setItem("phoenix_auctions", JSON.stringify(auctions));
  }
}

// Factory to create the right client based on environment
export function createAuctionClient(useMock: boolean = true, contractAddress?: string) {
  if (useMock) {
    console.log("🔄 Using MOCK auction client");
    return new MockAuctionClient();
  } else {
    if (!contractAddress) {
      throw new Error("Contract address required for real client");
    }
    console.log("📡 Using REAL auction client");
    return new RealAuctionClient(contractAddress);
  }
}

// Default export for easy imports
export const auctionClient = createAuctionClient(true); // Start with mock