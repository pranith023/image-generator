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
    // Updated container with a dark background and animated glowing blobs
    <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A] text-gray-200">
      {/* Animated Glowing Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="animated-blob w-72 h-72 bg-purple-500 rounded-full" style={{ top: '15%', left: '10%' }}></div>
        <div className="animated-blob w-96 h-96 bg-pink-500 rounded-full" style={{ bottom: '10%', right: '20%', animationDelay: '5s' }}></div>
        <div className="animated-blob w-80 h-80 bg-cyan-500 rounded-full" style={{ top: '40%', left: '45%', animationDelay: '10s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 relative z-10">
        {/* Header - Updated with bolder fonts and enhanced styling */}
        <header className="text-center mb-24">
          <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tight leading-none drop-shadow-lg">
            DREAM
          </h1>
          <h2 className="text-7xl md:text-9xl font-black text-white mb-8 tracking-tight leading-none drop-shadow-lg">
            PIXELS
          </h2>
          {/* Subtle separator with a gradient */}
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Create stunning visuals with artificial intelligence.
            Professional quality images for editorial, commercial, and creative projects.
          </p>
        </header>

        {/* Generation Form - Updated with a card-like section */}
        <div className="max-w-4xl mx-auto mb-20 bg-[#1a1a1a] p-8 md:p-12 rounded-3xl shadow-2xl border border-[#2e2e2e]">
          <div className="space-y-12">
            {/* Prompt Input - Updated with a glowing effect and more space */}
            <div className="text-center">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your vision..."
                  className="w-full text-2xl font-light text-white placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-700 focus:border-purple-500 focus:outline-none pb-4 text-center transition-all duration-300 transform focus:scale-105"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && generateImage()}
                />
                {/* Glow effect on focus */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-purple-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-full"></div>
              </div>
            </div>

            {/* Controls - Updated with better spacing and button-like selects */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="bg-gray-800 border-0 border-b border-gray-600 focus:border-pink-500 focus:outline-none text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 hover:bg-gray-700"
                  disabled={loading}
                >
                  <option value="512x512">512×512</option>
                  <option value="1024x1024">1024×1024</option>
                  <option value="2048x2048">2048×2048</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-gray-800 border-0 border-b border-gray-600 focus:border-pink-500 focus:outline-none text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 hover:bg-gray-700"
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

            {/* Generate Button - Enhanced with a gradient background and hover state */}
            <div className="text-center">
              <button
                onClick={generateImage}
                disabled={loading || !prompt.trim()}
                className="relative px-12 py-4 rounded-full font-bold text-lg text-white group overflow-hidden transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <span className="relative z-10 transition-all duration-300">
                  {loading ? 'GENERATING...' : 'GENERATE'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State - Updated for a more sleek look */}
        {loading && (
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <span className="text-xl font-light text-gray-400">Creating your masterpiece</span>
            </div>
            <div className="w-48 h-1 bg-gray-800 mx-auto overflow-hidden rounded-full">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
            </div>
          </div>
        )}

        {/* Generated Images Grid - Enhanced with a grid layout and card-like elements */}
        {images.length > 0 && (
          <div>
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                GALLERY
              </h3>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {images.map((image, index) => (
                <div key={image.id} className="group">
                  <div className="relative overflow-hidden bg-[#1a1a1a] shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 rounded-3xl border border-[#2e2e2e] transform hover:scale-105">
                    {/* Magazine Cover Style */}
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Magazine-style overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Issue number */}
                      <div className="absolute top-6 left-6 bg-purple-500 text-white px-4 py-2 text-sm font-bold tracking-wider rounded-br-lg shadow-lg">
                        #{String(index + 1).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Magazine info bar - Updated with better spacing and colors */}
                    <div className="p-6 bg-[#1a1a1a]">
                      <p className="text-sm text-gray-400 font-light mb-4 line-clamp-2 leading-relaxed">
                        {image.prompt}
                      </p>

                      <button
                        onClick={() => downloadImage(image.url, image.prompt)}
                        className="group/btn flex items-center gap-2 text-purple-400 hover:text-white transition-colors duration-300 transform hover:scale-105"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">Download</span>
                        <div className="w-0 group-hover/btn:w-8 h-0.5 bg-purple-500 transition-all duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Updated for a more stylish empty state */}
        {images.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                READY TO CREATE
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-400 font-light leading-relaxed">
                Enter your creative vision above and transform ideas into stunning visual content
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer - Updated for a more cohesive design */}
      <footer className="border-t border-[#2e2e2e] mt-20">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
            </div>
            <p className="text-sm font-light text-gray-500 tracking-wider uppercase mb-4">
              Designed by Pranith
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/pranith023"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors duration-300 transform hover:scale-110"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
            <p className="text-xs text-gray-600 mt-4 font-light">
              AI Image Generator • Editorial Style
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIImageGenerator;