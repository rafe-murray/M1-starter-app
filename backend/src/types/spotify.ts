import mongoose, { Document } from 'mongoose';
import z from 'zod';

export interface ISpotifyAuth extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  authenticationToken: string;
  refreshToken: string;
  expiresAt?: Date;
}

// For incoming requests from the frontend
export const getSpotifyTokenSchema = z.object({
  userId: z.custom<mongoose.Types.ObjectId>(),
  code: z.string(),
  redirect_uri: z.string(), // NOTE: not using url() because not all URIs and URLs
});

export const setSpotifyAuthSchema = z.object({
  userId: z.custom<mongoose.Types.ObjectId>(),
  authenticationToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresAt: z.date(),
});

export type GetSpotifyTokenRequest = z.infer<typeof getSpotifyTokenSchema>;

export type RefreshSpotifyTokenRequest = {
  refresh_token: string;
};

// Response received from spotify
export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};
type SpotifyImage = {
  url: string;
  height: number;
  width: number;
};
export type GetTopTracksResponse = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: SpotifyTrack[];
};
type SpotifyTrack = {
  external_urls: { [key: string]: string };
  followers: { href: string; total: number };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};
export type SpotifyProfileResponse = {
  message: string;
  data?: {
    tracks: SpotifyTrack[];
  };
};
