from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json

load_dotenv()
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

def getToken():
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}

    result = post(url, headers=headers, data=data)
    json_results = json.loads(result.content)
    token = json_results["access_token"]
    return token

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}

def search_for_artist(token, artist_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = "?q={0}&type=artist&limit=1".format(artist_name)
    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)["artists"]["items"]
    if len(json_result) == 0:
        print("No artist with this name exists")
    
    return json_result[0]

def get_songs_by_artist(token, artist_id):
    url = "https://api.spotify.com/v1/artists/{}/top-tracks?country=US".format(artist_id)
    print(url)
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]
    return json_result

def get_songs_from_playlist(token, playlist_id):
    url = "https://api.spotify.com/v1/playlists/{}/tracks".format(playlist_id)
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["items"]

    for idx, song in enumerate(json_result):
        print("{0}. {1}".format(idx+1, song["track"]["name"]))


token = getToken()
result = search_for_artist(token, "ACDC")
artist_id = result["id"]
songs = get_songs_by_artist(token, artist_id)
get_songs_from_playlist(token, "4pGcahpNnl344p4xuWa5IC")


