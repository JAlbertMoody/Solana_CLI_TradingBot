# Solana CLI Token Trader

A command-line application that allows users to trade tokens on the Solana blockchain.

## Installation

Clone the repository:
git clone https://github.com/JAlbertMoody/Solana_CLI_TradingBot.git  
cd Solana_CLI_TradingBot

Install the dependencies:
npm install

Obtain an API key from Helius (https://dev.helius.xyz) and paste it into API_KEY.json:  
{
  "API_KEY": "your-api-key-here"
}

## Usage

Start the application:
node index.js

A Solana wallet keypair will be created for you. Copy the public key (address) displayed in the console.

Send some SOL to your new wallet address to start trading.

Use the following commands in the application: 
  
pubkey: Display your public key.  
balance: Check your SOL and token balances.  
buy: Buy tokens. Follow the prompts to enter the contract address (CA) and the amount of SOL you want to spend.  
sell: Sell tokens. Follow the prompts to enter the contract address (CA) and the quantity of tokens you want to sell.  
transfer: Transfer SOL. Follow the prompts to enter the recipient's SOL address and the amount of SOL to transfer.  
slippage: Set or get the slippage tolerance for swaps.  
tip: Send a tip to the developer (optional).  
commands: List all available commands.  
exit: Exit the application.  

## APIs Used

This application uses the following APIs:

Helius DAS API: Used to fetch wallet balances. For more information, visit https://dev.helius.xyz.  
Jupiter Swap v6 API: Used to perform token swaps on the Solana blockchain. For more information, visit https://docs.jup.ag.

## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
