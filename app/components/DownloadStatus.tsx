import React from 'react';

interface DownloadStatusProps {
  status: string;
  progress: number;
  onInitialize?: () => void;
  modelName: string;
  color?: 'blue' | 'indigo' | 'purple' | 'pink' | 'green' | 'cyan' | 'orange' | 'emerald';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    bar: 'bg-blue-500',
    button: 'bg-blue-600 hover:bg-blue-500',
  },
  indigo: {
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-400',
    bar: 'bg-indigo-500',
    button: 'bg-indigo-600 hover:bg-indigo-500',
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    bar: 'bg-purple-500',
    button: 'bg-purple-600 hover:bg-purple-500',
  },
  pink: {
    bg: 'bg-pink-500/20',
    text: 'text-pink-400',
    bar: 'bg-pink-500',
    button: 'bg-pink-600 hover:bg-pink-500',
  },
  cyan: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    bar: 'bg-cyan-500',
    button: 'bg-cyan-600 hover:bg-cyan-500',
  },
  orange: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    bar: 'bg-orange-500',
    button: 'bg-orange-600 hover:bg-orange-500',
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    bar: 'bg-emerald-500',
    button: 'bg-emerald-600 hover:bg-emerald-500',
  },
  green: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    bar: 'bg-green-500',
    button: 'bg-green-600 hover:bg-green-500',
  },
};

export default function DownloadStatus({
  status,
  progress,
  onInitialize,
  modelName,
  color = 'blue',
}: DownloadStatusProps) {
  const colors = colorClasses[color];
  const needsDownload = status === 'after-download' || status === 'downloadable';
  const isDownloading = status === 'downloading' || (progress > 0 && progress < 100) || (!onInitialize && needsDownload);

  return (
    <div className="p-12 text-center">
      <div className="mb-8">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.bg} ${colors.text} mb-6 ${
            isDownloading ? 'animate-pulse' : ''
          }`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isDownloading ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            )}
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isDownloading ? `Downloading ${modelName}...` : (onInitialize ? `Ready to Initialize ${modelName}` : `Initializing ${modelName}...`)}
        </h2>
        <p className="text-gray-400">
          {isDownloading
            ? 'Please wait while the model is being downloaded.'
            : (onInitialize 
                ? `Click below to initialize the ${modelName.toLowerCase()} model${needsDownload ? ' (download required)' : ''}.`
                : `Please wait while we prepare the ${modelName.toLowerCase()}...`
              )
          }
        </p>
      </div>

      {!isDownloading && onInitialize && (
        <button
          className={`px-8 py-3 text-lg font-bold text-white rounded-full transition-all ${colors.button}`}
          onClick={onInitialize}
        >
          Initialize {modelName}
        </button>
      )}

      {isDownloading && (
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Downloading model...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`${colors.bar} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
