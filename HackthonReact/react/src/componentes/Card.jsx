// CardComponent.jsx
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import styles from './Card.module.css'; // Adjust the path based on your file structure
import QuillEditor from './QuillEditor'; // Create a QuillEditor component


const CardComponent = ({ title, content }) => {
  const [editorContent, setEditorContent] = useState(content);

  const handleEditorChange = (value) => {
    setEditorContent(value);
  };

  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography variant="h5" component="div" className={styles.title}>
          {title}
        </Typography>
        <QuillEditor value={editorContent} onChange={handleEditorChange} />
      </CardContent>
    </Card>
  );
};

CardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default CardComponent;
