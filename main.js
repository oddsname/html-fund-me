import './style.css'
import {ethers} from "ethers";
import {abi, contractAddress} from "./consts.js";

const connectBtn = document.querySelector('#connect');
const balanceBtn = document.querySelector('#balance');
const fundBtn = document.querySelector('#fund');
const withdrawBtn = document.querySelector('#withdraw');

if (typeof window.ethereum === "undefined") {
    console.error('Please install Metamask')
    document.querySelector('h1').innerHTML = 'Please install Metamask';
    throw new Error('Metamask not found')
}

const connectMetamask = async () => {
    //only for metamask
    return await window.ethereum.request({
        method: "eth_requestAccounts"
    });
}

const getBalance = async () => {
    //---------VERSION 1

    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const contract = new ethers.Contract(contractAddress, abi, signer);
    //
    // const txResponse = await contract.getAmountFunded(signer.getAddress());
    // console.log(ethers.utils.formatEther(txResponse));

    //-------VERSION 2

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const result = await provider.getBalance(contractAddress);

    console.log(ethers.utils.formatEther(result));
}

const fund = async (ethAmount = '0.1') => {
    // to call fund function we need these thing
    // provider / connection to the blockchain
    // signer / wallet / someone with the gas
    // contract that we are interaction with

    //here we installed ethers 5.7.2 in future releases I didn't find Web3Provider anymore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const ethValue = ethers.utils.parseEther(ethAmount)

    const txResponse = await contract.fund({ value: ethValue });

    await waitForTxMine(txResponse, provider);
    console.log('Fund Done');
}

const withdraw = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const txResponse = await contract.withdraw();

    await waitForTxMine(txResponse, provider);
    console.log('Withdraw Done');
}

const waitForTxMine = async (txResponse, provider) => {
    console.log(`Mining ${txResponse.hash}`);

    return new Promise((resolve) => {
        //event listener that triggers only once
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(`completed with ${txReceipt.confirmations}`);
            resolve(txReceipt);
        });
    })
}

connectBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    try {
        if (await connectMetamask()) {
            connectBtn.innerHTML = "Connected";
        }
    } catch (e) {
        console.error(e);
    }
})

balanceBtn.addEventListener('click', async function(e) {
    e.preventDefault();

    await getBalance();
});

fundBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    const ethValue = document.querySelector('#ethAmount').value;

    try {
        await fund(ethValue);
    } catch (e) {
        console.error(e);
    }
})

withdrawBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    console.log('withdraw click');
    try {
        await withdraw();
    } catch (e) {
        console.error(e);
    }
})
