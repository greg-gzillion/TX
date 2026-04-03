// lib/contract/phoenix-escrow.ts
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/amino";

// Types from your contract
export interface Auction {
  id: number;
  item_id: string;
  description: string;
  seller: string;
  starting_price: string;
  reserve_price: string;
  current_bid: string | null;
  current_bidder: string | null;
  end_time: number;
  status: "Active" | "Sold" | "ReserveNotMet" | "Expired";
  created_at: number;
  seller_collateral: string;
  buyer_collateral: string | null;
}

export interface AuctionListResponse {
  auctions: Auction[];
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
const TESTUSD_DENOM =
  "utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6"; // TESTUSD denom

export class PhoenixEscrowClient {
  constructor(
    private client: SigningCosmWasmClient,
    private senderAddress: string,
  ) {}

  // ==================== EXECUTE METHODS ====================

  /**
   * Create a new auction with 10% seller collateral
   * @param itemId Unique identifier for the item
   * @param description Item description
   * @param startingPrice Starting bid in uTESTUSD (1 TESTUSD = 1,000,000 uTESTUSD)
   * @param reservePrice Minimum acceptable price in uTESTUSD
   * @param durationHours Auction duration in hours
   */
  async createAuction(
    itemId: string,
    description: string,
    startingPrice: string, // in uTESTUSD
    reservePrice: string, // in uTESTUSD
    durationHours: number,
  ) {
    // Calculate 10% seller collateral (based on reserve price)
    const collateral = ((BigInt(reservePrice) * 10n) / 100n).toString();

    const msg = {
      create_auction: {
        item_id: itemId,
        description,
        starting_price: startingPrice,
        reserve_price: reservePrice,
        duration_hours: durationHours,
      },
    };

    const funds: Coin[] = [{ denom: TESTUSD_DENOM, amount: collateral }];

    console.log("Creating auction with:", {
      msg,
      funds,
      sender: this.senderAddress,
    });

    return await this.client.execute(
      this.senderAddress,
      CONTRACT_ADDRESS,
      msg,
      "auto",
      undefined,
      funds,
    );
  }

  /**
   * Place a bid on an auction with 10% buyer collateral
   * @param auctionId ID of the auction
   * @param bidAmount Bid amount in uTESTUSD
   */
  async placeBid(auctionId: number, bidAmount: string) {
    // Calculate 10% buyer collateral
    const bid = BigInt(bidAmount);
    const collateral = ((bid * 10n) / 100n).toString();
    const total = (bid + (bid * 10n) / 100n).toString();

    console.log("Placing bid:", {
      auctionId,
      bidAmount,
      collateral,
      total,
    });

    const msg = {
      place_bid: {
        auction_id: auctionId,
      },
    };

    const funds: Coin[] = [{ denom: TESTUSD_DENOM, amount: total }];

    return await this.client.execute(
      this.senderAddress,
      CONTRACT_ADDRESS,
      msg,
      "auto",
      undefined,
      funds,
    );
  }

  /**
   * Finalize an auction (seller claims payment, buyer claims item)
   * @param auctionId ID of the auction to finalize
   */
  async finalizeAuction(auctionId: number) {
    const msg = {
      finalize_auction: {
        auction_id: auctionId,
      },
    };

    return await this.client.execute(
      this.senderAddress,
      CONTRACT_ADDRESS,
      msg,
      "auto",
    );
  }

  // ==================== QUERY METHODS ====================

  /**
   * Get details of a specific auction
   */
  async getAuction(auctionId: number): Promise<Auction> {
    const query = {
      get_auction: { auction_id: auctionId },
    };
    return await this.client.queryContractSmart(CONTRACT_ADDRESS, query);
  }

  /**
   * Get all active auctions
   */
  async getActiveAuctions(): Promise<Auction[]> {
    try {
      const query = { get_active_auctions: {} };
      const response = (await this.client.queryContractSmart(
        CONTRACT_ADDRESS,
        query,
      )) as AuctionListResponse;
      return response.auctions || [];
    } catch (error) {
      console.error("Failed to fetch active auctions:", error);
      return [];
    }
  }

  /**
   * Get auctions by seller address
   */
  async getAuctionsBySeller(seller: string): Promise<Auction[]> {
    try {
      const query = {
        get_auctions_by_seller: { seller },
      };
      const response = (await this.client.queryContractSmart(
        CONTRACT_ADDRESS,
        query,
      )) as AuctionListResponse;
      return response.auctions || [];
    } catch (error) {
      console.error("Failed to fetch auctions by seller:", error);
      return [];
    }
  }

  /**
   * Get auctions where user has placed bids
   */
  async getAuctionsByBidder(bidder: string): Promise<Auction[]> {
    try {
      const query = {
        get_auctions_by_bidder: { bidder },
      };
      const response = (await this.client.queryContractSmart(
        CONTRACT_ADDRESS,
        query,
      )) as AuctionListResponse;
      return response.auctions || [];
    } catch (error) {
      console.error("Failed to fetch auctions by bidder:", error);
      return [];
    }
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Convert TESTUSD amount to uTESTUSD (1 TESTUSD = 1,000,000 uTESTUSD)
   */
  static testusdToUtestusd(testusdAmount: string): string {
    const parts = testusdAmount.split(".");
    const whole = parts[0];
    const fraction = parts[1]?.padEnd(6, "0").slice(0, 6) || "000000";
    return whole + fraction;
  }

  /**
   * Convert uTESTUSD to TESTUSD for display
   */
  static utestusdToTestusd(utestusdAmount: string): string {
    const amount = BigInt(utestusdAmount);
    const whole = amount / 1_000_000n;
    const fraction = amount % 1_000_000n;

    if (fraction === 0n) {
      return whole.toString();
    }

    const fractionStr = fraction.toString().padStart(6, "0").replace(/0+$/, "");
    return `${whole}.${fractionStr}`;
  }

  /**
   * Calculate total amount needed for bid (bid + 10% collateral)
   */
  static calculateTotalForBid(bidAmount: string): string {
    const bid = BigInt(bidAmount);
    return (bid + (bid * 10n) / 100n).toString();
  }

  /**
   * Format auction for display
   */
  formatAuctionForDisplay(auction: Auction) {
    return {
      ...auction,
      starting_price_testusd: PhoenixEscrowClient.utestusdToTestusd(
        auction.starting_price,
      ),
      reserve_price_testusd: PhoenixEscrowClient.utestusdToTestusd(
        auction.reserve_price,
      ),
      current_bid_testusd: auction.current_bid
        ? PhoenixEscrowClient.utestusdToTestusd(auction.current_bid)
        : null,
      seller_collateral_testusd: PhoenixEscrowClient.utestusdToTestusd(
        auction.seller_collateral,
      ),
      buyer_collateral_testusd: auction.buyer_collateral
        ? PhoenixEscrowClient.utestusdToTestusd(auction.buyer_collateral)
        : null,
      end_time_local: new Date(auction.end_time * 1000).toLocaleString(),
      created_at_local: new Date(auction.created_at * 1000).toLocaleString(),
      status_badge: this.getStatusBadge(auction.status),
      is_active: auction.status === "Active",
      has_bids: auction.current_bid !== null,
    };
  }

  private getStatusBadge(status: string): { text: string; color: string } {
    switch (status) {
      case "Active":
        return { text: "🟢 Active", color: "green" };
      case "Sold":
        return { text: "✅ Sold", color: "blue" };
      case "ReserveNotMet":
        return { text: "⚠️ Reserve Not Met", color: "yellow" };
      case "Expired":
        return { text: "⏰ Expired", color: "gray" };
      default:
        return { text: status, color: "gray" };
    }
  }
}

// React hook for using the client
import { useWallet } from "@/hooks/useWallet";
import { useCallback, useMemo } from "react";

export function usePhoenixEscrow() {
  const { client, address } = useWallet();

  const escrowClient = useMemo(() => {
    if (!client || !address) return null;
    return new PhoenixEscrowClient(client, address);
  }, [client, address]);

  const createAuction = useCallback(
    async (
      itemId: string,
      description: string,
      startingPrice: string,
      reservePrice: string,
      durationHours: number,
    ) => {
      if (!escrowClient) throw new Error("Wallet not connected");
      return escrowClient.createAuction(
        itemId,
        description,
        startingPrice,
        reservePrice,
        durationHours,
      );
    },
    [escrowClient],
  );

  const placeBid = useCallback(
    async (auctionId: number, bidAmount: string) => {
      if (!escrowClient) throw new Error("Wallet not connected");
      return escrowClient.placeBid(auctionId, bidAmount);
    },
    [escrowClient],
  );

  const getAuction = useCallback(
    async (auctionId: number) => {
      if (!escrowClient) throw new Error("Wallet not connected");
      return escrowClient.getAuction(auctionId);
    },
    [escrowClient],
  );

  const getActiveAuctions = useCallback(async () => {
    if (!escrowClient) return [];
    return escrowClient.getActiveAuctions();
  }, [escrowClient]);

  return {
    client: escrowClient,
    createAuction,
    placeBid,
    getAuction,
    getActiveAuctions,
    formatAuction: escrowClient?.formatAuctionForDisplay.bind(escrowClient),
    testusdToUtestusd: PhoenixEscrowClient.testusdToUtestusd,
    utestusdToTestusd: PhoenixEscrowClient.utestusdToTestusd,
    calculateTotalForBid: PhoenixEscrowClient.calculateTotalForBid,
  };
}
