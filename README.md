# DreamPixels

A sophisticated AI-powered image generation application with an editorial-style design, created by Pranith. Generate stunning visuals using state-of-the-art AI models with a professional, magazine-inspired interface.

## 🎨 Features

- **Multiple AI Models**: Choose from 5 different AI models including Imagen 3, Imagen 4, Qwen, and Uncensored options
- **Editorial Design**: Magazine-inspired interface with elegant typography and layout
- **Multiple Image Sizes**: Generate images in 512x512, 1024x1024, or 2048x2048 resolutions
- **CORS-Compliant Downloads**: Robust download functionality that handles cross-origin issues
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional Footer**: Includes attribution and GitHub link

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd DreamPixels

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🎯 Usage

1. **Enter your prompt** in the text input field
2. **Select your preferred model** from the dropdown
3. **Choose image size** (512x512, 1024x1024, or 2048x2048)
4. **Click "GENERATE"** to create your image
5. **Download** your generated image using the download button

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **API**: RESTful API integration

## 📱 Models Available

| Model ID | Name | Description |
|----------|------|-------------|
| `img2` | IMG-2 | Standard AI image generation |
| `img3` | IMG-3 | Enhanced AI image generation |
| `img4` | Imagen 4 | Latest Google Imagen model |
| `qwen` | Qwen | Alibaba's Qwen model |
| `uncen` | Uncensored | Uncensored model for creative freedom |

## 🔧 API Configuration

The application uses the following API endpoint:
- **Base URL**: `/api/v1/images/generations`
- **Authentication**: Bearer token
- **Content-Type**: `application/json`

## 🎨 Design Features

- **Editorial Magazine Style**: Clean, professional layout
- **Typography**: Bold, impactful fonts with proper hierarchy
- **Color Scheme**: Monochromatic with subtle accents
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Interactive Elements**: Hover effects and smooth transitions

## 📁 Project Structure

```
ai-image-generator/
├── src/
│   ├── components/
│   │   └── AIImageGenerator.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

**Designed by Pranith**
- GitHub: [@pranithsai](https://github.com/pranith023)
- Project: DreamPixels Style

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
