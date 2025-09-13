import mongoose, { Schema } from 'mongoose';
import {
  ISpotifyAuth,
  setSpotifyAuthSchema,
  SpotifyTokenResponse,
} from '../types/spotify';
import logger from '../logger.util';

const spotifyAuthSchema = new Schema<ISpotifyAuth>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    authenticationToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export class SpotifyAuthModel {
  private spotifyAuth: mongoose.Model<ISpotifyAuth>;

  constructor() {
    this.spotifyAuth = mongoose.model<ISpotifyAuth>(
      'SpotifyAuth',
      spotifyAuthSchema
    );
  }
  isExpired(spotifyAuth: ISpotifyAuth): boolean {
    if (!spotifyAuth.expiresAt) return true;
    return spotifyAuth.expiresAt! < new Date();
  }
  async set(spotifyAuth: Partial<ISpotifyAuth>) {
    try {
      const validatedData = setSpotifyAuthSchema.parse(spotifyAuth);
      this.spotifyAuth.updateOne(
        { userId: spotifyAuth.userId },
        validatedData,
        {
          upsert: true,
        }
      );
    } catch (error) {
      logger.error('Error setting Spotify token:', error);
      throw new Error('Failed to set Spotify token');
    }
  }
  async setFromSpotifyResponse(
    tokenResponse: SpotifyTokenResponse,
    userId: mongoose.Types.ObjectId
  ) {
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + tokenResponse.expires_in);
    const spotifyAuth: Partial<ISpotifyAuth> = {
      userId: userId,
      authenticationToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: expiryDate,
    };
    spotifyAuthModel.set(spotifyAuth);
  }
  async delete(userId: mongoose.Types.ObjectId) {
    try {
      const spotifyAuthExists = await this.spotifyAuth.exists({ userId });
      if (!spotifyAuthExists) {
        return;
      }
      await this.spotifyAuth.findOneAndDelete({ userId });
    } catch (error) {
      logger.error('Error deleting Spotify Auth info:', error);
      throw new Error('Failed to delete Spotify Auth info');
    }
  }
  async get(userId: mongoose.Types.ObjectId): Promise<ISpotifyAuth | null> {
    try {
      const spotifyAuth = await this.spotifyAuth.findOne({ userId });

      if (!spotifyAuth) {
        return null;
      }

      return spotifyAuth;
    } catch (error) {
      console.error('Error getting Spotify Auth info:', error);
      throw new Error('Failed to get Spotify Auth info');
    }
  }
}

export const spotifyAuthModel = new SpotifyAuthModel();
