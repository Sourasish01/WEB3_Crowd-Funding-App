import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { v4 as uuidv4 } from "uuid";
import { contractAddress } from "../config/connectionKeys";

import getContractInstance from "../store/contractInstance";
import getCampaigns from '../store/getCampaigns';
import FundCard from '../components/FundCard';
import loader  from '../assets/loader.svg';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);


  const fetchCampaigns = async () => {
    setIsLoading(true);

    try {

      const contract = await getContractInstance(); // Get contract instance
      if (!contract) {
        console.error("Contract instance not available.");
        setIsLoading(false);
        return;
      }

      const data = await getCampaigns(); // data is an array of formatted campaigns objects.
      // if (!data) return []; The function getCampaigns() already returns an empty array in case of an error. So, checking if (!data) return []; is unnecessary.
      setCampaigns(data);

    } catch (error) {
      console.error("Error fetching campaigns:", error);
      // return []; The function getCampaigns() already returns an empty array in case of an error.
    }

    finally {
      setIsLoading(false);
    }
    
  }


  useEffect(() => {
    fetchCampaigns(); // Call fetchCampaigns() directly
  }, [contractAddress]); // Only dependent on contractAddress
  //Kept [contractAddress] as a dependency (so it refetches if the contract address changes).



  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.id}`, { state: campaign }); 
    //When navigating, we pass the full campaign object as state.
    //This allows the CampaignDetails page to receive the campaign data immediately.
  }; 

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        All Campaigns ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && ( // If isLoading is true, it shows a loading spinner (loader image).
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />// className="w-[100px] h-[100px] object-contain" → Sets image size and ensures it doesn't stretch.
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No campaigns available.
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => ( // For each campaign, a FundCard component is rendered.
            <FundCard
            key={campaign.id} // The key prop is set to the campaign id.    //key={uuidv4()}
            {...campaign} // The spread operator ({...campaign}) means that all properties of campaign (id, owner, title, description, target, etc.) are automatically passed as individual props to FundCard.
            handleClick={() => handleNavigate(campaign)} //The handleClick function is passed, which calls handleNavigate(campaign), navigating to the campaign details page.
            />
          ))}
      </div>
    </div>
  );
};

export default Home;