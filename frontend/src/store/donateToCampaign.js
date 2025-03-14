import getContractInstance from "./contractInstance";
import { ethers } from "ethers";

const donateToCampaign = async (_id, amount) => {
    try {
        const contractInst = await getContractInstance();
        if (!contractInst) return;

        const tx = await contractInst.donateToCampaign(_id, { value: ethers.parseEther(amount.toString()) });
        await tx.wait();
        console.log("Donation successful!");
    } catch (error) {
        console.error("Error donating:", error);
    }
};

export default donateToCampaign;


/**In the frontend function:

const tx = await contract.donateToCampaign(_id, { value: ethers.parseEther(amount.toString()) });

_id → This is the campaign ID, passed as an argument in donateToCampaign(uint256 _id).

{ value: ethers.parseEther(amount.toString()) } → This is how we send ETH along with the function call.


💡 How Does the Smart Contract Accept ETH Without an amount Parameter?
Look at the Solidity function:

function donateToCampaign(uint256 _id) public payable { 
    uint256 amount = msg.value; // msg.value holds the amount of ETH sent


Solidity functions marked as payable automatically receive ETH when called.

The function does not need an explicit amount parameter because the transaction itself carries the ETH.

msg.value (a special Solidity variable) stores the amount of ETH sent.


📌 How Does ETH Get Sent in the Frontend?
In ethers.js, when calling a payable function, we specify the ETH amount in the value field:


const tx = await contract.donateToCampaign(_id, { value: ethers.parseEther(amount.toString()) });
The first argument (_id) maps to the function parameter.
The second argument { value: ethers.parseEther(amount.toString()) } sends ETH along with the transaction. */