import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import items from './../../Data/images_analysis.json';
import { PlayCircle, StopCircle, ArrowLeft } from 'lucide-react';
import { useConversation } from '@elevenlabs/react';
import GeneralQrCode from './GeneralQrCode';

const Section = ({ title, content }) => (
  <section className="space-y-2">
    <h2 className="text-xl font-semibold text-white">{title}</h2>
    <p className="text-gray-300 leading-relaxed whitespace-pre-line">{content}</p>
  </section>
);

const ArtDetails = () => {
  const { title } = useParams();
  const art = items.find(item => item.title === title);
  const [playing, setPlaying] = useState(false);

  const conversation = useConversation(); // not used for now

  if (!art) {
    return (
      <div className="p-10 text-center text-red-500 text-xl">
        Artwork not found.
      </div>
    );
  }

  return (
    <main className="w-full">
      {/* Hero Image */}
      <div className="relative w-full h-[80vh]">
        <img
          src={art.s3_url}
          alt={art.title}
          className="object-cover w-full h-full"
        />

        {art.audio_url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setPlaying(!playing)}
              className={`flex items-center gap-3 px-6 py-3 text-lg font-light border border-indigo-200/40 hover:border-indigo-400 rounded-xl shadow-xl transition-all backdrop-blur-md ${
                playing ? 'bg-red-600 text-white' : 'bg-indigo-500 text-white bg-opacity-40 hover:bg-opacity-60'
              }`}
            >
              {playing ? <StopCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
              {playing ? 'Stop Presentation' : 'Start Presentation'}
            </button>
          </div>
        )}

        {playing && (
          <audio
            autoPlay
            controls
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-1/2 bg-white/80 rounded-lg shadow-lg"
          >
            <source src={art.audio_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 relative">
        <div className='flex flex-col md:flex-row  justify-between'>
<h1 className="text-4xl font-bold text-white">{art.title}</h1>
      

         <GeneralQrCode item_url={`www.storaroart.com/search=${art.store_url}&`}/>

        </div>
          
            

        <div className="space-y-10">
          <Section title="Introduction" content={art.introduction} />

          <div className="grid md:grid-cols-2 gap-10">
            <Section title="Visual Elements" content={art.artistic_elements} />
            <Section title="Storaro Techniques" content={art.artistic_techniques} />
          </div>

          <Section title="Symbolic Color Analysis" content={art.color_palette} />
          <Section title="Light Analysis" content={art.light} />
          <Section title="Framing & Composition" content={art.framing_and_composition} />
          <Section title="Atmosphere" content={art.atmosphere} />
          <Section title="Symbolism" content={art.symbolism} />
          <Section title="Artistic Impact" content={art.artistic_impact} />
          <Section title="Detailed Analysis" content={art.detailed_analysis} />
          <Section title="Historical Context" content={art.historical_context} />
          <Section title="Artistic Details" content={art.artistic_details} />
          <Section title="Artistic Inspiration" content={art.artistic_inspiration} />
        </div>

        <div className="pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Gallery
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ArtDetails;
