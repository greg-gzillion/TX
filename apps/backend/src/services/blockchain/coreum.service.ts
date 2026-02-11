import { DirectSecp256k1HdWallet, OfflineDirectSigner } from "@cosmjs/proto-signing";
import { SigningStargateClient, coins, GasPrice } from "@cosmjs/stargate";
import { Decimal } from "@cosmjs/math";

export interface AuctionCreateParams {
    seller: string;
    itemId: string;
    reservePrice: string; // in TESTUSD (like "1000.50")
    duration: number; // in blocks
    metadata: string; // JSON string of item details
}

export class CoreumBlockchainService {
    private client: SigningStargateClient | null = null;
    private wallet: OfflineDirectSigner | null = null;
    private walletAddress: string = "";
    
    constructor(
        private rpcUrl: string,
        private chainId: string,
        private testusdDenom: string,
        private decimals: number = 6
    ) {}
    
    async initialize(mnemonic: string): Promise<void> {
        try {
            console.log("🔄 Initializing blockchain service...");
            
            // Initialize wallet
            this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
                prefix: "testcore"
            });
            
            const [account] = await this.wallet.getAccounts();
            this.walletAddress = account.address;
            
            console.log(`✅ Wallet initialized. Address: ${this.walletAddress}`);
            
            // Initialize client
            this.client = await SigningStargateClient.connectWithSigner(
                this.rpcUrl,
                this.wallet,
                {
                    gasPrice: GasPrice.fromString("0.0625utestcore")
                }
            );
            
            console.log("✅ Blockchain client connected");
            console.log(`✅ Service ready. Chain: ${this.chainId}`);
            
        } catch (error) {
            console.error("❌ Failed to initialize blockchain service:", error);
            throw error;
        }
    }
    
    // Convert human amount to blockchain units
    toMicroTestusd(amount: string): string {
        try {
            const decimalAmount = Decimal.fromUserInput(amount, this.decimals);
            return decimalAmount.atomics;
        } catch (error) {
            throw new Error(`Invalid amount format: ${amount}. Use format like "1000.50"`);
        }
    }
    
    // Convert blockchain units to human-readable
    fromMicroTestusd(microAmount: string): string {
        return Decimal.fromAtomics(microAmount, this.decimals).toString();
    }
    
    // Get TESTUSD balance for any address
    async getBalance(address: string): Promise<{ 
        success: boolean; 
        amount?: string; 
        formatted?: string;
        error?: string;
    }> {
        try {
            if (!this.client) throw new Error("Service not initialized");
            
            const balance = await this.client.getBalance(address, this.testusdDenom);
            
            return {
                success: true,
                amount: balance.amount,
                formatted: this.fromMicroTestusd(balance.amount)
            };
        } catch (error: any) {
            // If token doesn't exist for address, return 0
            if (error.message.includes("not found")) {
                return {
                    success: true,
                    amount: "0",
                    formatted: "0.000000"
                };
            }
            
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Send TESTUSD with 1.1% fee simulation
    async sendWithFee(
        toAddress: string,
        amount: string, // like "1000.50"
        insurancePoolAddress: string
    ): Promise<{ 
        success: boolean;
        txHash?: string;
        feeAmount?: string;
        netAmount?: string;
        error?: string;
    }> {
        try {
            if (!this.client || !this.wallet) {
                throw new Error("Service not initialized");
            }
            
            console.log(`📊 Processing payment: ${amount} TESTUSD`);
            
            const microAmount = this.toMicroTestusd(amount);
            const feePercentage = 0.011; // 1.1%
            
            // Calculate amounts
            const amountDec = Decimal.fromAtomics(microAmount, this.decimals);
            const feeAmount = amountDec.multiply(Decimal.fromUserInput(feePercentage.toString(), this.decimals));
            const netAmount = amountDec.sub(feeAmount);
            
            console.log(`  Gross: ${amountDec.toString()} TESTUSD`);
            console.log(`  Fee (1.1%): ${feeAmount.toString()} TESTUSD`);
            console.log(`  Net: ${netAmount.toString()} TESTUSD`);
            
            // In a real auction, we'd have a smart contract handle this atomically
            // For now, we simulate by sending net to seller and fee to insurance pool
            
            // Send net amount to seller (toAddress)
            const paymentTx = await this.client.sendTokens(
                this.walletAddress,
                toAddress,
                coins(netAmount.atomics, this.testusdDenom),
                "auto",
                `PhoenixPME Auction Payment (Net)`
            );
            
            // Send fee to insurance pool
            const feeTx = await this.client.sendTokens(
                this.walletAddress,
                insurancePoolAddress,
                coins(feeAmount.atomics, this.testusdDenom),
                "auto",
                `PhoenixPME Platform Fee 1.1%`
            );
            
            return {
                success: true,
                txHash: paymentTx.transactionHash,
                feeAmount: feeAmount.toString(),
                netAmount: netAmount.toString()
            };
            
        } catch (error: any) {
            console.error("❌ Transaction failed:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Get backend wallet info
    getWalletInfo(): { address: string; isInitialized: boolean } {
        return {
            address: this.walletAddress,
            isInitialized: !!this.client
        };
    }
    
    // Health check
    async healthCheck(): Promise<{ 
        healthy: boolean; 
        blockHeight?: number;
        error?: string;
    }> {
        try {
            if (!this.client) throw new Error("Service not initialized");
            
            const block = await this.client.getHeight();
            
            return {
                healthy: true,
                blockHeight: block
            };
        } catch (error: any) {
            return {
                healthy: false,
                error: error.message
            };
        }
    }
}

// Create and export singleton instance
export const coreumService = new CoreumBlockchainService(
    process.env.COREUM_RPC_URL || "https://full-node.testnet-1.coreum.dev:26657",
    process.env.COREUM_CHAIN_ID || "coreum-testnet-1",
    process.env.TESTUSD_DENOM || "",
    parseInt(process.env.TESTUSD_DECIMALS || "6")
);
