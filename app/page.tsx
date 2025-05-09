"use client";

import AudioRecorder from "@/components/AudioRecorder";

export default function Home() {
  return (
    <>
      
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-md max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">
            🎤 Track Finder
          </h1>
          <AudioRecorder />
        </div>
      </main>
    </>
  );
}