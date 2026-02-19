// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { TouchableOpacity } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import HomeScreen from "./screens/HomeSreen";
// import PlayerScreen from "./screens/PlayerSreen";
// import DownloadListScreen from "./screens/DownloadListSreeen";
// import LocalTracksListScreen from "./screens/LocalTracksListSreen";
// import FavouriteScreen from "./screens/FavouriteScreen";

// import { AudioProvider } from "./context/AudioContext";

// const Stack = createNativeStackNavigator();
// const Drawer = createDrawerNavigator();


// function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       screenOptions={({ navigation }) => ({
        
//         headerLeft: () => (
//           <TouchableOpacity
//             onPress={() => navigation.toggleDrawer()}
//             style={{ marginLeft: 15 }}
//           >
//             <Ionicons name="menu" size={25} color="black" />
//           </TouchableOpacity>
//         ),
//       })}
//     >
//       <Drawer.Screen name="Home" component={PlayerScreen} />
//       <Drawer.Screen name="Downloads" component={DownloadListScreen} />
//       <Drawer.Screen name="Favourites" component={FavouriteScreen} />
//       <Drawer.Screen name="Local Files" component={LocalTracksListScreen} />
//     </Drawer.Navigator>

    
//   );
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="HomeScreen" component={HomeScreen} />
//         <Stack.Screen name="PlayerScreen" component={DrawerNavigator} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }



import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeSreen";
import PlayerScreen from "./screens/PlayerSreen";
import DownloadListScreen from "./screens/DownloadListSreeen";
import LocalTracksListScreen from "./screens/LocalTracksListSreen";
import FavouriteScreen from "./screens/FavouriteScreen";

import { AudioProvider } from "./context/AudioContext";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu" size={25} color="black" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="Home" component={PlayerScreen} />
      <Drawer.Screen name="Downloads" component={DownloadListScreen} />
      <Drawer.Screen name="Favourites" component={FavouriteScreen} />
      <Drawer.Screen name="Local Files" component={LocalTracksListScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="PlayerScreen" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
}