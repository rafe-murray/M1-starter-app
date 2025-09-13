package com.cpen321.usermanagement.data.remote.api

import com.cpen321.usermanagement.data.remote.dto.ApiResponse
import com.cpen321.usermanagement.data.remote.dto.GetTracksResponse
import com.cpen321.usermanagement.data.remote.dto.SaveTokenRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface SpotifyInterface {
    @POST("spotify/callback")
    suspend fun saveToken(
        @Header("Authorization") authHeader: String,
        @Body request: SaveTokenRequest
    ): Response<ApiResponse<Unit>>

    @GET("spotify/tracks")
    suspend fun getSpotifyTracks(
@Header("Authorization") authHeader: String,
    ): Response<ApiResponse<GetTracksResponse>>
}