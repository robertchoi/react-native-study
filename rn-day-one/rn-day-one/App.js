import AppLoading from 'expo-app-loading';
import React from 'react';
import * as Font from 'expo-font';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAssets } from 'expo-asset';

export default function App() {
  const [assets] = useAssets([require('./assets/crypto.png')]);
  return null;
}