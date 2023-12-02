import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
} from '@mui/material';

// eslint-disable-next-line react/prop-types
const MyForm = ({onSubmit}) => {
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [hedisMeasureOptions, setHedisMeasureOptions] = useState([]);
  // const [bucketOptions, setBucketOptions] = useState([]);

  useEffect(() => {
    const fetchHedisMeasureOptions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/hedis_measure');
        const data = await response.json();
  
        // Log the received data to check its structure
        console.log('API Response:', data);
  
        // Assuming the response structure is { "hedis_measure_names": [...] }
        const options = data.hedis_measure_names || [];
  
        setHedisMeasureOptions(options);
      } catch (error) {
        console.error('Error fetching Hedis Measure options:', error);
      }
    };
    // const fetchBucketOptions = async () => {
    //     try {
    //       const response = await fetch('http://127.0.0.1:5000/api/bucket');
    //       const data = await response.json();
    
    //       // Log the received data to check its structure
    //       console.log('API Response:', data);
    
    //       // Assuming the response structure is { "bucket_names": [...] }
    //       const options = data.bucket_names || [];
    
    //       setBucketOptions(options);
    //     } catch (error) {
    //       console.error('Error fetching Hedis Measure options:', error);
    //     }
    // };
    fetchHedisMeasureOptions();
    // fetchBucketOptions();
  }, []); // Run once when the component mounts

  const handleOption1Change = (event) => {
    setOption1(event.target.value);
  };

  const handleOption2Change = (event) => {
    setOption2(event.target.value);
  };

  const handleOption3Change = (event) => {
    setOption3(event.target.value);
  };

  const handleOption4Change = (event) => {
    setOption4(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Gather form data
    const formData = {
      option1,
      option2,
      option3,
      option4
    };

    // Call the parent component's callback
    if (onSubmit) {
      onSubmit(formData);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 5, marginLeft: 5 }}>
        <InputLabel id="option1-label">Select Hedis Measure</InputLabel>
        <Select
          labelId="option1-label"
          id="option1"
          value={option1}
          label="Select Hedis Measure"
          onChange={handleOption1Change}
          sx={{ width: '200px' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {hedisMeasureOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: 2, marginLeft: 5 }}>
        <InputLabel id="option2-label">Select Age From</InputLabel>
        <Select
          labelId="option2-label"
          id="option2"
          value={option2}
          label="Select Age From"
          onChange={handleOption2Change}
          sx={{ width: '200px' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="5">5</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="15">15</MenuItem>
          <MenuItem value="20">20</MenuItem>
          <MenuItem value="25">25</MenuItem>
          <MenuItem value="30">30</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: 2, marginLeft: 5 }}>
        <InputLabel id="option3-label">Select Age From</InputLabel>
        <Select
          labelId="option3-label"
          id="option3"
          value={option3}
          label="Select Age To"
          onChange={handleOption3Change}
          sx={{ width: '200px' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="15">15</MenuItem>
          <MenuItem value="20">20</MenuItem>
          <MenuItem value="25">25</MenuItem>
          <MenuItem value="30">30</MenuItem>
          <MenuItem value="35">35</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: 2, marginLeft: 5 }}>
        <InputLabel id="option4-label">Select Type</InputLabel>
        <Select
          labelId="option4-label"
          id="option4"
          value={option4}
          label="Select Type"
          onChange={handleOption4Change}
          sx={{ width: '200px' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="sms">SMS</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary" sx={{ marginLeft: 5 }}>
        Submit
      </Button>
    </form>
  );
};

export default MyForm;
