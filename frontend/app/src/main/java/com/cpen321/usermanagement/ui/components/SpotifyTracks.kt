package com.cpen321.usermanagement.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.buildAnnotatedString
import androidx.navigation.navDeepLink
import coil.compose.AsyncImage
import com.cpen321.usermanagement.data.remote.dto.SpotifyTrack

@Composable
fun SpotifyTrack(
    track: SpotifyTrack
) {
    Column {
        AsyncImage(
            model = track.images[0].url,
            contentDescription = track.name,
//            modifier = Modifier
//                .fillMaxSize()
        )
        Text(buildAnnotatedString {
            track.name
            navDeepLink { track.uri }
        })
    }
}

@Composable
fun SpotifyTracks(
    tracks: List<SpotifyTrack>
) {
    Row() {
        for (track in tracks) {
            SpotifyTrack(track)
        }
    }
}
