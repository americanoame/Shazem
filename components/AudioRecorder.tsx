"use client";

import { useEffect, useState } from "react";
import { Artist, SongInfo } from "@/utils/types";
import { uploadAudio } from "@/utils/uploadAudio";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });

        const result = await uploadAudio(audioBlob);

        if (result) {
          const artistData = result.artist;
          const normalizedArtist: Artist = {
            name:
              typeof artistData === "string"
                ? artistData
                : artistData?.name || "Unknown Artist",
          };

          setSongInfo({ ...result, artist: normalizedArtist });
        }
      };

      mediaRecorder.start();
      setRecording(true);

      const handleStop = (event: KeyboardEvent) => {
        if (event.key === "s") {
          mediaRecorder.stop();
          setRecording(false);
          window.removeEventListener("keydown", handleStop);
        }
      };

      window.addEventListener("keydown", handleStop);
    } catch (err) {
      console.error("Mic access error:", err);
      setRecording(false);
    }
  };

  // const getValidTitle = () => {
  //   if (!songInfo) return "Unknown Title";

  //   const title = songInfo.title;

  //   if (typeof title === "string") return title;

  //   return "Unknown Title";
  // };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={startRecording}
        disabled={recording}
        className={`px-4 py-2 rounded ${
          recording ? "bg-green-400" : "bg-red-600 text-white"
        }`}
      >
        {recording ? 'Recording... Press "s" to Stop' : "Start Recording"}
      </button>

      {songInfo && (
        <div className="mt-4 text-center">
          {/* <h2 className="text-xl font-bold"> {getValidTitle()}</h2> */}

          {songInfo.artist?.name && (
            <h2 className="text-lg font-medium"> <span className="text-red-700">Artist:</span> {songInfo.artist.name}</h2>
          )}

          {typeof songInfo.title === "string" && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="text-lg text-red-700">Song title:</span>{" "}
              {songInfo.title}
            </p>
          )}

          {songInfo.album && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="text-lg text-red-700">Album: </span>
              {songInfo.album}
            </p>
          )}

          {songInfo.label && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="text-lg text-red-700">Label: </span>
              {songInfo.label}
            </p>
          )}

          {songInfo.release_date && (
            <p className="text-sm text-gray-500 mt-1">
              Release Date:{" "}
              {new Date(songInfo.release_date).toLocaleDateString()}
            </p>
          )}

          {typeof songInfo.lyrics === "object" && songInfo.lyrics.lyrics && (
            <pre className="mt-3 bg-gray-100 p-3 rounded whitespace-pre-wrap text-left">
              {songInfo.lyrics.lyrics}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

