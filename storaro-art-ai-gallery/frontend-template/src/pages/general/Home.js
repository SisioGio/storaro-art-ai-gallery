import React, { useEffect, useState } from 'react';

// Import items from file 'items.json'
import items from './../../Data/images_analysis.json'; // Adjust the path as necessary
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode } from 'lucide-react';
import GeneralQrCode from './GeneralQrCode';


const Home = () => {
  const [referralId,setReferralId] = useState(null);
  useEffect(() => {
    // Check if localStorage has a referralId
    const storedReferralId = localStorage.getItem('referralId');
    if (storedReferralId) {
      setReferralId(storedReferralId);
    }
  }, []);
 

  return (
    <div className="bg-gradient-to-br min-h-screen text-white font-sans  pt-6 mx-auto" id='home'>

      
        
         {/* {referralId && 
         <div className="text-center mb-6 mx-auto flex justify-center flex-col items-center">
            
              
              <QRCodeCanvas value={`https://storaroart.com?refId=${referralId}`} size={126} />
              
              <a href={`https://storaroart.com?refId=${referralId}`}>Link</a>
            
                      </div>
            } */}

          
    <Gallery  artPieces={items} referralId={referralId}/>

    </div>
  );
};

export default Home;


const Gallery = ({artPieces,referralId}) => {
  return (
    <div className="w-full items-stretch overflow-x-auto  py-6 px-4 flex gap-6 justify-center flex-wrap">
      {artPieces.map((art, index) => (
        <div
          key={index}
          className="
          relative
    min-w-[300px] max-w-sm 
    bg-white
    bg-opacity-10
    shadow-2xl shadow-black/20 
    rounded-3xl 
    overflow-hidden 
    flex flex-col
    
    transition-transform duration-300 ease-in-out
    hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
    text-gray-200
  "
        >
          <img
            src={art.s3_url}
            alt={art.title}
            className="w-full h-64 object-cover"
          />
          <div className='flex flex-col gap-2 p-2 flex-grow'>


            <h2 className="text-xl font-bold  truncate">{art.title}</h2>
           
              {art.audio_url && (
               
            <audio controls className=" w-full">
              <source src={art.audio_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>

              )} 
            


            <div className='flex flex-col gap-1 flex-grow'>
              {art.location.map((location)=>{
                return (
                <p className='rounded-xl px-2 text-sm bg-opacity-30 py-1 bg-gray-600'>{location}</p>
                )
                
            })}
              </div>
            
            <Link
              to={`/artwork/${art.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border   text-gray-300 px-4 py-2 rounded-full text-center hover:bg-blue-600 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Details
            </Link>

            <div className='flex justify-around  gap-2'>
            <GeneralQrCode title = {"To the Store"} item_url={`www.storaroart.com/search?q=${art.store_url}&`}/>

            <GeneralQrCode title = {"To the Gallery"}  item_url={`www.vsvision.storaroart.com/artwork/${art.title}?`}/>
            
              </div>

            

            {/* {referralId && (
              <QRCodeCanvas value={`https://storaroart.com?refId=${referralId}`} size={126} />
            )
            } */}

             
            
          
</div>
          
        </div>
      ))}
    </div>
  );
};
const ItemCard =({artwork})=> {
  return (
    <div className="max-w-5xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
      <p className="text-gray-600 italic mb-4">{artwork.meta.title}</p>
    <img src={artwork.aws_url} alt={artwork.title} className="w-full h-auto rounded-lg mb-4 shadow-lg" />
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Visual Elements</h2>
        
        <ul className="list-disc list-inside text-gray-700">
          {artwork.imagery.visual_elements && artwork.imagery.visual_elements.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Color Theme</h2>
        <p className="text-blue-700 font-medium">{artwork.theme.color_theme}</p>
        <div className="mt-2">
          <h3 className="font-medium">Primary Colors:</h3>
          <ul className="list-disc list-inside">
            {artwork.theme.color_analysis && artwork.theme.color_analysis.primary_colors.map((color, index) => (
              <li key={index}>{color}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Storaro Techniques</h2>
        <ul className="list-disc list-inside text-gray-700">
          {artwork.techniques.storaro_techniques && artwork.techniques.storaro_techniques.map((technique, index) => (
            <li key={index}>{technique}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Long Description</h2>
        <p className="text-gray-800 whitespace-pre-line">{artwork.description.long_description}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Hashtags</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {artwork.hashtags.related.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
