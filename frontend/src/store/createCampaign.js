import getContractInstance from "./contractInstance";

const createCampaign = async (_owner, _title, _description, _target, _deadline, _image) => {


    try {
        const contractInst = await getContractInstance(); //The getContractInstance() function is called to retrieve your deployed contract instance.
        
        if (!contractInst) return;//The if (!contractInst) check ensures that no further steps are attempted if ...The contract instance couldn't be created..or ...The user rejected the MetaMask connection.
        //Good Practice: This prevents unnecessary contract calls when MetaMask isn’t connected.

        const tx = await contractInst.createCampaign(_owner, _title, _description, _target, _deadline, _image); //contractInst.createCampaign(...) sends a transaction to the Ethereum blockchain.
        
        await tx.wait();
        console.log("Campaign created!");
    } catch (error) {
        console.error("Error creating campaign:", error);
    }
};

export default createCampaign;


/**🔍 What is tx?
tx (short for transaction) is the response returned when you send a transaction to the Ethereum blockchain.
In this case, tx contains details about the transaction that was submitted to execute createCampaign on the smart contract.

This includes information like:
Transaction hash
Gas used
Block number (after it's mined)
Contract address (if deploying a contract)
Status (success/failure)

📌 What Happens When You Call createCampaign?
contract.createCampaign(...) sends a transaction to the blockchain.
The transaction is submitted to the Ethereum network.
tx stores details about this submitted transaction.
However, at this point, the transaction is still pending and not mined yet.



💡 Why Do We Call await tx.wait()?

await tx.wait(); // Wait for transaction confirmation
✅ tx.wait() ensures that the transaction is fully confirmed on the blockchain before moving forward.
✅ The function will wait until the transaction is mined and included in a block.
✅ Without await tx.wait(), the UI might proceed before the campaign is actually created.

📌 Example: Logging tx
You can log tx to see its structure:


console.log(tx);
You might see an output like:


{
  "hash": "0x123abc...",
  "from": "0xYourAddress",
  "to": "0xContractAddress",
  "gasLimit": { "type": "BigNumber", "hex": "0x5208" },
  "gasPrice": { "type": "BigNumber", "hex": "0x3b9aca00" },
  "nonce": 12,
  "value": { "type": "BigNumber", "hex": "0x0" },
  "chainId": 1,
  ...
} */



  /**
   You're right—the Solidity function createCampaign returns a uint256, which is the campaign ID. But in the frontend, tx (transaction object) is returned instead. Let's break this down properly. 🔍

📌 Why the Difference Between Smart Contract and Frontend?

In Solidity (createCampaign)

function createCampaign(
    address _owner, 
    string memory _title, 
    string memory _description, 
    uint256 _target, 
    uint256 _deadline, 
    string memory _image
) public returns (uint256) {
    ...
    numberOfCampaigns++;
    return numberOfCampaigns - 1; // Returning campaign ID
}
✅ Returns the campaign ID (an integer).
✅ This is stored in the smart contract but is not directly accessible in the frontend when calling the function via a transaction.




In the Frontend (createCampaign)

const tx = await contract.createCampaign(
    _owner, 
    _title, 
    _description, 
    ethers.utils.parseEther(_target.toString()),  
    new Date(_deadline).getTime(),               
    _image
);

await tx.wait(); // Wait for confirmation
✅ Returns a transaction object (tx), which contains metadata about the blockchain transaction.
✅ It does not return the campaign ID directly because blockchain transactions don't return values in the frontend like function calls do.

   */