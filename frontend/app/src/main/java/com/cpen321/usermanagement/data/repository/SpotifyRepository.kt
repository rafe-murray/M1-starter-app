package com.cpen321.usermanagement.data.repository

import com.cpen321.usermanagement.data.remote.dto.SpotifyTrack

interface SpotifyRepository {
    suspend fun saveToken( userId: String, code: String, redirectUri: String): Result<Unit>
    suspend fun getTracks(): Result<Array<SpotifyTrack>>
}