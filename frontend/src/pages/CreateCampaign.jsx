import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { parseUnits } from "ethers";

// import { useStateContext } from '../context';
import  money from '../assets/money.svg';
import { checkIfImage } from '../utils/checkIfImageFunction.js';

import createCampaign from '../store/createCampaign.js';

import FormField from '../components/FormField.jsx';
import Loader from '../components/Loader.jsx';

const CreateCampaign = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
   // const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '', 
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => { // A generic function that updates the form state whenever a user types into any input field.

    setForm({ ...form, [fieldName]: e.target.value }) // ...form: Copies the existing form values so that only the specified field is updated (not overwriting the whole state).

    // The specific field being updated (name, title, etc.)./...... e.target.value: The value entered by the user. 
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // the values entered by the user are not lost when the form is submitted... due to the default behavior of the form element ,ie to refresh the page when submitted

    checkIfImage(form.image, async (exists) => { // The checkIfImage function is called with the image URL and a callback function that receives a boolean value (exists) indicating whether the image exists or not.
      
      if(exists) {
        console.log("Submitting form..."); // 🔍 Debug log
        setIsLoading(true)


        try {
          // Get connected user's address dynamically
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress(); // Fetch the connected wallet address
  
          // Call createCampaign with correct parameters
          await createCampaign(
            userAddress, // Now automatically gets the connected wallet address
            form.title,
            form.description,
            ethers.parseUnits(form.target.toString(), 18),
            Math.floor(new Date(form.deadline).getTime() / 1000),
            form.image
          );
  
          setIsLoading(false);
          navigate('/');
          
        } catch (error) {
          console.error("Error creating campaign:", error);
          setIsLoading(false);
        }

      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
      }
    })
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">

      {isLoading && <Loader />} {/** Conditional rendering: Shows the <Loader /> component only if isLoading is true.*/}

      {/**the next div wont show until loader is stoped rendering...ie isLoading turns to false again... */}

      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name} // This line binds the value of the input field to the name property in the form state.
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField 
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField 
            labelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField 
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField 
            labelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />

        <div className="flex justify-center items-center mt-[40px]">
          <button
            type="submit"
            className="bg-[#1dc071] text-white font-epilogue font-semibold text-[16px] py-3 px-6 rounded-[10px] hover:bg-[#17a864] transition-colors duration-300"
          >
            Submit new campaign
          </button>
        </div>


      </form>
    </div>
  )
}

export default CreateCampaign