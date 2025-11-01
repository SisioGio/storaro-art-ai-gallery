import { Check, Copy, LogIn, LogInIcon, QrCode, UserIcon, X } from "lucide-react";
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react';
const GeneralQrCode = ({setShowQrCode}) => {
    const [referralId, setReferralId] = useState(null)
const [copied, setCopied] = useState(false);
  const handleLinkClick = () => {
    // setIsOpen(false); 
  };

 const saveReferralId = () => {
    localStorage.setItem('referralId', referralId);


 }
   useEffect(() => {
 
      const storedReferralId = localStorage.getItem('referralId');
      if (storedReferralId) {
        setReferralId(storedReferralId);
      }
    }, []);

const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

    
  return (
<div className="fixed  top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className=" text-white p-8 rounded-lg mb-6 text-center bg-black  flex flex-col gap-6 relative ">


  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
<div className=" text-white p-8 rounded-lg mb-6 text-center bg-black  flex flex-col gap-6 relative ">
        <h1>Your QR Code</h1>

        <X className="absolute top-1 right-1 cursor-pointer text-red-600 hover:text-red-500 transition-colors duration-200"
            onClick={() => setShowQrCode(false)}
            />
    <div className="text-center mb-6 mx-auto flex justify-center flex-col items-center gap-6">
                
                  
                  <QRCodeCanvas value={`https://storaroart.com/?ref=${localStorage.getItem('referralId')}`} size={256} />
                  
                  {/* <a href={`https://storaroart.com?refId=${referralId}`}>Link</a> */}
                <button
        variant="outline"
        size="sm"
        onClick={()=>handleCopy(`https://storaroart.com/?ref=${localStorage.getItem('referralId')}`)}
        className="flex items-center space-x-1"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </>
        )}
      </button>
                          </div>
        </div> 

</div>
</div>
   
   </div>


  )}
export default GeneralQrCode;
