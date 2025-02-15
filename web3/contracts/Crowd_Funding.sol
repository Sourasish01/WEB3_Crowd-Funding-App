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

        numberOfCampaigns++; // with each time the function called to create a new campaign, the number of campaigns will be increased by 1

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable { // payable keyword is used to accept ether in the function
        uint256 amount = msg.value; // msg.value is the amount of ether sent , when calling the function , by the user

        Campaign storage campaign = campaigns[_id]; // if we know the id of the campaign, we can access the campaign by using the id as the key in the mapping

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");
        // payable(campaign.owner) is used to convert the address of the owner to a payable address, as by default solidity does not keep the address written in contract as payable
        // .call{value: amount}("")...Sends Ether (amount) to the campaign.owner using the low-level call function....The empty string ("") means no data is sent along with the transaction.
        // sent will be true if the Ether transfer succeeds.
        // sent will be false if it fails (e.g., if the recipient is a smart contract with no fallback function).
        // The second value in the tuple is ignored using the comma operator (,). The , means we don't store the second return value.

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