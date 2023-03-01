import AppLoading from 'expo-app-loading';
import React from 'react';
import * as Font from 'expo-font';
import { Text, View } from 'react-native';
import { FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAssets } from 'expo-asset';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export const DARK_BASE_COLOR = '#1e272e';
export const DARK_NORMAL_COLOR = '#d2dae2';
export const DARK_PRIMARY_COLOR = 'rgb(183, 37, 88)';

const Tab = createBottomTabNavigator();
const BlankView = () => (<View />);

const Tabs = () => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: DARK_BASE_COLOR
      }}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: DARK_BASE_COLOR
        },
        tabBarActiveTintColor: DARK_PRIMARY_COLOR,
        tabBarInactiveTintColor: DARK_NORMAL_COLOR,
        headerStyle: {
          backgroundColor: DARK_BASE_COLOR
        },
        headerTitleStyle: {
          color: DARK_PRIMARY_COLOR,
          fontWeight: '600'
        },
        tabBarLabelStyle: {
          marginTop: -5,
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen name="Coins" component={BlankView} options ={{tabBarIcon: ({color, size}) => (<FontAwesome5 name="coins" color={color} size={size}/>)}}></Tab.Screen>
      <Tab.Screen name="Prices" component={BlankView} options ={{tabBarIcon: ({color, size}) => (<FontAwesome name="dollar" color={color} size={size}/>)}}></Tab.Screen>
      <Tab.Screen name="News" component={BlankView} options ={{tabBarIcon: ({color, size}) => (<FontAwesome name="newspaper-o" color={color} size={size} />)}}></Tab.Screen>
    </Tab.Navigator>
  )
};

export default function App() {
  const [assets] = useAssets([require("./assets/crypto.png")]);
  const [fonts] = Font.useFonts(Ionicons.font);
  if (!assets || !fonts) {
    return (
      <AppLoading />
    );
  }
  return <NavigationContainer><Tabs/></NavigationContainer>;
};