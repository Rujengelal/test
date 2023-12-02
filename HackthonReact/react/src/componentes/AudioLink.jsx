import {  Typography, Paper } from '@mui/material';

// eslint-disable-next-line react/prop-types
const AudioLink = ({audioUrl}) => {
  

  return (
    <Paper style={{ padding: 16 }}>
      <Typography variant="h6">Audio Link</Typography>
      <audio controls src={audioUrl} type="audio/mp3">
        {/* <source src={audioUrl} type="audio/mp3" /> */}
        Your browser does not support the audio tag.
      </audio>
    </Paper>
  );
};
export default AudioLink