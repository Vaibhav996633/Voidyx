import React, { useMemo, useRef } from 'react';
import { AnimationEntry } from '../types';

interface SandboxProps {
  animation: AnimationEntry;
  className?: string;
  isThumbnail?: boolean;
  currentConfig?: Record<string, any>;
}

const Sandbox: React.FC<SandboxProps> = ({ animation, className, isThumbnail = false, currentConfig }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const configString = useMemo(() => JSON.stringify(currentConfig || {}), [currentConfig]);

  const srcDoc = useMemo(() => {
    const scripts = (animation.cdnLinks || []).map(link => `<script src="${link}"></script>`).join('\n');
    const cleanJs = animation.js.replace(/import.*?;/g, '').replace(/export.*?;/g, '').trim();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html, body { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background: #000; }
            ${animation.css}
            ${isThumbnail ? 'body { pointer-events: none; }' : ''}
          </style>
          ${scripts}
          <script>window.VANTA_CONFIG = ${configString};</script>
        </head>
        <body>
          ${animation.html}
          <script>
            (function() { 
              try { 
                ${cleanJs} 
                window.addEventListener('resize', () => {
                  if (typeof renderer !== 'undefined' && renderer.setSize) {
                    renderer.setSize(window.innerWidth, window.innerHeight);
                  }
                  if (typeof camera !== 'undefined' && camera.aspect) {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                  }
                });
              } catch (err) { 
                console.error('Sandbox Execution Error:', err); 
              } 
            })();
          </script>
        </body>
      </html>
    `;
  }, [animation.id, configString, isThumbnail]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-black ${className}`}>
      <iframe 
        ref={iframeRef} 
        srcDoc={srcDoc} 
        className="w-full h-full border-none block opacity-0 transition-opacity duration-500" 
        sandbox="allow-scripts"
        onLoad={() => {
          if (iframeRef.current) {
            iframeRef.current.style.opacity = '1';
          }
        }}
      />
      {isThumbnail && <div className="absolute inset-0 z-10 bg-transparent cursor-pointer" />}
    </div>
  );
};

export default Sandbox;