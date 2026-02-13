import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { calculateFee, GasPrice } from '@cosmjs/stargate';

class CoreumService {
    private client: SigningCosmWasmClient | null = null;
    private senderAddress: string = '';
    private connected: boolean = false;
    private network: string = 'coreum-testnet-1';

    async connect(mnemonic?: string, rpcEndpoint?: string) {
        try {
            const mnemonicToUse = mnemonic || process.env.COREUM_MNEMONIC;
            const rpcToUse = rpcEndpoint || process.env.COREUM_NODE || 'https://full-node.testnet-1.coreum.dev:26657';
            
            if (!mnemonicToUse) {
                throw new Error('Coreum mnemonic not found. Set COREUM_MNEMONIC in .env file');
            }

            const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonicToUse, {
                prefix: 'core'
            });
            
            const [account] = await wallet.getAccounts();
            this.senderAddress = account.address;
            
            this.client = await SigningCosmWasmClient.connectWithSigner(
                rpcToUse,
                wallet
            );
            
            this.connected = true;
            console.log('\n✅✅✅ COREM TESTNET CONNECTED ✅✅✅');
            console.log(`📡 Node: ${rpcToUse}`);
            console.log(`📬 Address: ${this.senderAddress}`);
            console.log(`🔗 Network: ${this.network}\n`);
            
            return { 
                client: this.client, 
                address: this.senderAddress,
                network: this.network,
                connected: true 
            };
        } catch (error) {
            console.error('\n❌❌❌ COREM TESTNET CONNECTION FAILED ❌❌❌');
            console.error(error);
            this.connected = false;
            throw error;
        }
    }

    isConnected() {
        return this.connected;
    }

    getAddress() {
        return this.senderAddress;
    }

    async executeContract(
        contractAddress: string,
        msg: any,
        funds: Array<{ denom: string; amount: string }> = []
    ) {
        if (!this.client || !this.connected) {
            await this.connect();
        }

        const gasPrice = GasPrice.fromString('0.025ucore');
        const fee = calculateFee(200000, gasPrice);

        const result = await this.client!.execute(
            this.senderAddress,
            contractAddress,
            msg,
            fee,
            undefined,
            funds
        );

        return result;
    }

    async queryContract(contractAddress: string, query: any) {
        if (!this.client || !this.connected) {
            await this.connect();
        }

        return await this.client!.queryContractSmart(contractAddress, query);
    }

    async getBalance(address: string, denom: string = 'ucore') {
        if (!this.client || !this.connected) {
            await this.connect();
        }

        return await this.client!.getBalance(address, denom);
    }

    async getTestUSDBalance(address: string) {
        const testusdDenom = process.env.TESTUSD_DENOM || 'utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6';
        return await this.getBalance(address, testusdDenom);
    }

    calculateFeeFromAmount(amount: string, decimals: number = 6): string {
        const amountNum = parseFloat(amount);
        const feeAmount = amountNum * 0.011;
        const netAmount = amountNum - feeAmount;
        return netAmount.toFixed(decimals);
    }
}

export default new CoreumService();
