// QuillEditor.jsx
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import styles from './QuillEditor.module.css'; // Adjust the path based on your file structure


// eslint-disable-next-line react/prop-types
const QuillEditor = ({ value, onChange }) => {
  return (
    <div>
      <ReactQuill
       className={styles.quill}
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        }}
      />
    </div>
  );
};

export default QuillEditor;
