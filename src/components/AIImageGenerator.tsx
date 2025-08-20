import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

const AIImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('1024x1024');
  const [model, setModel] = useState('img3');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    
    const apiKey = "infip-1baae467";
    const url = "/api/v1/images/generations";

    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    };

    const payload = {
      model: model,
      prompt: prompt,
      n: 1,
      size: size
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: data.data[0].url,
          prompt: prompt
        };
        setImages(prev => [newImage, ...prev]);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      // Method 1: Try direct download with proxy
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
      
      try {
        const response = await fetch(proxyUrl);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const cleanPrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
          link.download = `ai-generated-${cleanPrompt}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          return;
        }
      } catch (proxyError) {
        console.log('Proxy method failed, trying direct method...');
      }

      // Method 2: Try direct download (might work in some cases)
      try {
        const response = await fetch(imageUrl, {
          mode: 'no-cors',
          method: 'GET'
        });
        
        // If we get here, try to open in new tab as fallback
        window.open(imageUrl, '_blank');
      } catch (directError) {
        console.log('Direct method failed, using fallback...');
      }

      // Method 3: Final fallback - open image in new tab
      window.open(imageUrl, '_blank');
      
    } catch (error) {
      console.error('Error downloading image:', error);
      // Last resort fallback
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* Header */}
        <header className="text-center mb-20">
          <h1 className="text-7xl md:text-8xl font-black text-black mb-6 tracking-tight leading-none">
            DREAM
          </h1>
          <h2 className="text-7xl md:text-8xl font-black text-black mb-8 tracking-tight leading-none">
            PIXELS
          </h2>
          <div className="w-24 h-0.5 bg-black mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Create stunning visuals with artificial intelligence. 
            Professional quality images for editorial, commercial, and creative projects.
          </p>
        </header>

        {/* Generation Form */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="space-y-12">
            {/* Prompt Input */}
            <div className="text-center">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision..."
                  className="w-full text-2xl font-light text-black placeholder-gray-400 bg-transparent border-0 border-b-2 border-gray-200 focus:border-black focus:outline-none pb-4 text-center transition-colors duration-300"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && generateImage()}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="bg-transparent border-0 border-b border-gray-300 focus:border-black focus:outline-none text-black font-medium py-1 px-2"
                  disabled={loading}
                >
                  <option value="512x512">512×512</option>
                  <option value="1024x1024">1024×1024</option>
                  <option value="2048x2048">2048×2048</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-transparent border-0 border-b border-gray-300 focus:border-black focus:outline-none text-black font-medium py-1 px-2"
                  disabled={loading}
                >
                  <option value="img2">IMG-2</option>
                  <option value="img3">IMG-3</option>
                  <option value="img4">Imagen 4</option>
                  <option value="qwen">Qwen</option>
                  <option value="uncen">Uncensored</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={generateImage}
                disabled={loading || !prompt.trim()}
                className="group relative text-2xl font-light text-black hover:text-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 px-8 py-2">
                  {loading ? 'GENERATING' : 'GENERATE'}
                </span>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-black" />
              <span className="text-lg font-light text-black">Creating your masterpiece</span>
            </div>
            <div className="w-32 h-0.5 bg-gray-200 mx-auto overflow-hidden">
              <div className="h-full bg-black animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Generated Images Grid */}
        {images.length > 0 && (
          <div>
            <div className="text-center mb-16">
              <h3 className="text-4xl font-black text-black mb-4 tracking-tight">
                GALLERY
              </h3>
              <div className="w-16 h-0.5 bg-black mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {images.map((image, index) => (
                <div key={image.id} className="group">
                  <div className="relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
                    {/* Magazine Cover Style */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      {/* Magazine-style overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Issue number */}
                      <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-xs font-bold tracking-wider">
                        #{String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                    
                    {/* Magazine info bar */}
                    <div className="p-6 bg-white">
                      <p className="text-sm text-gray-600 font-light mb-4 line-clamp-2 leading-relaxed">
                        {image.prompt}
                      </p>
                      
                      <button
                        onClick={() => downloadImage(image.url, image.prompt)}
                        className="group/btn flex items-center gap-2 text-black hover:text-gray-600 transition-colors duration-300"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">Download</span>
                        <div className="w-0 group-hover/btn:w-8 h-0.5 bg-black transition-all duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {images.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-black text-black mb-4 tracking-tight">
                READY TO CREATE
              </h3>
              <div className="w-12 h-0.5 bg-black mx-auto mb-6"></div>
              <p className="text-gray-600 font-light leading-relaxed">
                Enter your creative vision above and transform ideas into stunning visual content
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-0.5 bg-black mx-auto mb-6"></div>
            </div>
            <p className="text-sm font-light text-gray-600 tracking-wider uppercase mb-4">
              Designed by Pranith
            </p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://github.com/pranith023" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-4 font-light">
              AI Image Generator • Editorial Style
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIImageGenerator;