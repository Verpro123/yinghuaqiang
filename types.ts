
export interface Song {
  id: number | string;
  url: string;
  title: string;
  artist: string;
}

export interface SakuraPetal {
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
  flip: number;
  flipSpeed: number;
  ySpeed: number;
  xSpeed: number;
}
