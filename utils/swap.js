import {Keypair, VersionedTransaction, LAMPORTS_PER_SOL} from '@solana/web3.js';
import fetch from 'cross-fetch';
import { Wallet } from '@project-serum/anchor';
import bs58 from 'bs58';
import dotenv from "dotenv"
import { validateInputs, getTokenDecimals } from './functions.js';
import { getSlippage } from './slippage.js';

dotenv.config()
const sol = 'So11111111111111111111111111111111111111112'
// USDC MINT = EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

export async function buy(ca, quantity, connection){
    if (!validateInputs(ca, quantity)) {return null}

    console.log(`Buying ${ca} with ${quantity} SOL`)

    const privateKeyArray = JSON.parse(process.env.PRIVATE_KEY || '[]');
    const privateKeyUint8Array = new Uint8Array(privateKeyArray);
    const wallet = new Wallet(Keypair.fromSecretKey(privateKeyUint8Array));
    const slippage = await getSlippage()
    const slippageBP = slippage * 100

    const quoteResponse = await (
        await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${sol}&outputMint=${ca}&amount=${quantity * LAMPORTS_PER_SOL}&slippageBps=${slippageBP}`)
    ).json();
    
    // get serialized transactions for the swap
    const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey.toString(),
            wrapAndUnwrapSol: true,
            prioritizationFeeLamports: 'auto' 
        })
        })
    ).json();

    if (!swapTransaction) {
        console.log("Error: swap transaction is undefined");
        return null
    }

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    transaction.sign([wallet.payer]);

    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
    });

    try {
        // Wait for the transaction to be confirmed or timeout after 20 seconds
        await Promise.race([
            connection.confirmTransaction(txid),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Transaction timed out after 20 seconds")), 20000))
        ]);
        console.log(`Success! https://solscan.io/tx/${txid}`);
    } catch (error) {
        console.log("An error occurred:", error.message);
        console.log('->');
        return null;
    }

    console.log('->');
}



/////////////////////////////////////////////////////////////////////////////////



export async function sell(ca, quantity, connection){
    if (!validateInputs(ca, quantity)) {return null}

    console.log(`Selling ${quantity} tokens of ${ca}`)

    const privateKeyArray = JSON.parse(process.env.PRIVATE_KEY || '[]');
    const privateKeyUint8Array = new Uint8Array(privateKeyArray);
    const wallet = new Wallet(Keypair.fromSecretKey(privateKeyUint8Array));
    const tokenDecimals = await getTokenDecimals(ca, connection)
    const amount = (quantity* 10**tokenDecimals)
    const slippage = await getSlippage()
    const slippageBP = slippage * 100

    const quoteResponse = await (
        await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${ca}&outputMint=${sol}&amount=${amount}&slippageBps=${slippageBP}`)
    ).json();
    
    // get serialized transactions for the swap
    const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            quoteResponse,
            userPublicKey: wallet.publicKey.toString(),
            wrapAndUnwrapSol: true,
            prioritizationFeeLamports: 'auto' 
        })
        })
    ).json();

    if (!swapTransaction) {
        console.log("Error: swap transaction is undefined");
        return null
    }
    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    transaction.sign([wallet.payer]);

    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
    });

    try {
        // Wait for the transaction to be confirmed or timeout after 20 seconds
        await Promise.race([
            connection.confirmTransaction(txid),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Transaction timed out after 20 seconds")), 20000))
        ]);
        console.log(`Success! https://solscan.io/tx/${txid}`);
    } catch (error) {
        console.log("An error occurred:", error.message);
        console.log('->');
        return null;
    }

    console.log('->');
}

