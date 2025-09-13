package com.cpen321.usermanagement

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import com.spotify.sdk.android.auth.AuthorizationClient
import com.spotify.sdk.android.auth.AuthorizationRequest
import com.spotify.sdk.android.auth.AuthorizationResponse

class SpotifyLoginActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val scopes = arrayOf("user-read-email", "playlist-read-private")

        val request = AuthorizationRequest.Builder(
            BuildConfig.SPOTIFY_CLIENT_ID,
            AuthorizationResponse.Type.CODE,
            "cpen321://callback"
        ).setScopes(scopes).build()

        val intent = AuthorizationClient.createLoginActivityIntent(this, request)
        startActivity(intent)

        // close this activity, control will go to Spotify app/browser,
        // and redirect will bring the user into SpotifyCallbackActivity
        finish()
    }
}
