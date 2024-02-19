import * as web3 from "@solana/web3.js"
import * as fs from "fs"
import dotenv from "dotenv"

dotenv.config()

export async function initializeKeypair() {
    if (!process.env.PRIVATE_KEY) {
        console.log("Creating .env file")
        const signer = web3.Keypair.generate()
        fs.writeFileSync(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]`)
        return signer
    }

    const secret = JSON.parse(process.env.PRIVATE_KEY ?? "")
    const secretKey = Uint8Array.from(secret)
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)
    console.log("Pubkey:", keypairFromSecretKey.publicKey.toBase58())
    console.log()
    return keypairFromSecretKey
}