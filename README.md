# Browser AI Playground

A Next.js application that demonstrates and tests browser-based AI APIs. Run advanced machine learning models directly in your browser with privacy, speed, and no server costs.

## Features

- **On-Device AI**: All AI processing happens locally in your browser
- **Privacy-First**: No data is sent to external servers
- **Real-Time API Status**: Check availability of browser AI APIs
- **Interactive Playgrounds**: Test each API with a user-friendly interface

## Available APIs

| API | Description |
|-----|-------------|
| **Prompt API** | General purpose language model for chat and text generation |
| **Summarizer API** | Summarize long texts into concise key points or summaries |
| **Writer API** | Generate new content based on context and prompts |
| **Rewriter API** | Rewrite and polish existing text with different tones |
| **Language Detection** | Detect the language of a given text |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A browser that supports [Chrome Built-in AI APIs](https://developer.chrome.com/docs/ai/built-in) (e.g., Chrome Canary with experimental flags enabled)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yogeshpaliyal/browser-ai.git
   cd browser-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Browser Compatibility

This application requires a browser with support for Chrome's Built-in AI APIs. Currently, these APIs are experimental and available in:

- **Chrome Canary** with the following flags enabled:
  - `chrome://flags/#optimization-guide-on-device-model`
  - `chrome://flags/#prompt-api-for-gemini-nano`

For the latest information on browser support and how to enable these features, refer to the [Chrome Built-in AI documentation](https://developer.chrome.com/docs/ai/built-in).

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

MIT
