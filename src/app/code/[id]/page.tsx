'use client';

import { useEffect, useState } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { Console } from '@/components/Console';

interface CodePageProps {
  params: {
    id: string;
  };
}

export default function CodePage({ params }: CodePageProps) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch code by ID when component mounts
    const fetchCode = async () => {
      try {
        const response = await fetch(`/api/code/${params.id}`);
        const data = await response.json();
        setCode(data.code);
      } catch (error) {
        console.error('Error fetching code:', error);
      }
    };

    fetchCode();
  }, [params.id]);

  const handleExecute = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');
    
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      console.error('Error executing code:', error);
      setError('Error executing code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <CodeEditor
        code={code}
        onCodeChange={setCode} // Changed from setCode={setCode}
        language="python"
      />
      <button
        onClick={handleExecute}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Run Code
      </button>
      <Console output={output} error={error} isLoading={isLoading} />
    </div>
  );
}