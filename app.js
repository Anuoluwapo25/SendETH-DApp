import { ethers } from "ethers";

// Wrap entire script in a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    let provider;
    let signer;

    async function connectWallet() {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
            alert("MetaMask is not installed! Please install MetaMask from https://metamask.io");
            return;
        }

        try {
            // Request account access
            provider = new ethers.BrowserProvider(window.ethereum);
            
            // Prompt user to connect their wallet
            const accounts = await provider.send("eth_requestAccounts", []);
            
            // Get the signer
            signer = await provider.getSigner();
            
            // Update UI with connected wallet address
            const address = accounts[0];
            document.getElementById("walletAddress").textContent = `Connected: ${address}`;

            // Fetch and display wallet balance
            const balance = await provider.getBalance(address);
            const balanceInEth = ethers.formatEther(balance);
            document.getElementById("balance").textContent = `Balance: ${balanceInEth} ETH`;

        } catch (error) {
            console.error("Wallet connection error:", error);
            
            // More specific error handling
            if (error.code === 4001) {
                alert("You rejected the connection request.");
            } else {
                alert(`Connection failed: ${error.message}`);
            }
        }
    }

    // Add event listener to connect wallet button
    const connectButton = document.getElementById("connectWallet");
    if (connectButton) {
        connectButton.addEventListener("click", connectWallet);
    }
});