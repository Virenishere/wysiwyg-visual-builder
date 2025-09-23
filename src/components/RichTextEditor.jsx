// 'use client';
// import React, { useRef } from 'react';
// import { Editor } from '@tinymce/tinymce-react';

// export default function RichTextEditor({
//   value,
//   onChange,
//   height = 200,
//   placeholder = 'Start typing...',
// }) {
//   const editorRef = useRef(null);

//   const handleEditorChange = (content, editor) => {
//     onChange(content);
//   };

//   return (
//     <div className="w-full">
//       <Editor
//         apiKey="wto9dtjhch17bpvr3jk7x0q14kt2wyv17ob13ujh7eqd49mu"
//         onInit={(evt, editor) => (editorRef.current = editor)}
//         value={value}
//         onEditorChange={handleEditorChange}
//         init={{
//           height: height,
//           menubar: false,
//           plugins: [
//             'advlist',
//             'autolink',
//             'lists',
//             'link',
//             'image',
//             'charmap',
//             'preview',
//             'anchor',
//             'searchreplace',
//             'visualblocks',
//             'code',
//             'fullscreen',
//             'insertdatetime',
//             'media',
//             'table',
//             'code',
//             'help',
//             'wordcount',
//             'textcolor',
//             'colorpicker',
//             'autoresize',
//           ],
//           toolbar:
//             'undo redo | blocks | ' +
//             'bold italic forecolor backcolor | alignleft aligncenter ' +
//             'alignright alignjustify | bullist numlist outdent indent | ' +
//             'removeformat | help',
//           content_style:
//             'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
//           placeholder: placeholder,
//           branding: false,
//           statusbar: false,
//         }}
//       />
//     </div>
//   );
// }
