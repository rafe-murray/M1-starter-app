import { Router } from 'express';
import {
  spotifyAuthController,
  spotifyProfileController,
} from '../controllers/spotify';
import { validateBody } from '../validation.middleware';
import {
  GetSpotifyTokenRequest,
  getSpotifyTokenSchema,
} from '../types/spotify';

const router = Router();

/**
 * Callback to generate and store a token when a user is authenticated to spotify
 */
router.post(
  '/callback',
  validateBody<GetSpotifyTokenRequest>(getSpotifyTokenSchema),
  spotifyAuthController.saveToken
);

router.get('/tracks', spotifyProfileController.getProfileData);

router.delete('/', spotifyAuthController.deleteTokenInfo);

export default router;
