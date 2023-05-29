import './style.css'
import {ethers} from "ethers";
import {abi, contractAddress} from "./consts.js";

const connectBtn = document.querySelector('#connect');
const fundBtn = document.querySelector('#fund');

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

const fund = async (ethAmount = '0.1') => {
    // to call fund function we need these thing
    // provider / connection to the blockchain
    // signer / wallet / someone with the gas
    // contract that we are interaction with

    //here we installed ethers 5.7.2 in future releases I didn't find Web3Provider anymore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const ethValue = ethers.utils.parseEther(ethAmount);

    const txResponse = await contract.fund({ value: ethValue});

    await listForTxMine(txResponse, provider);
    console.log('Done');
}

const listForTxMine = async (txResponse, provider) => {
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

fundBtn.addEventListener('click', async function (e) {
    e.preventDefault();

    try {
        await fund();
    } catch (e) {
        console.error(e);
    }
})

