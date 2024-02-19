import {
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js'

import { validateInputs } from './functions.js';

export async function transferSol(pubkey, quantity, connection){
    if (!validateInputs(pubkey, quantity)) {return null}

    console.log(`Sending ${quantity} SOL to ${pubkey}`)
    const privateKeyArray = JSON.parse(process.env.PRIVATE_KEY || '[]');
    const privateKeyUint8Array = new Uint8Array(privateKeyArray);
    const senderKeypair = Keypair.fromSecretKey(privateKeyUint8Array);
    const receiverPublicKey = new PublicKey(pubkey)
    const amountInLamports = quantity * LAMPORTS_PER_SOL

    const tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: senderKeypair.publicKey,
            toPubkey: receiverPublicKey,
            lamports: amountInLamports,
        })
    );

    try {
        const signature = await sendAndConfirmTransaction(
            connection,
            tx,
            [senderKeypair]
        );
        console.log(`Transaction confirmed: https://solscan.io/tx/${signature}`);
    } catch (error) {
        console.error('Transaction failed:', error);
    }

    console.log('->');
}