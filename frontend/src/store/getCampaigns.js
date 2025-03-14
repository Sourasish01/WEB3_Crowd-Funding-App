import getContractInstance from "./contractInstance";

const getCampaigns = async () => {
    try {
        const contractInst = await getContractInstance();
        if (!contractInst) return [];

        const camps = await contractInst.getCampaigns(); // camps is an array of struct "Campaign"


        //The formattedCampaigns variable is an array of objects, where each object represents a formatted campaign with human-readable data.
        const formattedCampaigns = camps.map((campaign, index) => ({ //campaigns.map(...) → Loops through each campaign in the camps array
        //(campaign, index) => ({ ... }) → Takes each campaign object and formats it into a new structure.
        //campaign :	The current campaign from the camps array.
        //index :	The index of the current campaign in the camps array.

            id: index,
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target: campaign.target.toString(), // Convert BigNumber to string
            deadline: campaign.deadline.toString(),
            amountCollected: campaign.amountCollected.toString(),
            image: campaign.image,
        }));

        console.log("Campaigns:", formattedCampaigns); // Logs the formatted campaigns array for debugging.
        return formattedCampaigns;
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
};

export default getCampaigns;



/*

📌 Example Input (campaigns Array)

camps:
[
    {
        "owner": "0x123...",
        "title": "Help Build a School",
        "description": "Fundraising for a school.",
        "target": "5000000000000000000",
        "deadline": "1715000000",
        "amountCollected": "2000000000000000000",
        "image": "https://example.com/image.jpg"
    },
    {
        "owner": "0x456...",
        "title": "Save the Forests",
        "description": "Protecting rainforests.",
        "target": "3000000000000000000",
        "deadline": "1718000000",
        "amountCollected": "1000000000000000000",
        "image": "https://example.com/forest.jpg"
    }
]

📌 Output (formattedCampaigns Array)

formattedCampaigns:
[
    {
        "id": 0,
        "owner": "0x123...",
        "title": "Help Build a School",
        "description": "Fundraising for a school.",
        "target": "5000000000000000000",
        "deadline": "1715000000",
        "amountCollected": "2000000000000000000",
        "image": "https://example.com/image.jpg"
    },
    {
        "id": 1,
        "owner": "0x456...",
        "title": "Save the Forests",
        "description": "Protecting rainforests.",
        "target": "3000000000000000000",
        "deadline": "1718000000",
        "amountCollected": "1000000000000000000",
        "image": "https://example.com/forest.jpg"
    }
]
    
    */
