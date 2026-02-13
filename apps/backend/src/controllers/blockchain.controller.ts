import { Request, Response } from 'express';
import coreumService from '../services/blockchain/coreum.service';

export const getStatus = async (req: Request, res: Response) => {
    try {
        const isConnected = coreumService.isConnected();
        const address = coreumService.getAddress();
        res.json({ 
            status: isConnected ? 'connected' : 'disconnected',
            network: 'coreum-testnet-1',
            node: process.env.COREUM_NODE || 'https://full-node.testnet-1.coreum.dev:26657',
            chain_id: process.env.COREUM_CHAIN_ID || 'coreum-testnet-1',
            connected: isConnected,
            address: address || null,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to get blockchain status',
            network: 'coreum-testnet-1',
            connected: false
        });
    }
};

export const connect = async (req: Request, res: Response) => {
    try {
        const { mnemonic } = req.body;
        const result = await coreumService.connect(
            mnemonic || process.env.COREUM_MNEMONIC || ''
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to connect to Coreum testnet',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const executeContract = async (req: Request, res: Response) => {
    try {
        const { contractAddress, msg, funds } = req.body;
        const result = await coreumService.executeContract(contractAddress, msg, funds);
        res.json({ success: true, txHash: result.transactionHash });
    } catch (error) {
        res.status(500).json({ error: 'Failed to execute contract' });
    }
};

export const queryContract = async (req: Request, res: Response) => {
    try {
        const { contract } = req.params;
        const { query } = req.body;
        const result = await coreumService.queryContract(contract, query);
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to query contract' });
    }
};

export const getBalance = async (req: Request, res: Response) => {
    try {
        const { address } = req.params;
        const { denom } = req.query;
        const balance = await coreumService.getBalance(
            address, 
            denom as string || 'ucore'
        );
        res.json({ address, balance });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get balance' });
    }
};

export const getTestUSD = async (req: Request, res: Response) => {
    try {
        const { address } = req.params;
        const testusdDenom = process.env.TESTUSD_DENOM || 'utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6';
        const balance = await coreumService.getBalance(address, testusdDenom);
        res.json({ 
            address, 
            balance,
            denom: testusdDenom,
            token: 'TESTUSD'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get TESTUSD balance' });
    }
};

export const getTestnetInfo = async (req: Request, res: Response) => {
    res.json({
        network: 'coreum-testnet-1',
        node: 'https://full-node.testnet-1.coreum.dev:26657',
        chain_id: 'coreum-testnet-1',
        faucet: 'https://faucet.testnet-1.coreum.dev',
        explorer: 'https://explorer.testnet-1.coreum.dev',
        denom: 'utestcore',
        atomic_units: 6,
        token: 'TESTCORE',
        testusd: {
            denom: process.env.TESTUSD_DENOM || 'utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6',
            issuer: 'testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6'
        }
    });
};
