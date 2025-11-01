import React, { useState,useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/general/Home";
import NotFound from "./pages/general/NotFound";
import ArtDetails from './pages/general/ArtDetails';



const App = () => {




  return (


     
<Layout>
   
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path='/artwork/:title' element={<ArtDetails />} />
         
         
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Layout>
   
  );
};

export default App;
