package com.cpen321.usermanagement

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import com.cpen321.usermanagement.data.repository.ProfileRepository
import com.cpen321.usermanagement.data.repository.SpotifyRepository
import com.spotify.sdk.android.auth.AuthorizationClient
import com.spotify.sdk.android.auth.AuthorizationResponse
import com.spotify.sdk.android.auth.LoginActivity.REQUEST_CODE
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.launch
import javax.inject.Inject


@AndroidEntryPoint
class SpotifyCallbackActivity : ComponentActivity() {
    @Inject
    lateinit var spotifyRepository: SpotifyRepository
    @Inject
    lateinit var profileRepository: ProfileRepository
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("DEBUG", "Callback started")
        returnToMain()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        val uri = intent.data
        if (uri != null) {
            val response = AuthorizationResponse.fromUri(uri)
            when (response.getType()) {
                AuthorizationResponse.Type.CODE -> {
                    val code = response.code
                    exchangeCodeForToken(code)
                }

                AuthorizationResponse.Type.ERROR -> {
                    Log.e("SpotifyCallback", "Spotify error: ${response.error}")
                    returnToMain()
                }

                else -> {
                    Log.d("SpotifyCallback", response.type.toString())
                    exchangeCodeForToken("")
                    Log.d("SpotifyCallback", "Spotify auth cancelled")
                }
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, intent: Intent?) {
        super.onActivityResult(requestCode, resultCode, intent)

        // Check if result comes from the correct activity
        if (requestCode == REQUEST_CODE) {
            val response = AuthorizationClient.getResponse(resultCode, intent)
            when (response.getType()) {
                AuthorizationResponse.Type.CODE -> {
                    val code = response.code
                    exchangeCodeForToken(code)
                }

                AuthorizationResponse.Type.ERROR -> {
                    Log.e("SpotifyCallback", "Spotify error: ${response.error}")
                    returnToMain()
                }

                else -> {
                    Log.d("SpotifyCallback", response.type.toString())
                    exchangeCodeForToken("")
                    Log.d("SpotifyCallback", "Spotify auth cancelled")
                }
            }
        }
    }

    private fun exchangeCodeForToken(code: String) {
        lifecycleScope.launch {
            try {
                val user = profileRepository.getProfile().getOrNull()
                spotifyRepository.saveToken(user!!._id, code, "cpen321://callback")
            } catch (e: Exception) {
                Log.e("SpotifyCallback", "Error exchanging code", e)
            } finally {
                returnToMain()
            }
        }
    }

    private fun returnToMain() {
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        startActivity(intent)
        finish()
    }
}
