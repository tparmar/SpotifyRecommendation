from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json
import pandas as pd
import matplotlib as plt
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
import json

load_dotenv("ml/.env")
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

numerical_features = ['valence', 'acousticness', 'danceability', 'energy', 'explicit', 'instrumentalness', 'liveness', 'loudness', 'mode', 'popularity', 'speechiness', 'tempo']

df = pd.read_csv("ml/datasets/data.csv")
df = df.drop_duplicates('id')


#get the token for spotify API
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

#get the headers for any api request
def get_auth_header(token):
    return {"Authorization": "Bearer " + token}

#search for artist given a search query
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

#get tracks from given playlist id
def get_songs_from_playlist(token, playlist_id):
    url = "https://api.spotify.com/v1/playlists/{}/tracks".format(playlist_id)
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["items"]

    return json_result

#get year from given song id
def get_year_from_song(token, song_id):
    url = "https://api.spotify.com/v1/tracks/{}".format(song_id)
    headers = get_auth_header(token)
    result = get(url , headers=headers)
    json_result = json.loads(result.content)["album"]["release_date"]
    return json_result

#search for song id
def search_for_song_id(token, song_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    format_song_name = ""
    for i in range(len(song_name)):
        if song_name[i] == " ":
            format_song_name += "+"
        else:
            format_song_name += song_name[i]
    query = "?q={0}&type=track&limit=1".format(format_song_name)
    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)["tracks"]["items"][0]
    return json_result

#get audio features
def getAudioFeatures(token, id):
    url = "https://api.spotify.com/v1/audio-features/{}".format(id)
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)
    return json_result

#get the track info from song name
def getSongInfo(token, song_name):
    json_song_info = search_for_song_id(token, song_name)
    song_id = json_song_info["id"]
    final_dict = dict()
    song_artists = ""
    for i in range(len(json_song_info["artists"])):
        song_artists += json_song_info["artists"][i]['name'] + ";"
    song_artists = song_artists[0:-1]
    song_album_name = json_song_info["album"]["name"]
    song_duration = json_song_info["duration_ms"]
    song_popularity = json_song_info["popularity"]
    song_explicit = json_song_info["explicit"]

    song_audio_features = getAudioFeatures(token, song_id)
    
    final_dict["valence"] = song_audio_features["valence"]
    final_dict["year"] = get_year_from_song(token, song_id)[0:4]
    final_dict["acousticness"] = song_audio_features["acousticness"]
    final_dict["artists"] = song_artists
    final_dict["danceability"] = song_audio_features["danceability"]
    final_dict["duration_ms"] = song_duration
    final_dict["energy"] = song_audio_features["energy"]
    final_dict["explicit"] = song_explicit
    final_dict["id"] = song_id
    final_dict["instrumentalness"] = song_audio_features["instrumentalness"]
    final_dict["key"] = song_audio_features["key"]
    final_dict["liveness"] = song_audio_features["liveness"]
    final_dict["loudness"] = song_audio_features["loudness"]
    final_dict["mode"] = song_audio_features["mode"]
    final_dict["name"] = json_song_info["name"]
    final_dict["popularity"] = song_popularity
    final_dict["release_date"] = get_year_from_song(token, song_id)
    final_dict["speechiness"] = song_audio_features["speechiness"]
    final_dict["tempo"] = song_audio_features["tempo"]

    # song_df = pd.DataFrame(final_dict, index = [0])
    # return song_df
    return final_dict

#recommend songs from given track name
def recommendSongs(token, track_name, num_recommended):
    new_df = df.copy()
    if getSongInfo(token, track_name)["name"] not in new_df["name"].values:
        song_df = getSongInfo(token, track_name)
        new_df.loc[-1] = song_df
    scaler = MinMaxScaler()
    scaled_df = new_df
    scaled_df[numerical_features] = scaler.fit_transform(new_df[numerical_features])
    
    track_index = scaled_df.index[scaled_df["name"] == getSongInfo(token, track_name)["name"]]

    scores = cosine_similarity(scaled_df.loc[track_index][numerical_features], scaled_df[numerical_features])

    similar_song_indices = scores.argsort()[0][::-1][1:num_recommended + 1]

    # Get the names of the most similar songs based on content-based filtering
    content_based_recommendations = scaled_df.iloc[similar_song_indices][["name", "artists", "id"]]

    final_result = json.loads(content_based_recommendations.to_json())


    return final_result

#generate playlist given another playlist
def generate_playlist(token, playlist_id):
    json_songs = get_songs_from_playlist(token, playlist_id)
    tracks = []
    for i in json_songs:
        if getSongInfo(token, i["track"]["name"])["name"] in df["name"].values:
            track_index = df.index[df["name"] == i["track"]["name"]]
            tracks.append(df.loc[track_index])
        else:
            song_dict = getSongInfo(token, str(i["track"]["name"]) + " " + str(i["track"]["artists"][0]["name"]))
            song_df = pd.DataFrame(song_dict, index=[0])
            tracks.append(song_df)
    
    list_recommended_songs = []
    for i in range(len(tracks)):
        current_song_df = tracks[i]
        list_recommended_songs.append(recommendSongs(token, current_song_df.iloc[0]["name"], 1))

    return str(list_recommended_songs)

def get_song_info_id(token, song_id):
    url = "https://api.spotify.com/v1/tracks/{}".format(song_id)
    headers = get_auth_header(token)
    result = get(url , headers=headers)
    json_result = json.loads(result.content)
    return json_result