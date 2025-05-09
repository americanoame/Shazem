export interface Artist {
  name: string;  
}

export interface SongInfo {
  title: string;
  album?: string;
  artist: Artist;
  label?: string;
  // lyrics?: string;
  release_date?: string; 
  lyrics?: { lyrics: string } ;
}
