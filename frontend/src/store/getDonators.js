import getContractInstance from "./contractInstance";
import { ethers } from "ethers";

const getDonators = async (_id) => {
    try {
        const contractInst = await getContractInstance();
        if (!contractInst) return [];

        const donations = await contractInst.getDonators(_id);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for (let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.formatEther(donations[1][i].toString()),
            });
        }

        console.log("Parsed Donations:", parsedDonations);
        return parsedDonations;
    } catch (error) {
        console.error("Error fetching donators:", error);
        return [];
    }
};

export default getDonators;



/** 🔹 Code Breakdown

import getContractInstance from "./contractInstance";
import { ethers } from "ethers";
getContractInstance: Imports a function that connects to the deployed smart contract.
ethers: Used for handling Ethereum transactions, including formatting Ether values.

1️⃣ Function Definition

const getDonators = async (_id) => {
_id (parameter) → The campaign ID for which we need donator details.
async → This function is asynchronous because it involves blockchain calls.

2️⃣ Connecting to the Contract

const contractInst = await getContractInstance();
if (!contractInst) return [];
Calls getContractInstance() to connect to the smart contract..through the instance of the contract.

If the connection fails (returns null or undefined), it returns an empty array [] to prevent errors.

3️⃣ Fetching Donators from Contract

const donations = await contract.getDonators(_id);
Calls the getDonators(_id) function from the smart contract.

The function returns two arrays:
donations[0] → List of donator addresses.
donations[1] → List of donation amounts (in Wei).


4️⃣ Parsing the Data

const numberOfDonations = donations[0].length;
const parsedDonations = [];
numberOfDonations: Stores the total number of donations for the campaign.
parsedDonations: Empty array to store the processed donations.

5️⃣ Looping Through Donations

for (let i = 0; i < numberOfDonations; i++) {
    parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.formatEther(donations[1][i].toString()),
    });
}

Loops through each donation and extracts:
Donator address → donations[0][i]
Donation amount (converted from Wei to ETH) → ethers.formatEther(donations[1][i].toString())

Why formatEther?
Donations are stored in Wei (smallest ETH unit).
formatEther() converts it to human-readable ETH (e.g., 1000000000000000000 Wei → 1 ETH).

6️⃣ Logging and Returning Data

console.log("Parsed Donations:", parsedDonations);
return parsedDonations;
Logs parsed donations for debugging.
Returns the parsedDonations array, which contains objects like:

[
  { "donator": "0x123...", "donation": "0.5" },
  { "donator": "0x456...", "donation": "1.2" }
]
7️⃣ Error Handling

} catch (error) {
    console.error("Error fetching donators:", error);
    return [];
}
If an error occurs (e.g., network issue, contract not deployed), it:
Logs the error.
Returns an empty array [] to avoid breaking the app.
 */




/**
 1️⃣ getDonators is a view Function (Not a Transaction)

In your Solidity smart contract:


function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
    return (campaigns[_id].donators, campaigns[_id].donations);
}
✅ The view keyword means this function does not change blockchain state.
✅ view functions can be called from the frontend without sending a transaction.
✅ Returns two arrays:

campaigns[_id].donators: List of donor addresses.
campaigns[_id].donations: List of donation amounts.


2️⃣ getContractInstance().getDonators(_id) Calls a Read Function
In your React frontend:


const donations = await contractInst.getDonators(_id);
This calls the getDonators function in the smart contract.
Since getDonators is view-only, the blockchain does not require gas or a transaction.
The function directly returns the address[] and uint256[] arrays.

4️⃣ Why Doesn't a Transaction Return Values?
If getDonators were a write function (without view), the frontend would only get a transaction receipt, not the actual return value:


const tx = await contractInst.getDonators(_id);
console.log(tx); // This would log transaction details, NOT an array!
That's why transactions don’t return data—they just execute changes on the blockchain.

 */