import { Check, Copy, LogIn, LogInIcon, QrCode, UserIcon, X } from "lucide-react";
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react';
const GeneralQrCode = ({title,item_url}) => {
    const [referralId, setReferralId] = useState(null)
    const [open,setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
      const handleLinkClick = () => {
        // setIsOpen(false); 
      };

 const saveReferralId = () => {
    localStorage.setItem('referralId', referralId);


 }
   useEffect(() => {
 
      const storedReferralId = localStorage.getItem('referralId');
      console.log("Stored Referral ID:", storedReferralId);
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

  if(!open){
    return (
      <button onClick={()=>(setOpen(true),console.log("Opening"))} className="border  flex gap-2  text-gray-300 px-4 py-2 rounded-full text-center hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <p>{title}</p>
              <QrCode className='mx-auto'/>
            </button>
    )
  }

    
  return (
<div className="absolute  top-0 left-0 w-full   bg-black bg-opacity-50 flex items-top justify-center z-50">
<div className=" text-white p-8 rounded-lg mb-6 text-center bg-black  flex flex-col gap-6 relative ">


 
<div className=" text-white p-8 rounded-lg mb-6 text-center  flex flex-col gap-6 relative ">
        <h1>Item QR Code</h1>

        <X className="absolute top-1 right-1 cursor-pointer text-red-600 hover:text-red-500 transition-colors duration-200"
            onClick={() => setOpen(false)}
            />
    <div className="text-center mb-6 mx-auto flex justify-center flex-col items-center gap-6">
                
                  
                  <QRCodeCanvas value={`${item_url}ref=${localStorage.getItem('referralId')}`} size={256} />
                  
                  {/* <a href={`https://storaroart.com?refId=${referralId}`}>Link</a> */}
                <button
        variant="outline"
        size="sm"
        onClick={()=>handleCopy(`${item_url}ref=${localStorage.getItem('referralId')}`)}
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
   



  )}
export default GeneralQrCode;
