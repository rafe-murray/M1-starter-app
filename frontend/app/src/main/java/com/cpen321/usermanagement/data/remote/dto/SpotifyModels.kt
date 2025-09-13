package com.cpen321.usermanagement.data.remote.dto

data class AuthenticateSpotifyUserRequest (
    val clientId: String,
    val redirectUri: String,
    val state: String? = null,
    val scope: String? = null,
    val showDialog: Boolean = true,
)

data class SaveTokenRequest (
    val userId: String,
    val code: String,
    val redirect_uri: String,
)

data class GetTracksResponse (
    val tracks: Array<SpotifyTrack>
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as GetTracksResponse

        return tracks.contentEquals(other.tracks)
    }

    override fun hashCode(): Int {
        return tracks.contentHashCode()
    }
}

data class SpotifyTrack (
val external_urls: Map<String, String>,
val followers: SpotifyFollowers,
val genres: Array<String>,
val href: String,
val id: String,
val images: Array<SpotifyImage>,
val name: String,
val popularity: Integer,
val type: String,
val uri: String,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as SpotifyTrack

        if (external_urls != other.external_urls) return false
        if (followers != other.followers) return false
        if (!genres.contentEquals(other.genres)) return false
        if (href != other.href) return false
        if (id != other.id) return false
        if (!images.contentEquals(other.images)) return false
        if (name != other.name) return false
        if (popularity != other.popularity) return false
        if (type != other.type) return false
        if (uri != other.uri) return false

        return true
    }

    override fun hashCode(): Int {
        var result = external_urls.hashCode()
        result = 31 * result + followers.hashCode()
        result = 31 * result + genres.contentHashCode()
        result = 31 * result + href.hashCode()
        result = 31 * result + id.hashCode()
        result = 31 * result + images.contentHashCode()
        result = 31 * result + name.hashCode()
        result = 31 * result + popularity.hashCode()
        result = 31 * result + type.hashCode()
        result = 31 * result + uri.hashCode()
        return result
    }
}

data class SpotifyImage (
val url: String,
val height: Integer,
val width: Integer,

)

data class SpotifyFollowers (
    val href: String,
    val total: Integer
)