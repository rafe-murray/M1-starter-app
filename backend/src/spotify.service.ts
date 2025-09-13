import axios from 'axios';
import qs from 'qs';
import {
  GetSpotifyTokenRequest,
  GetTopTracksResponse,
  RefreshSpotifyTokenRequest,
  SpotifyTokenResponse,
} from './types/spotify';
import mongoose from 'mongoose';
import { spotifyAuthController } from './controllers/spotify';

// Makes requests to Spotify's authentication services
export class SpotifyAuthService {
  public async getToken(
    req: GetSpotifyTokenRequest
  ): Promise<SpotifyTokenResponse> {
    try {
      const tokenResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({
          grant_type: 'authorization_code',
          code: req.code,
          redirect_uri: req.redirect_uri,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
              'Basic ' +
              Buffer.from(
                process.env.SPOTIFY_CLIENT_ID! +
                  ':' +
                  process.env.SPOTIFY_CLIENT_SECRET!
              ).toString('base64'),
          },
        }
      );
      const data: SpotifyTokenResponse = tokenResponse.data;
      return data;
    } catch (err: any) {
      console.error(
        'Error exchanging code for Spotify Token:',
        err.response?.data || err.message
      );
      throw new Error('Spotify token exchange failed');
    }
  }
  public async refreshToken(
    req: RefreshSpotifyTokenRequest
  ): Promise<SpotifyTokenResponse> {
    try {
      const refreshResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({
          grant_type: 'refresh_token',
          refresh_token: req.refresh_token,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
              'Basic ' +
              Buffer.from(
                process.env.SPOTIFY_CLIENT_ID! +
                  ':' +
                  process.env.SPOTIFY_CLIENT_SECRET!
              ).toString('base64'),
          },
        }
      );
      const data: SpotifyTokenResponse = refreshResponse.data;
      return data;
    } catch (err: any) {
      console.error(
        'Error refreshing token:',
        err.response?.data || err.message
      );
      throw new Error('Token refresh failed');
    }
  }
}

export const spotifyAuthService = new SpotifyAuthService();

class SpotifyProfileService {
  public async getTopTracks(
    userId: mongoose.Types.ObjectId
  ): Promise<GetTopTracksResponse> {
    try {
      const token = await spotifyAuthController.getToken(userId);
      const response = await axios.get(
        'https://api.spotify.com/v1/me/top/tracks',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error();
    }
  }
}

export const spotifyProfileService = new SpotifyProfileService();
