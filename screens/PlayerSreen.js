
import React, { useState, useEffect, useRef } from "react";
import {
  Image, ImageBackground, Text, View, TouchableOpacity,
  FlatList, Modal, ActivityIndicator, TextInput, Animated,
  Easing, Share,
} from "react-native";
import { useAudio } from "../context/AudioContext";
import styles from "../styles/PlayerScreen.styles";
import SeekBar from "../components/ui/SeekBar";
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// Import drawer navigation
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import DownloadListScreen from "./DownloadListSreeen";
import LocalTracksListScreen from "./LocalTracksListSreen";
import FavouriteScreen from "./FavouriteScreen";

const Drawer = createDrawerNavigator();

// Extract the main player UI into a separate component
function PlayerContent() {
  const size = 200;
  const flatListRef = useRef(null);
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation(); // Add this hook to get navigation

  const {
    audioFiles, filteredAudioFiles, setFilteredAudioFiles,
    currentTrackIndex, setCurrentTrackIndex,
    isPlaying, durationMillis, positionMillis, sliderValue,
    isLoading, totalAudioCount, repeatMode, shuffleMode,
    hasPermissions, defaultImage,
    playPauseHandler, playNextTrack, playPreviousTrack,
    toggleShuffle, toggleRepeat, seekHandler,
    toggleFavorite, isFavorite, getAlbumArt,
    getPermissionsAndLoadAudio, setIsPlaying,
  } = useAudio();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentTrack = audioFiles[currentTrackIndex];
  const albumArtSource = currentTrack ? getAlbumArt(currentTrack) : null;

  // Rotation animation
  useEffect(() => {
    let anim;
    if (isPlaying) {
      anim = Animated.loop(
        Animated.timing(rotateAnimation, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true })
      );
      anim.start();
    } else {
      rotateAnimation.stopAnimation();
    }
    return () => { if (anim) anim.stop(); };
  }, [isPlaying]);

  const spin = rotateAnimation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  // Filter
  useEffect(() => {
    if (audioFiles.length > 0) {
      setFilteredAudioFiles(audioFiles.filter((item) =>
        item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.artist && item.artist.toLowerCase().includes(searchQuery.toLowerCase()))
      ));
    }
  }, [searchQuery, audioFiles]);

  // Scroll to current track
  useEffect(() => {
    if (showPlaylist && filteredAudioFiles.length > 0) {
      const idx = filteredAudioFiles.findIndex((item) => item.id === audioFiles[currentTrackIndex]?.id);
      if (idx !== -1 && flatListRef.current) {
        setTimeout(() => flatListRef.current.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 }), 300);
      }
    }
  }, [showPlaylist]);

  const onScrollToIndexFailed = (info) => {
    setTimeout(() => flatListRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.5 }), 500);
  };

  const getRepeatIcon = () => {
    if (repeatMode === "one") return <MaterialCommunityIcons name="repeat-once" size={24} color="#7db659" />;
    if (repeatMode === "all") return <Ionicons name="repeat" size={24} color="#09f03b" />;
    return <Ionicons name="repeat-outline" size={24} color="white" />;
  };

  const shareTrack = async (track) => {
    try { await Share.share({ message: `Check out this song: ${track.filename}` }); } catch {}
  };

  const getCurrentTrackName = () =>
    audioFiles[currentTrackIndex]?.filename?.replace(/\.[^/.]+$/, "") || "No track selected";

  const getCurrentArtist = () => audioFiles[currentTrackIndex]?.artist || "Unknown Artist";

  const playTrackFromList = (index) => {
    const actualIndex = audioFiles.findIndex((file) => file.id === filteredAudioFiles[index].id);
    setCurrentTrackIndex(actualIndex);
    setShowPlaylist(false);
    setIsPlaying(true);
  };

  // Simplified background: Use album art if available, otherwise use default image
  const backgroundSource = albumArtSource || defaultImage;

  return (
    <View style={styles.playScreenBody}>
      <ImageBackground
        source={backgroundSource}
        style={styles.backgroundImage}
        blurRadius={20}
        defaultSource={defaultImage}
      >
        <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.45)" }]}>
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.headerIcons}>
              {/* This will now open the drawer instead of the modal */}
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" size={35} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerText}>Now Playing</Text>
              <View style={{ width: 35 }} />
            </View>

            {/* Album Art circle with rotation */}
            <Animated.View style={[styles.playImage, { transform: [{ rotate: spin }] }]}>
              <Image
                source={albumArtSource || defaultImage}
                style={{ width: size, height: size, borderRadius: size / 2 }}
                defaultSource={defaultImage}
              />
            </Animated.View>

            {/* Track Info */}
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>{getCurrentTrackName()}</Text>
              <Text style={styles.trackArtist} numberOfLines={1}>{getCurrentArtist()}</Text>
            </View>

            {/* Progress */}
            <View style={styles.ah}>
              <View style={styles.musicMinutes}>
                <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
                <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
              </View>

              <SeekBar
                durationMillis={durationMillis}
                positionMillis={positionMillis}
                sliderValue={sliderValue}
                onSlidingComplete={seekHandler}
              />

              {/* Controls */}
              <View style={styles.playerControls}>
                <TouchableOpacity onPress={toggleShuffle}>
                  <Ionicons name="shuffle-outline" size={24} color={shuffleMode ? "#f808d4" : "white"} />
                </TouchableOpacity>
                <View style={styles.plays}>
                  <TouchableOpacity onPress={() => playPreviousTrack()} disabled={!audioFiles.length}>
                    <AntDesign name="step-backward" size={28} color={audioFiles.length ? "white" : "#666"} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={playPauseHandler} disabled={isLoading || !audioFiles.length}>
                    {isLoading
                      ? <ActivityIndicator size="large" color="white" />
                      : <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={80} color={audioFiles.length ? "white" : "#eae6e6"} />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => playNextTrack()} disabled={!audioFiles.length}>
                    <AntDesign name="step-forward" size={28} color={audioFiles.length ? "white" : "#fcf8f8"} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={toggleRepeat}>{getRepeatIcon()}</TouchableOpacity>
              </View>

              {/* Bottom Icons */}
              <View style={styles.bottomIcons}>
                <TouchableOpacity>
                  <AntDesign name="download" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFavorite()} disabled={!audioFiles.length}>
                  <MaterialIcons
                    name={isFavorite() ? "favorite" : "favorite-outline"}
                    size={24}
                    color={isFavorite() ? "#e74c3c" : "white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => currentTrack && shareTrack(currentTrack)}>
                  <Entypo name="share" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>

      {/* Keep the playlist modal if you want both drawer and playlist modal */}
      <Modal visible={showPlaylist} animationType="slide" transparent onRequestClose={() => setShowPlaylist(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {hasPermissions ? `Playlist (${filteredAudioFiles.length}/${totalAudioCount})` : "No Permission"}
              </Text>
              <TouchableOpacity onPress={() => setShowPlaylist(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search songs or artists..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {!hasPermissions ? (
              <View style={styles.noPermissionContainer}>
                <Text style={styles.noPermissionText}>Please grant media library permission</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={getPermissionsAndLoadAudio}>
                  <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={filteredAudioFiles}
                keyExtractor={(item) => item.id}
                getItemLayout={(_, index) => ({ length: 80, offset: 80 * index, index })}
                onScrollToIndexFailed={onScrollToIndexFailed}
                ListHeaderComponent={
                  <View style={styles.playlistStats}>
                    <Text style={styles.statsText}>
                      {filteredAudioFiles.length} songs • {formatTotalDuration(filteredAudioFiles)}
                    </Text>
                  </View>
                }
                ListEmptyComponent={
                  <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyListText}>No audio files found</Text>
                  </View>
                }
                renderItem={({ item, index }) => {
                  const actualIndex = audioFiles.findIndex((f) => f.id === item.id);
                  const isCurrentTrack = actualIndex === currentTrackIndex;
                  const progress = isCurrentTrack && durationMillis > 0 ? (positionMillis / durationMillis) * 100 : 0;
                  const art = getAlbumArt(item);

                  return (
                    <TouchableOpacity
                      style={[styles.playlistItem, isCurrentTrack && styles.playlistItemActive]}
                      onPress={() => playTrackFromList(index)}
                    >
                      <Image 
                        source={art || defaultImage} 
                        style={styles.playlistImage}
                        defaultSource={defaultImage}
                      />

                      <View style={styles.playlistInfo}>
                        <Text style={[styles.playlistTitle, isCurrentTrack && { color: "#9b59b6" }]} numberOfLines={1}>
                          {item.filename.replace(/\.[^/.]+$/, "")}
                        </Text>
                        <Text style={styles.playlistArtist} numberOfLines={1}>
                          {item.artist || "Unknown Artist"}
                        </Text>
                        {isCurrentTrack && (
                          <View style={styles.playlistProgressContainer}>
                            <View style={[styles.playlistProgress, { width: `${progress}%` }]} />
                          </View>
                        )}
                      </View>

                      <View style={styles.playlistActions}>
                        {isCurrentTrack && (
                          <TouchableOpacity onPress={playPauseHandler} style={styles.playPauseButton}>
                            <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={30} color="#9b59b6" />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.shareButton}>
                          <MaterialIcons
                            name={isFavorite(item.id) ? "favorite" : "favorite-outline"}
                            size={20}
                            color={isFavorite(item.id) ? "#e74c3c" : "#999"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => shareTrack(item)} style={styles.shareButton}>
                          <Entypo name="share" size={20} color="#999" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Main PlayerScreen with Drawer - this is the default export
export default function PlayerScreen() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#333',
          width: 280,
        },
        drawerLabelStyle: {
          color: 'white',
        },
      }}
    >
      <Drawer.Screen 
        name="Now Playing" 
        component={PlayerContent}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="musical-notes" size={22} color="white" />
          ),
        }}
      />
      <Drawer.Screen 
        name="Downloads" 
        component={DownloadListScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="download" size={22} color="white" />
          ),
        }}
      />
      <Drawer.Screen 
        name="Favourites" 
        component={FavouriteScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="heart" size={22} color="white" />
          ),
        }}
      />
      <Drawer.Screen 
        name="Local Files" 
        component={LocalTracksListScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="folder" size={22} color="white" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function formatTime(millis) {
  if (!millis) return "00:00";
  const s = Math.floor(millis / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function formatTotalDuration(files) {
  const s = files.reduce((a, f) => a + (f.duration || 0), 0);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h} hr ${m} min` : `${m} min`;
}