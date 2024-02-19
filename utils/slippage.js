import fs from 'fs'
import { PassThrough } from 'stream';

// add checks to make sure num is valid 
export async function setSlippage(input){
    const num = parseFloat(input)
    if (typeof num === 'number' && num >= 0 && num <= 5) {
        console.log(`Setting slippage to ${num}`)
        updateSlippage(num)
        console.log('->')
    } else {
        console.log("Please input a valid numerical value between 0 and 5");
        console.log('->')
        return null;
    }

    function updateSlippage(num) {
        const config = {
            SLIPPAGE: num
        };
        fs.writeFileSync('SLIPPAGE.json', JSON.stringify(config, null, 2));
    }
}

export function getSlippage() {
    const data = fs.readFileSync('./SLIPPAGE.json');
    const config = JSON.parse(data);
    return config.SLIPPAGE;
}