import { initializeKeypair } from "./utils/initializeKeypair.js"
import { getBalance } from "./utils/getBalance.js";
import { buy, sell } from "./utils/swap.js";
import { transferSol } from "./utils/transfer.js";
import { tip } from "./utils/tip.js";
import { setSlippage, getSlippage } from "./utils/slippage.js";
import * as web3 from "@solana/web3.js"
import readline from 'readline';
import fs from 'fs'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const data = fs.readFileSync('./API_KEY.json', 'utf8');
const config = JSON.parse(data);
const API_KEY = config.API_KEY;

// connect to RPC
let connection = new web3.Connection(`https://mainnet.helius-rpc.com/?api-key=${API_KEY}`)

// fetch/create keypair for user
let user = await initializeKeypair()

// get sol and fungible token balances
await getBalance(user.publicKey, API_KEY)

let currentCommand = null;
let var1 = null;
let var2 = null;

const commands = {
  buy: {
    steps: ['Enter CA:', 'Amount in SOL to Buy:'],
    currentStep: 0,
    execute() {
      buy(var1, var2, connection);
      resetCommand();
    }
  },
  sell: {
    steps: ['Enter CA:', 'Quantity of Tokens to Sell:'],
    currentStep: 0,
    execute() {
      sell(var1, var2, connection);
      resetCommand();
    }
  },
  transfer: {
    steps: ['Enter SOL Address:', 'Amount in SOL to Transfer:'],
    currentStep: 0,
    execute() {
        transferSol(var1, var2, connection);
        resetCommand();
    }
  },
  slippage: {
    get steps() {
        return [`Set Slippage (current value: ${getSlippage()}):`];
      },
    currentStep: 0,
    execute() {
        setSlippage(var1);
        resetCommand();
    }
  }
};

function resetCommand() {
    if (currentCommand) {
        currentCommand.currentStep = 0; 
    }
    currentCommand = null;
    var2 = null;
    var1 = null;
}

function handleCommand(command) {
    if (currentCommand) {
        if (currentCommand.currentStep === 0) {
            var1 = command.trim();
            if (currentCommand.steps.length === 1) {
                currentCommand.execute(); // Execute if it's a single-step command
            } else {
                currentCommand.currentStep++;
                console.log(currentCommand.steps[currentCommand.currentStep]);
            }
        } else if (currentCommand.currentStep === 1) {
            var2 = command.trim();
            currentCommand.execute();
            
        }
    } else {
        switch (command.trim()) {
            case 'pubkey':
                console.log(`Public Key: ${user.publicKey.toBase58()}`);
                break;
            case 'balance':
                getBalance(user.publicKey, API_KEY);
                break;
            case 'buy':
                currentCommand = commands.buy;
                console.log(currentCommand.steps[currentCommand.currentStep]);
                break;
            case 'sell':
                currentCommand = commands.sell;
                console.log(currentCommand.steps[currentCommand.currentStep]);
                break;
            case 'transfer':
                currentCommand = commands.transfer;
                console.log(currentCommand.steps[currentCommand.currentStep]);
                break;
            case 'slippage':
                currentCommand = commands.slippage;
                console.log(currentCommand.steps[currentCommand.currentStep]);
                break;
            case 'tip':
                tip(connection);
                break
            case 'commands':
                console.log('List of commands: pubkey, balance, buy, sell, transfer, slippage, tip, commands, exit');
                console.log('->')
                break;
            case 'exit':
                console.log('Exiting...');
                rl.close();
                break;
            default:
                console.log(`Unknown command: ${command}`);
                console.log('->')
        }
    }
}

rl.on('line', (input) => {
    handleCommand(input);
});



