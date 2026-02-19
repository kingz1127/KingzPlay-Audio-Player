import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  // playScreenBody: {
  //   flex: 1,
  //   alignItems: 'center',
  //   // justifyContent: 'center',
  //   // paddingTop: 45,
  //   // paddingBottom: 25,
  //   flexDirection: 'column',
  //   marginTop: 150
  // },
  // headerIcons:{
  //   flex: 1,
  //   flexDirection: "row",
  //   // alignItems: 'center',
  //   justifyContent: "space-between",
  //   columnGap: 250,
  //   marginTop: 40,
  //   // paddingLeft: 25,
  //   // paddingRight: 25
  // },
  // musicTitle: {
  //   fontSize: 30,
  //   marginTop: 32,
    
  // },
  // ah: {
  //   flex: 1,
  //   flexDirection: 'column',
  //   // marginLeft: 10,
  //   // marginRight: 10,
   
  // },
  // musicMinutes: {
  //   // flex: 1,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: 'center',
  //   columnGap: 280,
  //   marginTop: 10
  // },
  
  // playerControls:{
  //   // flex: 1,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   // columnGap: 30,
  //   paddingLeft: 20,
  //   paddingRight: 20
  // },
  // plays: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   columnGap: 20
  // }
//    playScreenBody: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     flexDirection: 'column',
    
//   //   marginTop: 150
//   },
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(243, 237, 237, 0.3)', 
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     // paddingHorizontal: 20,
//   },
//   playImage: {
//     marginBottom: 20,
//     shadowColor: "#090909",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   musicMinutes: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 10,
//     paddingLeft: 10,
//     paddingRight: 10,
    
//   },
//   seekBar: {
//     // flex: 1,
//     alignItems: 'center',
//     width: 360
//   },
//   playerControls: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     width: '100%',
//     // marginVertical: 20,
//   },
//   plays: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     columnGap: 20
//   },
//   bottomIcons: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//     marginTop: 20,
//   },
// })
playScreenBody: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  playImage: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  trackTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  trackArtist: {
    color: '#rgba(255,255,255,0.7)',
    fontSize: 16,
  },
  musicMinutes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginVertical: 30,
  },
  plays: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  bottomIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  playlistItemActive: {
    backgroundColor: '#rgba(155, 89, 182, 0.2)',
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  playlistArtist: {
    color: '#rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  // Add these to your existing styles
searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#333',
  borderRadius: 25,
  marginHorizontal: 20,
  marginVertical: 15,
  paddingHorizontal: 15,
  paddingVertical: 8,
},
searchIcon: {
  marginRight: 10,
},
searchInput: {
  flex: 1,
  color: 'white',
  fontSize: 16,
  paddingVertical: 8,
},
playlistStats: {
  paddingHorizontal: 20,
  paddingBottom: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#333',
},
statsText: {
  color: '#999',
  fontSize: 14,
},
playlistActions: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
shareButton: {
  padding: 5,
},
playNextButton: {
  padding: 5,
},
playlistProgressContainer: {
  height: 2,
  backgroundColor: '#333',
  marginTop: 5,
  borderRadius: 1,
},
playlistProgress: {
  height: 2,
  backgroundColor: '#9b59b6',
  borderRadius: 1,
},
});

export default styles;