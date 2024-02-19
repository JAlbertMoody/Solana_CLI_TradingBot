import { PublicKey } from '@solana/web3.js';

export function validateInputs(pubkey, quantity) {
    if (!isValidSolanaPublicKey(pubkey)) {
        console.log("Error: Please enter valid Solana Public Key")
        console.log('->')
        return false
    } else if (!isValidQuantity(quantity)){
        console.log("Error: Please enter a non-negative, numerical quantity")
        console.log('->')
        return false
    }

    return true
}

function isValidSolanaPublicKey(pubkey) {
    const base58Regex = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{43,44}$/;
    return base58Regex.test(pubkey);
}

function isValidQuantity(quantity) {
    const num = parseFloat(quantity);
    return typeof num === 'number' && num >= 0;
}

export async function getTokenDecimals(mintAddress, connection) {
    const mintPublicKey = new PublicKey(mintAddress);
    const tokenSupply = await connection.getTokenSupply(mintPublicKey);
    return tokenSupply.value.decimals;
}
