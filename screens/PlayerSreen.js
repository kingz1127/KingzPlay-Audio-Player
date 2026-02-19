

// import React, { useState, useEffect, useRef } from "react";
// import { 
//   Image, ImageBackground, Text, View, TouchableOpacity, 
//   FlatList, Modal, ActivityIndicator, TextInput, Animated, 
//   Easing, Alert, Share 
// } from "react-native";
// import { Audio } from "expo-av";
// import * as MediaLibrary from "expo-media-library";
// import * as FileSystem from 'expo-file-system';
// import styles from "../styles/PlayerScreen.styles";
// import SeekBar from "../components/ui/SeekBar";
// import { AntDesign, Entypo, EvilIcons, Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// export default function PlayerScreen() {
//   const size = 200;
//   const soundRef = useRef(new Audio.Sound());
  
//   // Add this ref for the FlatList
//   const flatListRef = useRef(null);
  
//   // Animation for rotating image
//   const rotateAnimation = useRef(new Animated.Value(0)).current;
  
//   // Audio states
//   const [audioFiles, setAudioFiles] = useState([]);
//   const [filteredAudioFiles, setFilteredAudioFiles] = useState([]);
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [durationMillis, setDurationMillis] = useState(0);
//   const [positionMillis, setPositionMillis] = useState(0);
//   const [sliderValue, setSliderValue] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSoundLoaded, setIsSoundLoaded] = useState(false);
//   const [totalAudioCount, setTotalAudioCount] = useState(0);
  
//   // Playback states
//   const [repeatMode, setRepeatMode] = useState('off');
//   const [shuffleMode, setShuffleMode] = useState(false);
//   const [shuffledIndices, setShuffledIndices] = useState([]);
  
//   // UI states
//   const [showPlaylist, setShowPlaylist] = useState(false);
//   const [favorites, setFavorites] = useState([]);
//   const [hasPermissions, setHasPermissions] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // Cache for album art
//   const [albumArtCache, setAlbumArtCache] = useState({});
  
//   // Default image for songs without album art
//   const defaultImage = require("../assets/images/KingzPlaylogo2.png");

//   // Rotation animation
//   useEffect(() => {
//     let animation;
    
//     if (isPlaying) {
//       animation = Animated.loop(
//         Animated.timing(rotateAnimation, {
//           toValue: 1,
//           duration: 5000,
//           easing: Easing.linear,
//           useNativeDriver: true,
//         })
//       );
//       animation.start();
//     } else {
//       rotateAnimation.stopAnimation();
//     }

//     return () => {
//       if (animation) {
//         animation.stop();
//       }
//     };
//   }, [isPlaying]);

//   const spin = rotateAnimation.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0deg', '360deg']
//   });

//   // Add this effect to scroll to the current track when the playlist opens
//   useEffect(() => {
//     if (showPlaylist && filteredAudioFiles.length > 0) {
//       // Find the index of the current track in the filtered list
//       const currentFilteredIndex = filteredAudioFiles.findIndex(
//         item => item.id === audioFiles[currentTrackIndex]?.id
//       );
      
//       // Scroll to the current track after a short delay to allow the modal to render
//       if (currentFilteredIndex !== -1 && flatListRef.current) {
//         setTimeout(() => {
//           flatListRef.current.scrollToIndex({
//             index: currentFilteredIndex,
//             animated: true,
//             viewPosition: 0.5, // Center the item in the view
//           });
//         }, 300);
//       }
//     }
//   }, [showPlaylist, filteredAudioFiles, currentTrackIndex]);

//   // Request permissions and load audio files on mount
//   useEffect(() => {
//     getPermissionsAndLoadAudio();
//   }, []);

//   // Filter audio files based on search query
//   useEffect(() => {
//     if (audioFiles.length > 0) {
//       const filtered = audioFiles.filter(item => 
//         item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (item.artist && item.artist.toLowerCase().includes(searchQuery.toLowerCase()))
//       );
//       setFilteredAudioFiles(filtered);
//     }
//   }, [searchQuery, audioFiles]);

//   // Update slider value and position during playback
//   useEffect(() => {
//     let interval;
//     if (isPlaying && isSoundLoaded) {
//       interval = setInterval(updatePosition, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isPlaying, isSoundLoaded]);

//   // Load audio file when track changes
//   useEffect(() => {
//     if (audioFiles.length > 0) {
//       loadAudio();
//     }
//   }, [currentTrackIndex, audioFiles]);

//   const getPermissionsAndLoadAudio = async () => {
//     try {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status === 'granted') {
//         setHasPermissions(true);
        
//         // Get total count first
//         const totalAssets = await MediaLibrary.getAssetsAsync({
//           mediaType: 'audio',
//           first: 1,
//         });
//         setTotalAudioCount(totalAssets.totalCount);
        
//         // Load all audio files
//         const media = await MediaLibrary.getAssetsAsync({
//           mediaType: 'audio',
//           first: 1000,
//         });
        
//         // Get additional info for each asset
//         const assetsWithInfo = await Promise.all(
//           media.assets.map(async (asset) => {
//             try {
//               const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
              
//               // Try to extract album art
//               let artwork = null;
//               try {
//                 // For Android, we can try to get the album art from the file's parent directory
//                 if (assetInfo.albumId && assetInfo.album) {
//                   // You might need to implement a native module for full album art extraction
//                   // For now, we'll use a colored background based on the album name as fallback
//                 }
//               } catch (artError) {
//                 console.log('Could not extract album art:', artError);
//               }
              
//               return {
//                 ...asset,
//                 artist: assetInfo.artist || 'Unknown Artist',
//                 album: assetInfo.album || 'Unknown Album',
//                 duration: assetInfo.duration,
//                 artwork: null, // We'll use the default image for now
//               };
//             } catch (error) {
//               return {
//                 ...asset,
//                 artist: 'Unknown Artist',
//                 album: 'Unknown Album',
//                 artwork: null,
//               };
//             }
//           })
//         );
        
//         setAudioFiles(assetsWithInfo);
//         setFilteredAudioFiles(assetsWithInfo);
        
//         // Initialize shuffled indices
//         const indices = Array.from({ length: assetsWithInfo.length }, (_, i) => i);
//         setShuffledIndices(shuffleArray(indices));
//       } else {
//         console.log('Permission to access media library denied');
//       }
//     } catch (error) {
//       console.error('Error loading audio:', error);
//     }
//   };

//   const shuffleArray = (array) => {
//     const newArray = [...array];
//     for (let i = newArray.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//     }
//     return newArray;
//   };

//   const loadAudio = async () => {
//     if (audioFiles.length === 0 || !audioFiles[currentTrackIndex]) return;
    
//     try {
//       setIsLoading(true);
//       setIsSoundLoaded(false);
      
//       // Unload previous sound if exists
//       if (soundRef.current) {
//         await soundRef.current.unloadAsync();
//       }
      
//       // Create new sound instance
//       soundRef.current = new Audio.Sound();
      
//       // Load new sound
//       await soundRef.current.loadAsync({ uri: audioFiles[currentTrackIndex].uri });
      
//       // Get duration
//       const status = await soundRef.current.getStatusAsync();
//       setDurationMillis(status.durationMillis || 0);
//       setPositionMillis(0);
//       setSliderValue(0);
      
//       // Set up playback status update
//       soundRef.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      
//       setIsSoundLoaded(true);
      
//       // Auto-play if was playing previously
//       if (isPlaying) {
//         await soundRef.current.playAsync();
//       }
      
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error loading audio:', error);
//       setIsLoading(false);
//       setIsSoundLoaded(false);
//     }
//   };

//   const onPlaybackStatusUpdate = (status) => {
//     if (status.isLoaded) {
//       setPositionMillis(status.positionMillis);
//       setSliderValue(status.positionMillis);
//       setIsPlaying(status.isPlaying);
      
//       if (status.didJustFinish) {
//         handleTrackEnd();
//       }
//     }
//   };

//   const handleTrackEnd = () => {
//     if (repeatMode === 'one') {
//       // Repeat current track endlessly
//       replayCurrentTrack();
//     } else if (repeatMode === 'all') {
//       // Play next track (loop to first if at end)
//       playNextTrack();
//     } else {
//       // Stop playback
//       setIsPlaying(false);
//       setPositionMillis(0);
//       setSliderValue(0);
//     }
//   };

//   const replayCurrentTrack = async () => {
//     try {
//       if (soundRef.current && isSoundLoaded) {
//         // Reset position to 0
//         await soundRef.current.setPositionAsync(0);
//         // Play from start
//         await soundRef.current.playAsync();
//         setIsPlaying(true);
//       }
//     } catch (error) {
//       console.error('Error replaying track:', error);
//     }
//   };
  
//   const updatePosition = async () => {
//     if (soundRef.current && isSoundLoaded) {
//       try {
//         const status = await soundRef.current.getStatusAsync();
//         if (status.isLoaded) {
//           setPositionMillis(status.positionMillis);
//           setSliderValue(status.positionMillis);
//         }
//       } catch (error) {
//         console.error('Error updating position:', error);
//       }
//     }
//   };

//   const playPauseHandler = async () => {
//     if (isLoading || !isSoundLoaded) {
//       if (audioFiles.length > 0 && !isSoundLoaded) {
//         await loadAudio();
//       }
//       return;
//     }

//     try {
//       if (isPlaying) {
//         await soundRef.current.pauseAsync();
//       } else {
//         await soundRef.current.playAsync();
//       }
//     } catch (error) {
//       console.error('Error playing/pausing:', error);
//     }
//   };

//   const playNextTrack = () => {
//     if (audioFiles.length === 0) return;
    
//     let nextIndex;
    
//     if (shuffleMode && shuffledIndices.length > 0) {
//       const currentShuffleIndex = shuffledIndices.indexOf(currentTrackIndex);
//       const nextShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
//       nextIndex = shuffledIndices[nextShuffleIndex];
//     } else {
//       nextIndex = (currentTrackIndex + 1) % audioFiles.length;
//     }
    
//     setCurrentTrackIndex(nextIndex);
//   };

//   const playPreviousTrack = () => {
//     if (audioFiles.length === 0) return;
    
//     let prevIndex;
    
//     if (shuffleMode && shuffledIndices.length > 0) {
//       const currentShuffleIndex = shuffledIndices.indexOf(currentTrackIndex);
//       const prevShuffleIndex = (currentShuffleIndex - 1 + shuffledIndices.length) % shuffledIndices.length;
//       prevIndex = shuffledIndices[prevShuffleIndex];
//     } else {
//       prevIndex = (currentTrackIndex - 1 + audioFiles.length) % audioFiles.length;
//     }
    
//     setCurrentTrackIndex(prevIndex);
//   };

//   const toggleShuffle = () => {
//     if (!shuffleMode && audioFiles.length > 0) {
//       const indices = Array.from({ length: audioFiles.length }, (_, i) => i);
//       setShuffledIndices(shuffleArray(indices));
//     }
//     setShuffleMode(!shuffleMode);
//   };

//   const toggleRepeat = () => {
//     const modes = ['off', 'one', 'all'];
//     const currentIndex = modes.indexOf(repeatMode);
//     const nextIndex = (currentIndex + 1) % modes.length;
//     setRepeatMode(modes[nextIndex]);
//   };

//   const getRepeatIcon = () => {
//     switch(repeatMode) {
//       case 'one':
//         return <MaterialCommunityIcons name="repeat-once" size={24} color="#7db659" />;
//       case 'all':
//         return <Ionicons name="repeat" size={24} color="#09f03b" />;
//       default:
//         return <Ionicons name="repeat-outline" size={24} color="white" />;
//     }
//   };

//   const seekHandler = async (value) => {
//     setSliderValue(value);
//     setPositionMillis(value);
//     if (soundRef.current && isSoundLoaded) {
//       try {
//         await soundRef.current.setPositionAsync(value);
//       } catch (error) {
//         console.error('Error seeking:', error);
//       }
//     }
//   };

//   const toggleFavorite = () => {
//     if (audioFiles[currentTrackIndex]) {
//       const currentTrack = audioFiles[currentTrackIndex];
//       if (favorites.includes(currentTrack.id)) {
//         setFavorites(favorites.filter(id => id !== currentTrack.id));
//       } else {
//         setFavorites([...favorites, currentTrack.id]);
//       }
//     }
//   };

//   const shareTrack = async (track) => {
//     try {
//       await Share.share({
//         message: `Check out this song: ${track.filename}`,
//         title: 'Share Song',
//       });
//     } catch (error) {
//       console.error('Error sharing:', error);
//     }
//   };

//   // Generate a consistent color based on album name for visual variety
//   const getAlbumColor = (albumName) => {
//     if (!albumName) return '#333';
    
//     // Simple hash function to generate a color
//     let hash = 0;
//     for (let i = 0; i < albumName.length; i++) {
//       hash = albumName.charCodeAt(i) + ((hash << 5) - hash);
//     }
    
//     const hue = hash % 360;
//     return `hsl(${hue}, 70%, 30%)`;
//   };

//   const getAlbumArt = (track) => {
//     if (track?.artwork) {
//       return { uri: track.artwork };
//     }
    
//     // If no artwork, return default image
//     return defaultImage;
//   };

//   const getCurrentTrackName = () => {
//     if (audioFiles.length === 0 || !audioFiles[currentTrackIndex]) {
//       return "No track selected";
//     }
//     return audioFiles[currentTrackIndex].filename?.replace(/\.[^/.]+$/, "") || "Unknown Track";
//   };

//   const getCurrentArtist = () => {
//     if (audioFiles.length === 0 || !audioFiles[currentTrackIndex]) {
//       return "Unknown Artist";
//     }
//     return audioFiles[currentTrackIndex].artist || "Unknown Artist";
//   };

//   const playTrackFromList = (index) => {
//     const actualIndex = audioFiles.findIndex(
//       file => file.id === filteredAudioFiles[index].id
//     );
//     setCurrentTrackIndex(actualIndex);
//     setShowPlaylist(false);
//     setIsPlaying(true);
//   };

//   // Add this function for handling scroll errors
//   const onScrollToIndexFailed = (info) => {
//     const wait = new Promise(resolve => setTimeout(resolve, 500));
//     wait.then(() => {
//       flatListRef.current?.scrollToIndex({
//         index: info.index,
//         animated: true,
//         viewPosition: 0.5,
//       });
//     });
//   };

//   return (
//     <View style={styles.playScreenBody}>
//       <ImageBackground
//         source={audioFiles[currentTrackIndex] ? getAlbumArt(audioFiles[currentTrackIndex]) : defaultImage}
//         style={styles.backgroundImage}
//         blurRadius={20}
//         defaultSource={defaultImage}
//       >
//         <View style={styles.overlay}>
//           <View style={styles.contentContainer}>
//             {/* Header Icons */}
//             <View style={styles.headerIcons}>
//               <TouchableOpacity onPress={() => setShowPlaylist(true)}>
//                 <Ionicons name="menu" size={35} color="white" />
//               </TouchableOpacity>
//               <Text style={styles.headerText}>Now Playing</Text>
//               <View style={{ width: 35 }} />
//             </View>

//             {/* Album Art with Rotation */}
//             <Animated.View style={[styles.playImage, { transform: [{ rotate: spin }] }]}>
//               <Image
//                 source={audioFiles[currentTrackIndex] ? getAlbumArt(audioFiles[currentTrackIndex]) : defaultImage}
//                 style={{ width: size, height: size, borderRadius: size / 2 }}
//                 defaultSource={defaultImage}
//               />
//             </Animated.View>

//             {/* Track Info */}
//             <View style={styles.trackInfo}>
//               <Text style={styles.trackTitle} numberOfLines={1}>
//                 {getCurrentTrackName()}
//               </Text>
//               <Text style={styles.trackArtist} numberOfLines={1}>
//                 {getCurrentArtist()}
//               </Text>
//             </View>

//             {/* Progress Bar */}
//             <View style={styles.ah}>
//               <View style={styles.musicMinutes}>
//                 <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
//                 <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
//               </View>

//               <View>
//                 <SeekBar
//                   durationMillis={durationMillis}
//                   positionMillis={positionMillis}
//                   sliderValue={sliderValue}
//                   onSlidingComplete={seekHandler}
//                 />
//               </View>

//               {/* Playback Controls */}
//               <View style={styles.playerControls}>
//                 <TouchableOpacity onPress={toggleShuffle}>
//                   <Ionicons 
//                     name="shuffle-outline" 
//                     size={24} 
//                     color={shuffleMode ? "#f808d4" : "white"} 
//                   />
//                 </TouchableOpacity>
                
//                 <View style={styles.plays}>
//                   <TouchableOpacity onPress={playPreviousTrack} disabled={audioFiles.length === 0}>
//                     <AntDesign name="step-backward" size={28} color={audioFiles.length === 0 ? "#666" : "white"} />
//                   </TouchableOpacity>
                  
//                   <TouchableOpacity 
//                     onPress={playPauseHandler} 
//                     disabled={isLoading || audioFiles.length === 0}
//                   >
//                     {isLoading ? (
//                       <ActivityIndicator size="large" color="white" />
//                     ) : (
//                       <Ionicons 
//                         name={isPlaying ? "pause-circle" : "play-circle"} 
//                         size={80} 
//                         color={audioFiles.length === 0 ? "#eae6e6" : "white"}  
//                       />
//                     )}
//                   </TouchableOpacity>
                  
//                   <TouchableOpacity onPress={playNextTrack} disabled={audioFiles.length === 0}>
//                     <AntDesign name="step-forward" size={28} color={audioFiles.length === 0 ? "#fcf8f8" : "white"} />
//                   </TouchableOpacity>
//                 </View>
                
//                 <TouchableOpacity onPress={toggleRepeat}>
//                   {getRepeatIcon()}
//                 </TouchableOpacity>
//               </View>

//               {/* Bottom Icons */}
//               <View style={styles.bottomIcons}>
//                 <TouchableOpacity>
//                   <AntDesign name="download" size={24} color="white" />
//                 </TouchableOpacity>
                
//                 <TouchableOpacity onPress={toggleFavorite} disabled={audioFiles.length === 0}>
//                   <MaterialIcons 
//                     name={audioFiles[currentTrackIndex] && favorites.includes(audioFiles[currentTrackIndex]?.id) ? "favorite" : "favorite-outline"} 
//                     size={24} 
//                     color={audioFiles[currentTrackIndex] && favorites.includes(audioFiles[currentTrackIndex]?.id) ? "#e74c3c" : "white"} 
//                   />
//                 </TouchableOpacity>
                
//                 <TouchableOpacity>
//                   <Entypo name="share" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Playlist Modal */}
//         <Modal
//           visible={showPlaylist}
//           animationType="slide"
//           transparent={true}
//           onRequestClose={() => setShowPlaylist(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>
//                   {hasPermissions ? `Playlist (${filteredAudioFiles.length}/${totalAudioCount})` : 'No Permission'}
//                 </Text>
//                 <TouchableOpacity onPress={() => setShowPlaylist(false)}>
//                   <Ionicons name="close" size={24} color="white" />
//                 </TouchableOpacity>
//               </View>

//               {/* Search Bar */}
//               <View style={styles.searchContainer}>
//                 <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
//                 <TextInput
//                   style={styles.searchInput}
//                   placeholder="Search songs or artists..."
//                   placeholderTextColor="#999"
//                   value={searchQuery}
//                   onChangeText={setSearchQuery}
//                 />
//                 {searchQuery.length > 0 && (
//                   <TouchableOpacity onPress={() => setSearchQuery('')}>
//                     <Ionicons name="close-circle" size={20} color="#999" />
//                   </TouchableOpacity>
//                 )}
//               </View>
              
//               {!hasPermissions ? (
//                 <View style={styles.noPermissionContainer}>
//                   <Text style={styles.noPermissionText}>
//                     Please grant media library permission to access your audio files
//                   </Text>
//                   <TouchableOpacity 
//                     style={styles.permissionButton}
//                     onPress={getPermissionsAndLoadAudio}
//                   >
//                     <Text style={styles.permissionButtonText}>Grant Permission</Text>
//                   </TouchableOpacity>
//                 </View>
//               ) : (
//                 <FlatList
//                   ref={flatListRef}
//                   data={filteredAudioFiles}
//                   keyExtractor={(item) => item.id}
//                   renderItem={({ item, index }) => {
//                     const actualIndex = audioFiles.findIndex(f => f.id === item.id);
//                     const isCurrentTrack = actualIndex === currentTrackIndex;
//                     const progress = isCurrentTrack && durationMillis > 0 
//                       ? (positionMillis / durationMillis) * 100 
//                       : 0;
                    
//                     return (
//                       <TouchableOpacity 
//                         style={[
//                           styles.playlistItem,
//                           isCurrentTrack && styles.playlistItemActive
//                         ]}
//                         onPress={() => playTrackFromList(index)}
//                       >
//                         <Image 
//                           source={getAlbumArt(item)}
//                           style={styles.playlistImage}
//                           defaultSource={defaultImage}
//                         />
//                         <View style={styles.playlistInfo}>
//                           <Text style={styles.playlistTitle} numberOfLines={1}>
//                             {item.filename.replace(/\.[^/.]+$/, "")}
//                           </Text>
//                           <Text style={styles.playlistArtist} numberOfLines={1}>
//                             {item.artist || "Unknown Artist"}
//                           </Text>
//                           {isCurrentTrack && (
//                             <View style={styles.playlistProgressContainer}>
//                               <View style={[styles.playlistProgress, { width: `${progress}%` }]} />
//                             </View>
//                           )}
//                         </View>
                        
//                         {/* Action buttons */}
//                        {/* Action buttons */}
// <View style={styles.playlistActions}>
//   {isCurrentTrack && (
//     <TouchableOpacity 
//       onPress={() => {
//         playPauseHandler();
//         // Don't close the playlist
//       }}
//       style={styles.playPauseButton}
//     >
//       <Ionicons 
//         name={isPlaying ? "pause-circle" : "play-circle"} 
//         size={30} 
//         color="#9b59b6" 
//       />
//     </TouchableOpacity>
//   )}
//   <TouchableOpacity 
//     onPress={() => shareTrack(item)}
//     style={styles.shareButton}
//   >
//     <Entypo name="share" size={20} color="#999" />
//   </TouchableOpacity>
//   <TouchableOpacity 
//     onPress={() => {
//       const nextIndex = (actualIndex + 1) % audioFiles.length;
//       setCurrentTrackIndex(nextIndex);
//       setShowPlaylist(false);
//       setIsPlaying(true);
//     }}
//     style={styles.playNextButton}
//   >
//     <MaterialCommunityIcons name="play-next" size={20} color="#999" />
//   </TouchableOpacity>
// </View>
//                       </TouchableOpacity>
//                     );
//                   }}
//                   ListHeaderComponent={
//                     <View style={styles.playlistStats}>
//                       <Text style={styles.statsText}>
//                         {filteredAudioFiles.length} songs • {formatTotalDuration(filteredAudioFiles)}
//                       </Text>
//                     </View>
//                   }
//                   ListEmptyComponent={
//                     <View style={styles.emptyListContainer}>
//                       <Text style={styles.emptyListText}>No audio files found</Text>
//                     </View>
//                   }
//                   getItemLayout={(data, index) => ({
//                     length: 80, // Approximate height of each item
//                     offset: 80 * index,
//                     index,
//                   })}
//                   onScrollToIndexFailed={onScrollToIndexFailed}
//                 />
//               )}
//             </View>
//           </View>
//         </Modal>
//       </ImageBackground>
//     </View>
//   );
// }

// function formatTime(millis) {
//   if (!millis) return "00:00";
//   const totalSeconds = Math.floor(millis / 1000);
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
  
//   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// }

// function formatTotalDuration(files) {
//   const totalSeconds = files.reduce((acc, file) => acc + (file.duration || 0), 0);
//   const hours = Math.floor(totalSeconds / 3600);
//   const minutes = Math.floor((totalSeconds % 3600) / 60);
  
//   if (hours > 0) {
//     return `${hours} hr ${minutes} min`;
//   }
//   return `${minutes} min`;
// }

import React, { useState, useEffect, useRef } from "react";
import {
  Image, ImageBackground, Text, View, TouchableOpacity,
  FlatList, Modal, ActivityIndicator, TextInput, Animated,
  Easing, Share, StyleSheet,
} from "react-native";
import { useAudio } from "../context/AudioContext";
import styles from "../styles/PlayerScreen.styles";
import SeekBar from "../components/ui/SeekBar";
import { AntDesign, Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function PlayerScreen() {
  const size = 200;
  const flatListRef = useRef(null);
  const rotateAnimation = useRef(new Animated.Value(0)).current;

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
              <TouchableOpacity onPress={() => setShowPlaylist(true)}>
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

      {/* Playlist Modal */}
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