// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "hardhat/console.sol"; //is used to import Hardhat’s built-in debugging tool, console.log, which allows you to print debug messages while testing and deploying your smart contracts.
//console.sol only works in Hardhat (not in production or testnets).It increases gas consumption (but it’s fine for debugging locally).
//Remove it before deploying to production.

contract CrowdFunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;//No, mappings in Solidity do not have automatic indexing like arrays.
    //If numberOfCampaigns = 0, the mapping assigns the first campaign to campaigns[0].
    //On the next function call, numberOfCampaigns++ increases the count, and the new campaign is stored at campaigns[1].


    uint256 public numberOfCampaigns = 0;

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        /*
        Campaign storage campaign = campaigns[numberOfCampaigns]; // the "campaign" local variable is pointing to the location of the specific "Campaign" struct at "campaigns[numberOfCampaigns]" in "campaigns mapping"
        // initially numberofCampaigns is 0, so it will point to the first struct in the mapping

        require(_deadline > block.timestamp, "The deadline should be a date in the future.");


        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        */

       require(_deadline > block.timestamp, "The deadline should be a date in the future.");
       
        campaigns[numberOfCampaigns] = Campaign({
            owner: _owner,
            title: _title,
            description: _description,
            target: _target,
            deadline: _deadline,
            amountCollected: 0,
            image: _image,
            donators: new address[](0), // Explicitly initializes an empty dynamic array
            donations: new uint256[](0) // Explicitly initializes an empty dynamic array
    });



        numberOfCampaigns++; // with each time the function called to create a new campaign, the number of campaigns will be increased by 1

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable { // payable keyword is used to accept ether in the function
        uint256 amount = msg.value; // msg.value is the amount of ether sent , when calling the function , by the user

        Campaign storage campaign = campaigns[_id]; // if we know the id of the campaign, we can access the campaign by using the id as the key in the mapping

        require(amount > 0, "Donation must be greater than 0");

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");
        // payable(campaign.owner) is used to convert the address of the owner to a payable address, as by default solidity does not keep the address written in contract as payable
        // .call{value: amount}("")...Sends Ether (amount) to the campaign.owner using the low-level call function....The empty string ("") means no data is sent along with the transaction.
        // sent will be true if the Ether transfer succeeds.
        // sent will be false if it fails (e.g., if the recipient is a smart contract with no fallback function).
        // The second value in the tuple is ignored using the comma operator (,). The , means we don't store the second return value.

        require(sent, "Failed to send Ether to campaign owner");//If the transfer fails, it reverts the entire transaction instead of just skipping amountCollected update.

        if(sent) { // sent = true means the transfer was successful
            campaign.amountCollected = campaign.amountCollected + amount; // the amount collected in the campaign will be increased by the amount sent by the user
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) { // we are returning  arrays in the function, therefore we have to specify the memory keyword
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) { //returning an  struct array 
                                                                      // each campaign in the returned array is a struct, so we have to specify the memory keyword

        // This line creates a temporary array in memory to store all campaigns before returning them.                                                               
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns); // we are creating an local array of struct type Campaign, therefore we have to specify the memory keyword
        //Campaign[] memory allCampaigns;....Declares a variable allCampaigns of type Campaign[] memory. ....But right now, it does not contain anything.
        // new Campaign[](numberOfCampaigns);...Creates an empty array of type Campaign[] in memory. The array has a length of numberOfCampaigns.

        // The right side (new Campaign[](...)) executes first, creating an empty array of Campaign structs in memory.
        //Solidity knows that the array must be memory because...new only works for memory arrays....There's no explicit storage location mentioned, so Solidity defaults to memory.
        // But right now, this array has no name—it exists in memory but isn’t linked to any variable yet.
        // Campaign[] memory allCampaigns ....It is now assigned the reference (pointer) to the newly created array in memory.
        // allCampaigns does not store the array itself, but rather a reference (address) pointing to it.

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i]; // item is a local variable pointing to the location of the specific "Campaign" struct at "campaigns[i]" in "campaigns mapping"

            allCampaigns[i] = item; 

            // so when i  write... allCampaigns[i] = item;  the struct in campaign[i], to which item is pointing at ...... Campaign storage item = campaigns[i]
            // ...gets copied to the memory array slot allCampaign[i] is pointing at.
        }

        return allCampaigns; // return allCampaigns; will return the entire array that allCampaigns is pointing to—which is an array stored in memory.


    }
}


/**
You're using a mapping (campaigns[numberOfCampaigns]),
 but mappings in Solidity do not grow automatically like arrays.
  This is why your campaign data isn't being stored properly.


1️⃣ Main Issue: Mapping Access & Storage in Solidity
  In your earlier code, you used:

s
Campaign storage campaign = campaigns[numberOfCampaigns];

This directly referenced the campaigns[numberOfCampaigns] slot before initializing it.
Since Solidity mappings do not automatically create storage slots, this led to unexpected behavior.
Then you manually assigned values like this:


campaign.owner = _owner;
campaign.title = _title;
campaign.description = _description;
// ... (other assignments)


❌ Problem:
In Solidity, mappings do not store actual data until explicitly assigned.
When you access campaigns[numberOfCampaigns], it's just a reference—the data isn't actually allocated in storage.
If the mapping slot isn’t initialized, the values remain empty or default (0, "", 0x0, etc.).
💡 
Fix: Store the struct in the mapping using an assignment
Instead of modifying a storage reference before it exists, use explicit struct assignment:


campaigns[numberOfCampaigns] = Campaign({
    owner: _owner,
    title: _title,
    description: _description,
    target: _target,
    deadline: _deadline,
    amountCollected: 0,
    image: _image,
    donators: new address[](0),   // Explicitly initializes an empty dynamic array
    donations: new uint256[](0)   // ✅ Fix: Correct array initialization
});
✅ This directly stores the initialized struct inside the mapping.

2️⃣ Secondary Issue: Array Initialization
As I explained earlier, your incorrect syntax:

donators: new address,  
donations: new uint256 

changed to :

donators: new address[](0), // Explicitly initializes an empty dynamic array
donations: new uint256[](0) // Explicitly initializes an empty dynamic array



You're right to focus on the change and understand why new address and new uint256 are wrong, and why new address[](0) and new uint256[](0) are correct. Let's break it down:

1. Why new address and new uint256 are Incorrect:

address and uint256 are Value Types:

address and uint256 are fundamental value types in Solidity. They represent single, fixed values (an Ethereum address or an unsigned integer, respectively).
They are not objects or data structures that need to be dynamically allocated with new.

new for Dynamic Allocation:
The new keyword in Solidity is primarily used for dynamic memory allocation, which is necessary for:
Creating new contract instances.
Creating dynamic arrays (arrays whose size can change during runtime).
new address and new uint256 are attempting to use the new keyword to create single value types, and that is not what the new keyword is designed to do.


2. Why new address[](0) and new uint256[](0) are Correct:

Dynamic Arrays:
address[] and uint256[] represent dynamic arrays of addresses and unsigned integers, respectively. Dynamic arrays can grow or shrink in size during the contract's execution.
new address[](0) and new uint256[](0): Dynamic Array Initialization:
new address[](0) creates a new dynamic array of addresses with an initial size of 0 (an empty array).
new uint256[](0) creates a new dynamic array of uint256 with an initial size of 0 (an empty array).
The (0) part specifies that the array should be initialized with zero elements.
This is the correct way to explicitly create and initialize an empty dynamic array in Solidity.


In essence:

You cannot use new to create single address or uint256 values.
You must use new with the [] notation (and an optional size in parentheses) to create dynamic arrays.
Specifying the (0) explicitly initializes the array to be empty.



 */
