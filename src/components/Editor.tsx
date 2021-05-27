import React from 'react';
import Editor from 'react-simple-code-editor';
//@ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import '../styles/editor.css';

export default ({ type, code }: { type: string; code: string }) => {
  return (
    <div style={{ height: '80vh', overflowY: 'auto' }}>
      <Editor
        value={code}
        contentEditable={false}
        onValueChange={() => {}}
        highlight={(value) => highlight(value, languages[type])}
        padding={10}
        style={{
          fontFamily:
            'SFMono-Regular, Consolas, Liberation Mono, Menlo, "Fira code", "Fira Mono", monospace',
          fontSize: 18,
        }}
      />
    </div>
  );
};
