'use client';

import { useEffect, useRef } from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface ConsoleProps {
  output: string;
  error: string;
  isLoading: boolean;
}

export function Console({ output, error, isLoading }: ConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output, error]);

  return (
    <div className="border rounded-md bg-background">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted">
        <h3 className="text-sm font-medium">Console Output</h3>
        {isLoading && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Running...</span>
          </div>
        )}
      </div>
      <div
        ref={consoleRef}
        className="h-64 overflow-y-auto p-4 font-mono text-sm"
      >
        {isLoading && !output && !error && (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Executing code...</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-start space-x-2 text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <pre className="whitespace-pre-wrap break-words">{error}</pre>
          </div>
        )}
        
        {output && (
          <div className="flex items-start space-x-2 text-foreground">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-500" />
            <pre className="whitespace-pre-wrap break-words">{output}</pre>
          </div>
        )}
        
        {!isLoading && !output && !error && (
          <div className="text-muted-foreground italic">
            No output yet. Run your code to see results here.
          </div>
        )}
      </div>
    </div>
  );
}