import { ethers } from "ethers";

const connectWallet = async () => {//This is an asynchronous function since interacting with MetaMask and the blockchain involves promises.

    
    
    if (!window.ethereum) { //window.ethereum is injected by MetaMask into the browser when it's installed.
        alert("Please install MetaMask!"); //If window.ethereum doesn't exist, it means MetaMask (or any Ethereum provider) is not available.
        //  In this case, an alert prompts the user to install MetaMask, and the function returns null.
        return null;
    }
    try {
        const provider = new ethers.BrowserProvider(window.ethereum); // Uses ethers.BrowserProvider (introduced in ethers v6).
        //The ethers.BrowserProvider class is used to connect to MetaMask (or any browser-based Ethereum provider).
        //BrowserProvider automatically manages the connection and works well with modern dApps.
        //window.ethereum is passed as a parameter to establish this connection.

        const signer = await provider.getSigner();//The signer is a special object in ethers.js that represents the user's Ethereum account.
        //Automatically prompts the user to connect their wallet when getSigner() is called.
        //It’s used to sign transactions and messages on behalf of the connected account.
        //await ensures that the function pauses until the signer is obtained.
        //In ethers v6 (BrowserProvider), await is required because getSigner() is asynchronous.

        const account = await signer.getAddress();//signer.getAddress() fetches the Ethereum address of the connected account.
        //await ensures the address retrieval completes before proceeding.


        console.log("Connected account:", account); //The connected wallet address is logged to the console for debugging.
        return account;//The function returns the connected account address, which can be used in other parts of your app
        // The function returns the connected account address, which can be used in other parts of your appThe function returns the connected account address, which can be used in other parts of your app


    } catch (error) {
        console.error("Error connecting wallet:", error);
        return null;
    }
};

export default connectWallet;
