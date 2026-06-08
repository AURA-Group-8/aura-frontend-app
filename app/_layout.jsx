import { View } from "react-native";
import { Slot } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar'
import { useEffect } from "react";
import { LanguageProvider } from "../contexts/LanguageContext";
import 'leaflet/dist/leaflet.css'

export default function Layout() {

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden')
  }, [])

  return (
    <LanguageProvider>
      <Slot />
    </LanguageProvider>
  );

}