import { ethers } from "ethers";
import { contractAddress, contractAbi } from "../config/connectionKeys";

const getContractInstance = async () => {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return null;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();


    return new ethers.Contract(contractAddress, contractAbi, signer); //This line creates a contract instance using ethers.js.
    //contractAddress → Specifies the deployed contract's address.
    //contractAbi → Defines the available functions and data structures of the contract.
    //signer → Ensures the contract instance has write permissions (needed for sending transactions)
};

export default getContractInstance;
