import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/50 dark:bg-black/50 backdrop-blur-md border-t border-black/10 dark:border-white/10 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Browser AI
            </span>
          </div>
          
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Browser AI Playground. Open source.
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/yogeshpaliyal/browser-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link href="/prompt" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              Playground
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
