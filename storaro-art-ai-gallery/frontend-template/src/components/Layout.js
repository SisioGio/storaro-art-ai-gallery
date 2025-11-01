import React from "react";

import MainNav from "./mainNav"; // Adjust the import path as necessary
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-indigo-800">
    <div id='header' >
    <MainNav/>
    </div>
  
  
    <div
  id="main-container"
  className="flex-grow relative bg-gradient-to-b from-gray-900 via-black to-gray-800"
  style={{ paddingTop: "5rem" }}
>
  {/* subtle textured overlay */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "radial-gradient(circle at center, rgba(255,255,255,0.03) 1px, transparent 1px), repeating-linear-gradient(45deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 2px, transparent 2px, transparent 6px)",
      backgroundSize: "20px 20px, 4px 4px",
      zIndex: 0,
    }}
  />
  
  {/* Your content on top */}
  <div className="relative z-10">
    {children}
  </div>
</div>

    <footer className="bg-black text-white text-center py-3">
  <div className="container mx-auto px-6">
    {/* Footer Content */}
    <p className="text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-800 font-semibold ">
      &copy; 2025 <span className="font-semibold">StoraroArt.Finbotix</span> developed by Alessio Giovannini Finbotix. All rights reserved.
    </p>
  </div>
    
</footer>


  </div>
  );
};

export default Layout;
