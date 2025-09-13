package com.cpen321.usermanagement.data.repository

import android.content.Context
import android.util.Log
import com.cpen321.usermanagement.data.remote.api.SpotifyInterface
import com.cpen321.usermanagement.data.remote.dto.SaveTokenRequest
import com.cpen321.usermanagement.data.remote.dto.SpotifyTrack
import com.cpen321.usermanagement.utils.JsonUtils.parseErrorMessage
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject

class SpotifyRepositoryImpl @Inject constructor(
    @ApplicationContext private val context: Context,
    private val spotifyInterface: SpotifyInterface
) : SpotifyRepository {
    companion object {
        private const val TAG = "SpotifyRepositoryImpl"
    }

    override suspend fun saveToken(
        userId: String,
        code: String,
        redirectUri: String
    ): Result<Unit> {
        return try {
            val response = spotifyInterface.saveToken(
                "",
                SaveTokenRequest(userId, code, redirectUri)
            ) // Auth header is handled by interceptor
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                val errorBodyString = response.errorBody()?.string()
                val errorMessage = parseErrorMessage(errorBodyString, "Failed to save token.")
                Log.e(TAG, "Failed to save token: $errorMessage")
                Result.failure(Exception(errorMessage))
            }
        } catch (e: java.net.SocketTimeoutException) {
            Log.e(TAG, "Network timeout while saving token", e)
            Result.failure(e)
        } catch (e: java.net.UnknownHostException) {
            Log.e(TAG, "Network connection failed while saving token", e)
            Result.failure(e)
        } catch (e: java.io.IOException) {
            Log.e(TAG, "IO error while saving token", e)
            Result.failure(e)
        } catch (e: retrofit2.HttpException) {
            Log.e(TAG, "HTTP error while saving token: ${e.code()}", e)
            Result.failure(e)
        }

    }

    override suspend fun getTracks(): Result<Array<SpotifyTrack>> {
        return try {
            Log.e(TAG, "Getting tracks")
            val response = spotifyInterface.getSpotifyTracks("")
            if (response.isSuccessful && response.body()?.data != null) {
                Result.success(response.body()!!.data!!.tracks)
            } else {
                val errorBodyString = response.errorBody()?.string()
                val errorMessage =
                    parseErrorMessage(errorBodyString, "Failed to get Spotify tracks")
                Log.e(TAG, "Failed to get Spotify tracks: $errorMessage")
                Result.failure(Exception(errorMessage))
            }
        } catch (e: java.net.SocketTimeoutException) {
            Log.e(TAG, "Network timeout while getting tracks", e)
            Result.failure(e)
        } catch (e: java.net.UnknownHostException) {
            Log.e(TAG, "Network connection failed while getting tracks", e)
            Result.failure(e)
        } catch (e: java.io.IOException) {
            Log.e(TAG, "IO error while getting tracks", e)
            Result.failure(e)
        } catch (e: retrofit2.HttpException) {
            Log.e(TAG, "HTTP error while getting tracks: ${e.code()}", e)
            Result.failure(e)
        }
    }
}