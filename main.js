console.log("Script Loaded");

async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            console.log("Connected account:", accounts[0]);
            document.getElementById("walletAddress").innerText = `Wallet Address: ${accounts[0]}`;

            getWalletBalance();
        } catch (error) {
            console.error("Error connecting to wallet:", error);
        }
    } else {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
}

async function getWalletBalance() {
    if (typeof window.ethereum !== "undefined") {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            const balanceWei = await provider.getBalance(address);

            const balanceETH = ethers.utils.formatEther(balanceWei);

            console.log(`Balance: ${balanceETH} ETH`);
            document.getElementById('walletBalance').innerText = `Balance: ${balanceETH} ETH`;
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    } else {
        alert("MetaMask is not installed. Please install MetaMask and try again.");
    }
}

async function sendETH() {
    const recipient = document.getElementById('recipient').value;
    const amount = document.getElementById('amount').value;

    if (!recipient || !amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Please provide a valid recipient address and amount.");
        return;
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const valueInWei = ethers.utils.parseEther(amount);

        console.log("Sending ETH...");
        const tx = await signer.sendTransaction({
            to: recipient,
            value: valueInWei,
        });

        console.log("Transaction sent:", tx);
        document.getElementById('status').innerText = `Transaction sent! Hash: ${tx.hash}`;
    } catch (error) {
        console.error("Error sending ETH:", error);
        alert("Error sending ETH: " + error.message);
    }
}

// Attach Event Listeners
window.onload = function () {
    document.getElementById('connectWallet').addEventListener('click', connectWallet);
    document.getElementById('sendETH').addEventListener('click', sendETH);
};
