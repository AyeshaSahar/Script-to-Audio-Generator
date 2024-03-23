"use client";
import { useState } from 'react';
import axios from 'axios';

export default function Audio() {
  const [script, setScript] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const API_URL =  'http://localhost:8000/generate-audio';

  const handleGenerateAudio = async () => {
    setDownloading(true);
    setDownloadUrl(''); 
    try {
      const formData = new FormData();
      formData.append('script', script);

      const response = await axios.post(API_URL, formData);
      if (response.data.url) {
       
        setDownloadUrl(`http://localhost:8000${response.data.url}`); 
        console.log(downloadUrl);
      } else {
        console.error('No URL received from the server');
      }
    } catch (error:any) {
      console.error('Failed to generate audio', error.response ? error.response.data : error.message);
    } finally {
      setDownloading(false);
    }
};



  return (
    <div className='w-full flex items-center justify-center flex-col'>
      <textarea
        className="w-full max-w-xl mb-4 text-black border-2 border-gray-600 p-2 h-64 rounded-lg"
        placeholder="Enter your script here..."
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />
      <button
        className={`${downloading ? 'loading' : ''} bg-black p-2 rounded-lg text-white`}
        onClick={handleGenerateAudio}
        disabled={downloading}
      >
        {downloading ? 'Generating...' : 'Generate Audio'}
      </button>
      {downloadUrl && (
        <a className="mt-4 bg-black p-2 rounded-lg text-white" href={downloadUrl} download>Download Audio</a>
      )}
    </div>
  );
}





