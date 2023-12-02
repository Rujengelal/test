import { useState } from 'react';
import NavBar from "./componentes/NavBar";
import Form from "./componentes/Form";
import Card from "./componentes/Card";
import {Stack} from "@mui/material";
import sampleAudio from './assets/sample_audio.mp3'
import AudioLink from './componentes/AudioLink';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';

function App() {
  const [showCard, setShowCard] = useState(false);
  const [audioURL, setAudioURL] = useState(sampleAudio);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiConvertResponse, setApiConvertResponse] = useState(null);
  const [apiAudioGenerateResponse, setApiAudioGenerateResponse] = useState(null);
  const [formData, setFormData] = useState({ option1: '', option2: '', option3: '', option4: '' });

  const handleSubmit = async (formData) => {
    try {
      const url = new URL('http://localhost:5000/generate');

      // Include query parameters in the URL
      url.searchParams.append('hedis', formData.option1);
      url.searchParams.append('form', formData.option2);
      url.searchParams.append('to', formData.option3);
      url.searchParams.append('type', formData.option4);
      console.log(url);
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }

      const responseData = await response.json();

      // Handle the API response data as needed
      // console.log("response data",responseData);

      // Set the API response data to the state
      setApiResponse(responseData);

      // console.log("form data",formData);
      // Set form data to the state
      setFormData(formData);

      // For demonstration purposes, let's just toggle the visibility of the card
      setShowCard(true);
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error as needed
    }
  };

  const handleConvertClick = async () => {
    try {
      if (!apiResponse) {
        console.error('No API response available for conversion');
        return;
      }

      // Assuming your conversion API endpoint is 'https://example.com/convert'
      const url = new URL('http://localhost:5000/translation');
      url.searchParams.append('text', apiResponse.data);

      const convertResponse = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!convertResponse.ok) {
        throw new Error('Failed to convert data');
      }

      // Handle the conversion API response as needed
      const convertedData = await convertResponse.json();
      console.log('Converted Data:', convertedData);

      // Set the API response data to the state
      setApiConvertResponse(convertedData);
    } catch (error) {
      console.error('Conversion Error:', error.message);
      // Handle conversion error as needed
    }
  };

  const handelAudioGenerateClick = async () => {
    try  {
      const url = new URL('http://localhost:5000/generate-audio');
      url.searchParams.append('text', apiResponse.data);
      url.searchParams.append('lang', 'en');

      const audioResponse = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!audioResponse.ok) {
        throw new Error('Failed to generate audio');
      }

      // Handle the audio generate API response as needed
      const audioGeneratedData = await audioResponse.json();
      console.log('Audio data:', audioGeneratedData.data);

      const trimmedAudioData = audioGeneratedData.data.split(' ');
      setAudioURL(trimmedAudioData[4]);
      console.log('Trimmed data', audioURL);

      setApiAudioGenerateResponse(audioGeneratedData);
    } catch (error) {
      console.error('Audio Generation Error:', error.message)
    }
  }

  return (
    <main>
      <NavBar />
      <div style={{ display: 'grid', gridTemplateColumns: '30% 70%', gap: '20px' }}>
        <Form onSubmit={handleSubmit} />
        {showCard && (
          <>
          <Stack style={{width: '90%'}}>
          <Stack direction="row" spacing={2}>
          <Card
            title={"AI Generated " + formData.option4}
            content={apiResponse?.data || "This is the content for the card."}
          />
          <Button style = {{height: '50px'}} variant="contained" color="primary" onClick={handelAudioGenerateClick}>
              Generate Audio
            </Button>
          </Stack>
          <Button variant="contained" color="primary" onClick={handleConvertClick}>
              Convert
            </Button>
            <TextareaAutosize
              value={apiConvertResponse?.data || "Converted data will appear here."}
              rowsMin={4}
              style={{ height: '50px', padding: '10px', marginTop: '10px' }}
              readOnly
            />
          <Stack direction='row' justifyContent='center' style={{width:'100%', padding: '20px'}}>
            <AudioLink audioUrl={audioURL} />
          </Stack>
          </Stack>  
          </>
        )}
      </div>
    </main>
  );
}

export default App;
