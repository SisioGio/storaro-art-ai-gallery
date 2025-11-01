import { LogIn, LogInIcon, QrCode, UserIcon } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReferralLogin from "./ReferralLogin";
import GeneralQrCode from "./GeneralQrCode";
import { useSearchParams } from 'react-router-dom';
const MainNav = () => {
     const [referralId, setReferralId] = useState(null)
  
const params  = new URLSearchParams(window.location.search);
  const [isOpen, setIsOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [expandNav,setExpandNav] = useState(false);
  const handleLinkClick = () => {
    setIsOpen(false); // Close the mobile menu when a link is clicked
  };

  useEffect(() => {
    // Check if localStorage has a referralId
    console.log("Checking referral code in URL or localStorage");
    const ref = params.get('ref');
    console.log("Referral code from URL:", ref);
    if (ref) {
      console.log(`Referral code from URL: ${ref}`);
      setReferralId(ref);
      localStorage.setItem('referralId', ref); // Save to localStorage
    } else {
      const storedReferralId = localStorage.getItem('referralId');
      console.log("Stored Referral ID:", storedReferralId);
      if (storedReferralId) {
        setReferralId(storedReferralId);
      }
    }

  },[])

  return (
    <nav className="custom-gradient-nav fixed top-0 left-0 w-full shadow-xl h-20 z-50 rounded-b-md bg-black">
      <div className=" mx-auto flex justify-around items-center px-6 h-full">
        {/* Logo */}
        <a
          href="/#home"
          className="text-3xl font-extrabold text-white tracking-wide hover:text-yellow-400 transition duration-300 transform"
        >
          <span className="text-white neon-text text-shadow-xl">StoraroArt Gallery</span>
        </a>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-3xl focus:outline-none hover:text-yellow-400 transition duration-300"
          onClick={() => setExpandNav(!expandNav)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

       
        <ul
  className={`z-30 absolute md:static top-20 left-0 w-full md:w-auto bg-black md:bg-transparent md:flex md:items-center md:space-x-6 px-6 py-4 md:px-0 transition-all duration-300 ease-in-out 
  ${expandNav ? 'block' : 'hidden'} md:block`}
>

  <li className="py-3 px-2  text-center hover:text-gold transition duration-300 transform  relative hover:bg-gray-500 rounded-lg hover:bg-opacity-30 ">
    <a href="/#"  className="text-white items-center text-xl font-light hover:text-blue-300 text-center">
      <QrCode onClick={()=>setShowQrCode(true)} className="mx-auto"/>
      
    </a>
  
  </li>


  <li className="py-3 px-2 flex gap-2 text-light items-center  text-center hover:text-gold transition duration-300 transform  relative hover:bg-gray-500 rounded-lg hover:bg-opacity-30 ">
    
    
      <UserIcon className="inline-block text-white" />
     

     <input type='text' className={`bg-opacity-10 bg-white rounded-md text-gray-300 focus:outline-none border p-2 ${!referralId?' border-red-400/40':"border-green-300/40"}`} value={referralId} onChange={(e)=>(setReferralId(e.target.value),localStorage.setItem('referralId',e.target.value))}/>
      

     
  
  </li>


     

     
   
</ul>

      </div>
          {/* {isOpen && (
          <ReferralLogin setIsOpen={setIsOpen}/>  
        )
          } */}

          {showQrCode && (
            <GeneralQrCode setShowQrCode={setShowQrCode}/>
          )}

        
      
    </nav>
  );
};

export default MainNav;
