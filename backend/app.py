from http.server import SimpleHTTPRequestHandler
from flask import Flask, render_template, request
from flask_restx import fields
from flask_cors import CORS
from flask_restx import Resource, Api
from SpotifyRec import *
import http.server

#export FLASK_APP=app.py
#export FLASK_ENV=development

class HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        http.server.SimpleHTTPRequestHandler.end_headers(self)



app = Flask(__name__)
api = Api(app, title="Spotify Recommendation System", description="Api to recommend songs from a given playlist or song")
cors = CORS(app, resources={r"/*": {"origin": "*"}})

numerical_features = ['valence', 'acousticness', 'danceability', 'energy', 'explicit', 'instrumentalness', 'liveness', 'loudness', 'mode', 'popularity', 'speechiness', 'tempo']

load_dotenv("ml/.env")
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

numerical_features = ['valence', 'acousticness', 'danceability', 'energy', 'explicit', 'instrumentalness', 'liveness', 'loudness', 'mode', 'popularity', 'speechiness', 'tempo']



df = pd.read_csv("ml/datasets/data.csv")
df = df.drop_duplicates('id')

token = getToken()


ns_get_song = api.namespace('get-song-info', description="Get song info from search")

ns_recommend_song = api.namespace('recommend-song', description="Recommend 5 songs given a song name")

ns_recommend_playlist = api.namespace('recommend-playlist', description="Recommend a playlist given a playlist id")

ns_get_artist = api.namespace('get-artist', description="Get artist given a search query")

ns_get_songs_playlist = api.namespace('get-songs-playlist', description="Get all the songs from a playlist given a playlist id")

ns_get_audio_features = api.namespace('get-audio-features', description="Get audio features given song id")

ns_get_song_id = api.namespace('get-song-id', description="Get the song info from song id")


get_song_expect = api.model('Get_Song', {
    'Song Name': fields.String(required=True, description='Song Name')
})

recommend_song_expect = api.model('Recommend_Song', {
    'Song Name': fields.String(required=True, description='Song Name'),
    'Recommendations': fields.Integer(required=True, description="Number of recommendations")
})

recommend_playlist_expect = api.model("Recommend_Playlist", {
    'Playlist_id': fields.String(required=True, description="The id of the playlist")
})

get_artist_expect = api.model('Get_Artist', {
    'Artist_Name': fields.String(required=True, description="Name of the Artist")
})

get_audio_features_expect = api.model('Get_Audio_Features', {
    'Song_id': fields.String(required=True, description="Song Id")
})


@ns_get_song.route('/')
class GetSong(Resource):
    @ns_get_song.expect(get_song_expect)
    def post(self):
        song_name = request.json["Song Name"]
        result = search_for_song_id(token, song_name)
        return result
    
@ns_recommend_song.route('/')
class RecommendSong(Resource):
    @ns_recommend_song.expect(recommend_song_expect)
    def post(self):
        inputs = request.json
        print(inputs)
        num_rec = int(inputs["Recommendations"])
        song_name = str(inputs["Song Name"])
        result = recommendSongs(token, song_name, num_rec)
        print(result)
        return result
    
@ns_recommend_playlist.route('/')
class RecommendPlaylist(Resource):
    @ns_recommend_playlist.expect(recommend_playlist_expect)
    def post(self):
        playlist_id = request.json["Playlist_id"]
        result = generate_playlist(token, playlist_id)
        return result

@ns_get_artist.route('/')
class GetArtist(Resource):
    @ns_get_artist.expect(get_artist_expect)
    def post(self):
        artist_name = request.json["Artist_Name"]
        result = search_for_artist(token, artist_name)
        return result
    
@ns_get_songs_playlist.route('/')
class getSongsPlaylist(Resource):
    @ns_get_songs_playlist.expect(recommend_playlist_expect)
    def post(self):
        playlist_id = request.json["Playlist_id"]
        result = get_songs_from_playlist(token, playlist_id)
        return result

@ns_get_audio_features.route('/')
class getAudioFeatures(Resource):
    @ns_get_audio_features.expect(get_audio_features_expect)
    def post(self):
        song_id = request.json["Song_id"]
        results = getAudioFeatures(token, song_id)
        return results
    
@ns_get_song_id.route("/")
class getSongInfoId(Resource):
    @ns_get_song_id.expect(get_audio_features_expect)
    def post(self):
        song_id = request.json["Song_id"]
        results = get_song_info_id(token, song_id)
        return results