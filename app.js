let web3;
let contract;

const contractAddress = '0xBfb0671aDaF9DF01BE251007ebad748E621f6b1D';

window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        document.getElementById('connectButton').addEventListener('click', connectWallet);
        document.getElementById('bnbButton').addEventListener('click', buyWithBNB);
        document.getElementById('eaicButton').addEventListener('click', buyWithEAIC);
    } 
    // else {
    //     alert('MetaMask is not installed!');
    // }
});

async function connectWallet() {
    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = '0x38'; // BSC mainnet chain ID (56 in decimal)
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: chainId }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: chainId,
                                chainName: 'Binance Smart Chain',
                                rpcUrls: ['https://bsc-dataseed.binance.org/'],
                                nativeCurrency: {
                                    name: 'Binance Coin',
                                    symbol: 'BNB',
                                    decimals: 18,
                                },
                                blockExplorerUrls: ['https://bscscan.com/'],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error(addError);
                }
            }
        }

        const response = await fetch('abi.json');
        const abi = await response.json();

        contract = new web3.eth.Contract(abi, contractAddress);
        console.log('Wallet connected');
    } catch (error) {
        console.error('Failed to connect wallet:', error);
    }
}

async function buyWithBNB() {
    try {
        const accounts = await web3.eth.getAccounts();
        const bnbAmount = document.getElementById('bnbAmount').value;
        const weiAmount = web3.utils.toWei(bnbAmount, 'ether');

        const result = await contract.methods.buyTokens().send({
            from: accounts[0],
            value: weiAmount
        });

        console.log('Transaction result:', result);
        alert('Tokens purchased successfully!');
    } catch (error) {
        console.error('Failed to buy tokens:', error);
    }
}

async function buyWithEAIC() {
    try {
        const accounts = await web3.eth.getAccounts();
        const eaicAmount = document.getElementById('eaicAmount').value;
        const bnbAmount = eaicAmount / 1000;
        const weiAmount = web3.utils.toWei(bnbAmount.toString(), 'ether');

        const result = await contract.methods.buyTokens().send({
            from: accounts[0],
            value: weiAmount
        });

        console.log('Transaction result:', result);
        alert('Tokens purchased successfully!');
    } catch (error) {
        console.error('Failed to buy tokens:', error);
    }
}
