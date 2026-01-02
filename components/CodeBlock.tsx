
import React, { useState } from 'react';

interface CodeBlockProps {
  label: string;
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ label, code, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col mb-6 group">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{label}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? (
            <span className="text-emerald-400">Copied ✓</span>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <pre className="glass p-4 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed text-zinc-300 max-h-[400px]">
          <code>{code}</code>
        </pre>
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 pointer-events-none group-hover:ring-white/10 transition-colors"></div>
      </div>
    </div>
  );
};

export default CodeBlock;
