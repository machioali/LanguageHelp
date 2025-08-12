'use client';

import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { useTheme } from 'next-themes';

export interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  language?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export function CodeEditor({
  code,
  onCodeChange,
  language = 'python',
  readOnly = false,
  placeholder = 'Enter your code here...'
}: CodeEditorProps): React.ReactElement {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [localCode, setLocalCode] = useState<string>(code);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalCode(code);
  }, [code]);

  if (!mounted) {
    return (
      <div className="w-full h-64 bg-muted rounded-md animate-pulse" />
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <CodeMirror
        value={localCode}
        onChange={(value: string) => {
          setLocalCode(value);
          onCodeChange(value);
        }}
        extensions={[python()]}
        theme={theme === 'dark' ? oneDark : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: false,
        }}
        className="text-sm"
      />
    </div>
  );
}