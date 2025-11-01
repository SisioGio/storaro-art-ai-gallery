import { LogIn, LogInIcon, UserIcon, X } from "lucide-react";
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
const ReferralLogin = ({setIsOpen}) => {
    const [referralId, setReferralId] = useState(null)


  const handleLinkClick = () => {
    setIsOpen(false); // Close the mobile menu when a link is clicked
  };

 const saveReferralId = () => {
    // Save the referralId to localStorage  
    localStorage.setItem('referralId', referralId);
    setIsOpen(false);
    window.location.reload(); // Reload the page to apply the changes

 }
   useEffect(() => {
   
      // Check if localStorage has a referralId
      const storedReferralId = localStorage.getItem('referralId');
      if (storedReferralId) {
        setReferralId(storedReferralId);
      }
   
  

      
    }, []);



  return (
<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className=" text-white p-8 rounded-lg mb-6 text-center bg-black  flex flex-col gap-6 relative ">

    <X className="absolute top-1 right-1 cursor-pointer text-red-600 hover:text-red-500 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
            />
          <h1 className="text-2xl">Enter here your referral code</h1>
            <input className="mt-2 p-2 rounded-lg border border-gray-300 w-full max-w-xs text-gray-500"
            type="text"
            placeholder="Enter your referral code"
            
            name='referralId'  value={referralId} onChange={(e) => setReferralId(e.target.value)}/>
            <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg  hover:bg-green-700 transition-colors duration-200"
            onClick={() => saveReferralId()}
            >Save Referral Code</button>
        </div> 

</div>

  )}
export default ReferralLogin;
