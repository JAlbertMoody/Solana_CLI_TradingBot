import * as web3 from "@solana/web3.js";

export async function getBalance(pubkey, API_KEY) {
    console.log(`Fetching balance for ${pubkey}`);

    const url = `https://mainnet.helius-rpc.com/?api-key=${API_KEY}`;

    const getAssetsWithNativeBalance = async () => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 'my-id',
                    method: 'getAssetsByOwner',
                    params: {
                        ownerAddress: pubkey,
                        displayOptions: {
                            showFungible: true,
                            showNativeBalance: true,
                        },
                    },
                }),
            });

            const { result } = await response.json();
            const solBalance = (result.nativeBalance.lamports / web3.LAMPORTS_PER_SOL).toFixed(2);
            if (isNaN(solBalance) || solBalance === '0.00') {
                console.log('SOL Balance: 0');
                console.log('Deposit SOL to Pubkey to begin trading!');
                console.log('->');
            } else {
                console.log(`SOL: ${solBalance}`);
                const fungibleTokenInfos = result.items
                    .filter(item => item.interface === 'FungibleToken')
                    .map(item => ({ id: item.id, ...item.token_info }));
                fungibleTokenInfos.forEach(tokenInfo => {
                    const balanceScaled = (tokenInfo.balance / 10 ** tokenInfo.decimals).toFixed(2);
                    console.log(`Symbol: ${tokenInfo.symbol}, Balance: ${balanceScaled}, CA: ${tokenInfo.id}`);
                });
                console.log('->');
            }
        } catch (error) {
            console.error("Error occurred while fetching assets:", error);
            console.log('->')
        }
    };

    await getAssetsWithNativeBalance();
}