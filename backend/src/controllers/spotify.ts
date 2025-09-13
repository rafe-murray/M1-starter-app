import { spotifyAuthModel } from '../models/spotify';
import {
  GetSpotifyTokenRequest,
  ISpotifyAuth,
  SpotifyProfileResponse,
} from '../types/spotify';
import { NextFunction, Request, Response } from 'express';
import { spotifyAuthService, spotifyProfileService } from '../spotify.service';
import logger from '../logger.util';
import mongoose from 'mongoose';
import { log } from 'console';

export class SpotifyAuthController {
  saveToken = async (
    req: Request<unknown, unknown, GetSpotifyTokenRequest>,
    res: Response,
    next: NextFunction
  ) => {
    this;
    try {
      const tokenRequest = req.body!;
      await this.setOrRefreshToken(tokenRequest);
      return res.status(200).json({
        message: 'Spotify token saved succesfully',
      });
    } catch (error) {
      logger.error('Failed to save Spotify access token:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message || 'Failed to save Spotify access token',
        });
      }
      next(error);
    }
  };

  // only for use by other controllers
  async getToken(userId: mongoose.Types.ObjectId): Promise<string> {
    const spotifyAuth = await spotifyAuthModel.get(userId);
    if (spotifyAuth) {
      if (!spotifyAuthModel.isExpired(spotifyAuth)) {
        return spotifyAuth.authenticationToken;
      }
      const refreshResponse = await spotifyAuthService.refreshToken({
        refresh_token: spotifyAuth.refreshToken,
      });
      spotifyAuthModel.setFromSpotifyResponse(refreshResponse, userId);
      return refreshResponse.access_token;
    }
    throw Error('No token found for the given user');
  }

  async deleteTokenInfo(req: Request, res: Response, next: NextFunction) {
    try {
      spotifyAuthModel.delete(req.user!._id);
      return res.status(200).json({
        message: 'Spotify auth info succesfully deleted',
      });
    } catch (error) {
      logger.error('Failed to delete Spotify auth info:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message || 'Failed to delete Spotify auth info',
        });
      }
      next(error);
    }
  }
  async setOrRefreshToken(req: GetSpotifyTokenRequest) {
    const spotifyAuth = await spotifyAuthModel.get(req.userId);
    if (spotifyAuth) {
      if (!spotifyAuthModel.isExpired(spotifyAuth)) {
        return;
      } else {
        const refreshResponse = await spotifyAuthService.refreshToken({
          refresh_token: spotifyAuth.refreshToken,
        });

        if (refreshResponse) {
          spotifyAuthModel.setFromSpotifyResponse(refreshResponse, req.userId);
        }
      }
    }
    const tokenResponse = await spotifyAuthService.getToken(req);
    if (tokenResponse) {
      spotifyAuthModel.setFromSpotifyResponse(tokenResponse, req.userId);
    }
  }
}

export const spotifyAuthController = new SpotifyAuthController();

class SpotifyProfileController {
  async getProfileData(
    req: Request,
    res: Response<SpotifyProfileResponse>,
    next: NextFunction
  ) {
    try {
      const profileData = await spotifyProfileService.getTopTracks(
        req.user!._id
      );
      return res.status(200).json({
        message: 'Tracks succesfully retrieved',
        data: { tracks: profileData.items },
      });
    } catch (error) {
      logger.error('Error retrieving Spotify tracks:', error);
      if (error instanceof Error) {
        return res.status(500).json({
          message: error.message || 'Failed to retrieve Spotify tracks',
        });
      }
      next(error);
    }
  }
}

export const spotifyProfileController = new SpotifyProfileController();
