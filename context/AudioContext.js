// import React, { createContext, useContext, useState, useRef, useEffect } from "react";
// import { Audio } from "expo-av";
// import * as MediaLibrary from "expo-media-library";

// const AudioContext = createContext();

// export const useAudio = () => useContext(AudioContext);

// export function AudioProvider({ children }) {
//   const soundRef = useRef(new Audio.Sound());

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
//   const [repeatMode, setRepeatModeState] = useState("off");
//   const [shuffleMode, setShuffleMode] = useState(false);
//   const [shuffledIndices, setShuffledIndices] = useState([]);
//   const [hasPermissions, setHasPermissions] = useState(false);

//   // Favorites: array of track IDs
//   const [favorites, setFavorites] = useState([]);

//   // Which "source" is active: 'all' | 'favorites'
//   const [playbackSource, setPlaybackSource] = useState("all");

//   const defaultImage = require("../assets/images/KingzPlaylogo2.png");

//   useEffect(() => {
//     getPermissionsAndLoadAudio();
//   }, []);

//   useEffect(() => {
//     if (audioFiles.length > 0) {
//       loadAudio();
//     }
//   }, [currentTrackIndex, audioFiles]);

//   useEffect(() => {
//     let interval;
//     if (isPlaying && isSoundLoaded) {
//       interval = setInterval(updatePosition, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isPlaying, isSoundLoaded]);

//   const shuffleArray = (array) => {
//     const newArray = [...array];
//     for (let i = newArray.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
//     }
//     return newArray;
//   };

//   const getPermissionsAndLoadAudio = async () => {
//     try {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       if (status === "granted") {
//         setHasPermissions(true);
//         const totalAssets = await MediaLibrary.getAssetsAsync({
//           mediaType: "audio",
//           first: 1,
//         });
//         setTotalAudioCount(totalAssets.totalCount);

//         const media = await MediaLibrary.getAssetsAsync({
//           mediaType: "audio",
//           first: 1000,
//         });

//         const assetsWithInfo = await Promise.all(
//           media.assets.map(async (asset) => {
//             try {
//               const assetInfo = await MediaLibrary.getAssetInfoAsync(asset.id);
//               return {
//                 ...asset,
//                 artist: assetInfo.artist || "Unknown Artist",
//                 album: assetInfo.album || "Unknown Album",
//                 duration: assetInfo.duration,
//                 artwork: null,
//               };
//             } catch {
//               return {
//                 ...asset,
//                 artist: "Unknown Artist",
//                 album: "Unknown Album",
//                 artwork: null,
//               };
//             }
//           })
//         );

//         setAudioFiles(assetsWithInfo);
//         setFilteredAudioFiles(assetsWithInfo);
//         const indices = Array.from(
//           { length: assetsWithInfo.length },
//           (_, i) => i
//         );
//         setShuffledIndices(shuffleArray(indices));
//       }
//     } catch (error) {
//       console.error("Error loading audio:", error);
//     }
//   };

//   const loadAudio = async () => {
//     if (audioFiles.length === 0 || !audioFiles[currentTrackIndex]) return;
//     try {
//       setIsLoading(true);
//       setIsSoundLoaded(false);
//       if (soundRef.current) await soundRef.current.unloadAsync();
//       soundRef.current = new Audio.Sound();
//       await soundRef.current.loadAsync({
//         uri: audioFiles[currentTrackIndex].uri,
//       });
//       const status = await soundRef.current.getStatusAsync();
//       setDurationMillis(status.durationMillis || 0);
//       setPositionMillis(0);
//       setSliderValue(0);
//       soundRef.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
//       setIsSoundLoaded(true);
//       if (isPlaying) await soundRef.current.playAsync();
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error loading audio:", error);
//       setIsLoading(false);
//       setIsSoundLoaded(false);
//     }
//   };

//   const onPlaybackStatusUpdate = (status) => {
//     if (status.isLoaded) {
//       setPositionMillis(status.positionMillis);
//       setSliderValue(status.positionMillis);
//       setIsPlaying(status.isPlaying);
//       if (status.didJustFinish) handleTrackEnd();
//     }
//   };

//   const handleTrackEnd = () => {
//     if (repeatMode === "one") replayCurrentTrack();
//     else if (repeatMode === "all") playNextTrack();
//     else {
//       setIsPlaying(false);
//       setPositionMillis(0);
//       setSliderValue(0);
//     }
//   };

//   const replayCurrentTrack = async () => {
//     try {
//       if (soundRef.current && isSoundLoaded) {
//         await soundRef.current.setPositionAsync(0);
//         await soundRef.current.playAsync();
//         setIsPlaying(true);
//       }
//     } catch (error) {
//       console.error("Error replaying:", error);
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
//       } catch {}
//     }
//   };

//   const playPauseHandler = async () => {
//     if (isLoading || !isSoundLoaded) {
//       if (audioFiles.length > 0 && !isSoundLoaded) await loadAudio();
//       return;
//     }
//     try {
//       if (isPlaying) await soundRef.current.pauseAsync();
//       else await soundRef.current.playAsync();
//     } catch (error) {
//       console.error("Error play/pause:", error);
//     }
//   };

//   // Play from a specific queue (all files or favorites list)
//   const playTrackById = async (trackId, sourceList) => {
//     const indexInAll = audioFiles.findIndex((f) => f.id === trackId);
//     if (indexInAll === -1) return;
//     setCurrentTrackIndex(indexInAll);
//     setIsPlaying(true);
//   };

//   const playNextTrack = (sourceList) => {
//     const queue = sourceList || audioFiles;
//     if (queue.length === 0) return;
//     const currentId = audioFiles[currentTrackIndex]?.id;
//     const currentInQueue = queue.findIndex((f) => f.id === currentId);

//     let nextInQueue;
//     if (shuffleMode && shuffledIndices.length > 0) {
//       nextInQueue = Math.floor(Math.random() * queue.length);
//     } else {
//       nextInQueue = (currentInQueue + 1) % queue.length;
//     }
//     const nextId = queue[nextInQueue]?.id;
//     const nextIndex = audioFiles.findIndex((f) => f.id === nextId);
//     if (nextIndex !== -1) setCurrentTrackIndex(nextIndex);
//   };

//   const playPreviousTrack = (sourceList) => {
//     const queue = sourceList || audioFiles;
//     if (queue.length === 0) return;
//     const currentId = audioFiles[currentTrackIndex]?.id;
//     const currentInQueue = queue.findIndex((f) => f.id === currentId);
//     const prevInQueue =
//       (currentInQueue - 1 + queue.length) % queue.length;
//     const prevId = queue[prevInQueue]?.id;
//     const prevIndex = audioFiles.findIndex((f) => f.id === prevId);
//     if (prevIndex !== -1) setCurrentTrackIndex(prevIndex);
//   };

//   const toggleShuffle = () => {
//     if (!shuffleMode && audioFiles.length > 0) {
//       const indices = Array.from({ length: audioFiles.length }, (_, i) => i);
//       setShuffledIndices(shuffleArray(indices));
//     }
//     setShuffleMode(!shuffleMode);
//   };

//   const toggleRepeat = () => {
//     const modes = ["off", "one", "all"];
//     const currentIndex = modes.indexOf(repeatMode);
//     setRepeatModeState(modes[(currentIndex + 1) % modes.length]);
//   };

//   const seekHandler = async (value) => {
//     setSliderValue(value);
//     setPositionMillis(value);
//     if (soundRef.current && isSoundLoaded) {
//       try {
//         await soundRef.current.setPositionAsync(value);
//       } catch {}
//     }
//   };

//   const toggleFavorite = (trackId) => {
//     const id = trackId || audioFiles[currentTrackIndex]?.id;
//     if (!id) return;
//     setFavorites((prev) =>
//       prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
//     );
//   };

//   const isFavorite = (trackId) => {
//     const id = trackId || audioFiles[currentTrackIndex]?.id;
//     return favorites.includes(id);
//   };

//   const favoriteFiles = audioFiles.filter((f) => favorites.includes(f.id));

//   const deleteTrack = (trackId) => {
//     setAudioFiles((prev) => prev.filter((f) => f.id !== trackId));
//     setFilteredAudioFiles((prev) => prev.filter((f) => f.id !== trackId));
//     setFavorites((prev) => prev.filter((id) => id !== trackId));
//   };

//   const getAlbumArt = (track) => {
//     if (track?.artwork) return { uri: track.artwork };
//     return defaultImage;
//   };

//   const getTrackColor = (filename = "") => {
//     const colors = [
//       "#e74c3c","#8e44ad","#2980b9","#27ae60",
//       "#f39c12","#16a085","#d35400","#2c3e50",
//       "#c0392b","#6c3483","#1a5276","#1e8449",
//     ];
//     let hash = 0;
//     for (let i = 0; i < filename.length; i++) {
//       hash = filename.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     return colors[Math.abs(hash) % colors.length];
//   };

//   return (
//     <AudioContext.Provider
//       value={{
//         soundRef,
//         audioFiles,
//         setAudioFiles,
//         filteredAudioFiles,
//         setFilteredAudioFiles,
//         currentTrackIndex,
//         setCurrentTrackIndex,
//         isPlaying,
//         setIsPlaying,
//         durationMillis,
//         positionMillis,
//         sliderValue,
//         isLoading,
//         isSoundLoaded,
//         totalAudioCount,
//         repeatMode,
//         shuffleMode,
//         shuffledIndices,
//         hasPermissions,
//         favorites,
//         favoriteFiles,
//         defaultImage,
//         playbackSource,
//         setPlaybackSource,
//         getPermissionsAndLoadAudio,
//         loadAudio,
//         playPauseHandler,
//         playNextTrack,
//         playPreviousTrack,
//         playTrackById,
//         toggleShuffle,
//         toggleRepeat,
//         seekHandler,
//         toggleFavorite,
//         isFavorite,
//         deleteTrack,
//         getAlbumArt,
//         getTrackColor,
//       }}
//     >
//       {children}
//     </AudioContext.Provider>
//   );
// }


import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Audio } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const AudioContext = createContext();
export const useAudio = () => useContext(AudioContext);

async function findFolderArt(uri) {
  try {
    const dir = uri.substring(0, uri.lastIndexOf("/") + 1);
    const candidates = [
      "cover.jpg","Cover.jpg","COVER.jpg",
      "folder.jpg","Folder.jpg","FOLDER.jpg",
      "album.jpg","Album.jpg","ALBUM.jpg",
      "artwork.jpg","cover.png","folder.png","album.png",
    ];
    for (const name of candidates) {
      const info = await FileSystem.getInfoAsync(dir + name);
      if (info.exists) return dir + name;
    }
  } catch (_) {}
  return null;
}

export function AudioProvider({ children }) {
  const soundRef = useRef(new Audio.Sound());
  const [audioFiles, setAudioFiles] = useState([]);
  const [filteredAudioFiles, setFilteredAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSoundLoaded, setIsSoundLoaded] = useState(false);
  const [totalAudioCount, setTotalAudioCount] = useState(0);
  const [repeatMode, setRepeatModeState] = useState("off");
  const [shuffleMode, setShuffleMode] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const defaultImage = require("../assets/images/KingzPlaylogo2.png");

  useEffect(() => { getPermissionsAndLoadAudio(); }, []);
  useEffect(() => { if (audioFiles.length > 0) loadAudio(); }, [currentTrackIndex, audioFiles]);
  useEffect(() => {
    let interval;
    if (isPlaying && isSoundLoaded) interval = setInterval(updatePosition, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, isSoundLoaded]);

  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const getPermissionsAndLoadAudio = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") return;
      setHasPermissions(true);
      const total = await MediaLibrary.getAssetsAsync({ mediaType: "audio", first: 1 });
      setTotalAudioCount(total.totalCount);
      const media = await MediaLibrary.getAssetsAsync({ mediaType: "audio", first: 1000 });

      const assetsWithInfo = await Promise.all(
        media.assets.map(async (asset) => {
          try {
            const info = await MediaLibrary.getAssetInfoAsync(asset.id);
            const localUri = info.localUri || asset.uri;
            const folderArt = await findFolderArt(localUri);
            return {
              ...asset,
              localUri,
              artist: info.artist || "Unknown Artist",
              album: info.album || "Unknown Album",
              duration: info.duration,
              artwork: folderArt || null,
            };
          } catch {
            return { ...asset, localUri: asset.uri, artist: "Unknown Artist", album: "Unknown Album", artwork: null };
          }
        })
      );
      setAudioFiles(assetsWithInfo);
      setFilteredAudioFiles(assetsWithInfo);
      setShuffledIndices(shuffleArray(assetsWithInfo.map((_, i) => i)));
    } catch (e) { console.error("Error loading audio:", e); }
  };

  const loadAudio = async () => {
    if (!audioFiles[currentTrackIndex]) return;
    try {
      setIsLoading(true);
      setIsSoundLoaded(false);
      if (soundRef.current) await soundRef.current.unloadAsync();
      soundRef.current = new Audio.Sound();
      await soundRef.current.loadAsync({ uri: audioFiles[currentTrackIndex].uri });
      const status = await soundRef.current.getStatusAsync();
      setDurationMillis(status.durationMillis || 0);
      setPositionMillis(0);
      setSliderValue(0);
      soundRef.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setIsSoundLoaded(true);
      if (isPlaying) await soundRef.current.playAsync();
      setIsLoading(false);
    } catch (e) { console.error(e); setIsLoading(false); setIsSoundLoaded(false); }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPositionMillis(status.positionMillis);
      setSliderValue(status.positionMillis);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) handleTrackEnd();
    }
  };

  const handleTrackEnd = () => {
    if (repeatMode === "one") replayCurrentTrack();
    else if (repeatMode === "all") playNextTrack();
    else { setIsPlaying(false); setPositionMillis(0); setSliderValue(0); }
  };

  const replayCurrentTrack = async () => {
    try {
      if (soundRef.current && isSoundLoaded) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (e) { console.error(e); }
  };

  const updatePosition = async () => {
    if (soundRef.current && isSoundLoaded) {
      try {
        const s = await soundRef.current.getStatusAsync();
        if (s.isLoaded) { setPositionMillis(s.positionMillis); setSliderValue(s.positionMillis); }
      } catch {}
    }
  };

  const playPauseHandler = async () => {
    if (isLoading || !isSoundLoaded) { if (!isSoundLoaded) await loadAudio(); return; }
    try { if (isPlaying) await soundRef.current.pauseAsync(); else await soundRef.current.playAsync(); }
    catch (e) { console.error(e); }
  };

  const playNextTrack = (sourceList) => {
    const queue = sourceList || audioFiles;
    if (!queue.length) return;
    const curId = audioFiles[currentTrackIndex]?.id;
    const curQ = queue.findIndex((f) => f.id === curId);
    const nextQ = shuffleMode ? Math.floor(Math.random() * queue.length) : (curQ + 1) % queue.length;
    const next = audioFiles.findIndex((f) => f.id === queue[nextQ]?.id);
    if (next !== -1) setCurrentTrackIndex(next);
  };

  const playPreviousTrack = (sourceList) => {
    const queue = sourceList || audioFiles;
    if (!queue.length) return;
    const curId = audioFiles[currentTrackIndex]?.id;
    const curQ = queue.findIndex((f) => f.id === curId);
    const prevQ = (curQ - 1 + queue.length) % queue.length;
    const prev = audioFiles.findIndex((f) => f.id === queue[prevQ]?.id);
    if (prev !== -1) setCurrentTrackIndex(prev);
  };

  const toggleShuffle = () => {
    if (!shuffleMode) setShuffledIndices(shuffleArray(audioFiles.map((_, i) => i)));
    setShuffleMode(!shuffleMode);
  };

  const toggleRepeat = () => {
    const modes = ["off", "one", "all"];
    setRepeatModeState(modes[(modes.indexOf(repeatMode) + 1) % modes.length]);
  };

  const seekHandler = async (value) => {
    setSliderValue(value); setPositionMillis(value);
    if (soundRef.current && isSoundLoaded) try { await soundRef.current.setPositionAsync(value); } catch {}
  };

  const toggleFavorite = (trackId) => {
    const id = trackId || audioFiles[currentTrackIndex]?.id;
    if (!id) return;
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const isFavorite = (trackId) => {
    const id = trackId || audioFiles[currentTrackIndex]?.id;
    return favorites.includes(id);
  };

  const favoriteFiles = audioFiles.filter((f) => favorites.includes(f.id));

  const deleteTrack = (trackId) => {
    setAudioFiles((p) => p.filter((f) => f.id !== trackId));
    setFilteredAudioFiles((p) => p.filter((f) => f.id !== trackId));
    setFavorites((p) => p.filter((id) => id !== trackId));
  };

  // Returns { uri } for real art, or null — screens must handle null
  const getAlbumArt = (track) => track?.artwork ? { uri: track.artwork } : null;

  const getTrackColor = (filename = "") => {
    const colors = ["#c0392b","#8e44ad","#2471a3","#1e8449","#d35400","#16a085","#2c3e50","#b7950b","#6c3483","#117a65","#922b21","#1a5276"];
    let h = 0;
    for (let i = 0; i < filename.length; i++) h = filename.charCodeAt(i) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
  };

  return (
    <AudioContext.Provider value={{
      audioFiles, setAudioFiles, filteredAudioFiles, setFilteredAudioFiles,
      currentTrackIndex, setCurrentTrackIndex, isPlaying, setIsPlaying,
      durationMillis, positionMillis, sliderValue, isLoading, isSoundLoaded,
      totalAudioCount, repeatMode, shuffleMode, hasPermissions,
      favorites, favoriteFiles, defaultImage,
      getPermissionsAndLoadAudio, playPauseHandler,
      playNextTrack, playPreviousTrack, toggleShuffle, toggleRepeat, seekHandler,
      toggleFavorite, isFavorite, deleteTrack, getAlbumArt, getTrackColor,
    }}>
      {children}
    </AudioContext.Provider>
  );
}