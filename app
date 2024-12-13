import { ethers } from 'ethers';

console.log(ethers); // Verify that ethers is loaded

// Variables to store provider and signer
let provider;
let signer;

// Contract details for the voting functionality
const contractAddress = '0xbcb1e2af36013e8957d4d966df39875e85ce4b2d';
const abi = [
    "function vote(uint256 proposalId)"
];

async function connectWallet() {
    try {
        console.log("Checking for Ethereum provider...");
        if (!window.ethereum) {
            throw new Error("Ethereum provider not found. Please install MetaMask.");
        }

        console.log("Initializing provider...");
        provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("Provider initialized:", provider);

        console.log("Requesting accounts...");
        await provider.send('eth_requestAccounts', []);
        signer = provider.getSigner();
        console.log("Signer initialized:", signer);

        const walletAddress = await signer.getAddress();
        document.getElementById('walletAddress').innerText = `Wallet Address: ${walletAddress}`;

        const balance = await provider.getBalance(walletAddress);
        document.getElementById('balance').innerText = `Balance: ${ethers.utils.formatEther(balance)} ETH`;
    } catch (error) {
        console.error("Error connecting to wallet:", error.message);
        alert(error.message);
    }
}


// Send ETH
async function sendETH() {
    try {
        const recipient = document.getElementById('recipient').value;
        const amount = document.getElementById('amount').value;

        if (!ethers.utils.isAddress(recipient)) {
            alert('Invalid recipient address!');
            return;
        }

        const transaction = await signer.sendTransaction({
            to: recipient,
            value: ethers.utils.parseEther(amount)
        });

        document.getElementById('status').innerText = `Transaction sent. Hash: ${transaction.hash}`;
        await transaction.wait();
        document.getElementById('status').innerText = 'Transaction confirmed!';
    } catch (error) {
        console.error(error);
        alert('Transaction failed. Please check the details and try again.');
    }
}

// Vote for a proposal
async function vote(proposalId) {
    try {
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const transaction = await contract.vote(proposalId);
        document.getElementById('voteStatus').innerText = `Vote transaction sent. Hash: ${transaction.hash}`;
        await transaction.wait();
        document.getElementById('voteStatus').innerText = 'Vote confirmed!';
    } catch (error) {
        console.error(error);
        alert('Voting failed. Please try again.');
    }
}

// Event listeners for buttons
document.getElementById('connectWallet').onclick = connectWallet;
document.getElementById('sendETH').onclick = sendETH;
document.getElementById('vote1').onclick = () => vote(1); // Vote for Proposal 1
document.getElementById('vote2').onclick = () => vote(2); // Vote for Proposal 2
