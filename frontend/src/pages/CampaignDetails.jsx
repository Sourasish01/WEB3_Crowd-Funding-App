import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { contractAddress } from "../config/connectionKeys";
import getContractInstance from "../store/contractInstance";
import getDonators from '../store/getDonators';
import donateToCampaign from '../store/donateToCampaign';

import { daysLeft } from '../utils/daysLeftFunction';
import { calculateBarPercentage } from '../utils/calculateBarPercentage';

import Loader from '../components/Loader.jsx';
import CountBox from '../components/CountBox.jsx';


//import { CountBox, CustomButton, Loader } from '../components';
// import { calculateBarPercentage, daysLeft } from '../utils';
//import { thirdweb } from '../assets';

const CampaignDetails = () => {
  
  const { state } = useLocation(); // useLocation() is a React Router hook that gives you access to the current location object.
  //  The { state } inside it is used to retrieve data passed from the previous page when navigating to CampaignDetails, from Home.

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);


  const remainingDays = daysLeft(state.deadline);

  
  const fetchDonators = async () => {
    //setIsLoading(true);
    try {
      const contract = await getContractInstance(); // Get contract instance
      if (!contract) {
        console.error("Contract instance not available.");
        // setIsLoading(false);
        return;
      }
      const data = await getDonators(state.pId);// // data is an array of formatted campaigns objects.
      /**
       Returns the parsedDonations array, which contains objects like:
        [
          { "donator": "0x123...", "donation": "0.5" },
          { "donator": "0x456...", "donation": "1.2" }
        ]
       */

        // // if (!data) return []; The function getDonators() already returns an empty array in case of an error. So, checking if (!data) return []; is unnecessary.
      setDonators(data);
  }

  catch (error) {
    console.error("Error fetching campaigns:", error);
    // return []; The function getDonators() already returns an empty array in case of an error.
  }

  finally {
    // setIsLoading(false);
  }
  
}

  useEffect(() => {
    fetchDonators();
  }, [contractAddress]);


  const handleDonate = async () => {
    setIsLoading(true);

    await donateToCampaign(state.id, amount); 

    navigate('/')
    setIsLoading(false);
  }


  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Days Left" value={remainingDays} />
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
              </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>

              <div className="mt-[20px] flex flex-col gap-4">
                {donators.length > 0 ? donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p>
                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
                )}
              </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>   

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input 
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
              </div>

              <button
                type="button"
                className="w-full bg-[#8c6dfd] font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px]"
                onClick={handleDonate}
              >
                Fund Campaign
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails


/**✅ Example Flow
 * 
Home.jsx :
User clicks on a campaign (id: 123).
navigate(/campaign-details/123, { state: campaign }) runs.

CampaignDetails.jsx :
Extracts state using useLocation().
Displays campaign-specific info like title, description, and funds raised.
Calls fetchDonators(state.id) to get donation history for that campaign.

 */