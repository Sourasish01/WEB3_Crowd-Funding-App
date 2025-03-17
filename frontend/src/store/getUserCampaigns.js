import getCampaigns from "./getCampaigns";
import connectWallet from "./connectWallet"; // Import the connectWallet function

const getUserCampaigns = async () => {
    try {
        const userAddress = await connectWallet(); // Get user's wallet address
        if (!userAddress) return [];

        const allCampaigns = await getCampaigns(); //get camapigns returns an array of formatted campaigns objects
        
        // Filter campaigns by matching owner address
        const userCampaigns = allCampaigns.filter(
            (campaign) => campaign.owner.toLowerCase() === userAddress.toLowerCase()
        ); // userCampaigns is an array of formatted campaigns objects owned by the current user.

        console.log(`Campaigns for ${userAddress}:`, userCampaigns);
        return userCampaigns;
        
    } catch (error) {
        console.error("Error fetching user campaigns:", error);
        return [];
    }
};

export default getUserCampaigns