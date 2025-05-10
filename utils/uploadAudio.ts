import axios from 'axios';
import { Artist, SongInfo } from "@/utils/types";

export const uploadAudio = async (audioBlob: Blob): Promise<SongInfo | null> => {
  // console.log('uploadAudio called with blob:', audioBlob);
  // console.log('Blob size:', audioBlob.size);
  // console.log('Token:', process.env.NEXT_PUBLIC_AUDD_API_TOKEN);

  const formData = new FormData();
  formData.append('api_token', process.env.NEXT_PUBLIC_AUDD_API_TOKEN || '');
  formData.append('file', new File([audioBlob], 'song.webm'));
  formData.append('return', 'lyrics');

  try {
    const res = await axios.post('https://api.audd.io/', formData);
    console.log('API response:', res.data);

    const result = res.data?.result;


    if (result) {
      // console.log('Result keys:', Object.keys(result));
    }


    if (result && typeof result.title === 'string') {
      const artistData = result.artist;

      const normalizedArtist: Artist = {
        name: typeof artistData === 'string' ? artistData : artistData?.name ?? 'Unknown Artist',
      };


// Using ?? (nullish coalescing operator) to handle possible null or undefined values from the API

      const songInfo: SongInfo = {
        title: result.title,
        album: result.album ?? '',
        artist: normalizedArtist,
        label: result.label ?? '',
        // lyrics: result.lyrics ?? '',
        release_date: result.release_date ?? '',
        lyrics: result.lyrics?.lyrics ?? '',
      };

      return songInfo;
    } else {
      console.warn('Song not identified or invalid response:', result);
    }

  } catch (err) {
    console.error('AudD API error:', err);
  }

  return null;
};


