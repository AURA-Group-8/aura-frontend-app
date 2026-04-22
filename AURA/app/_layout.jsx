import { View } from "react-native";
import { Slot } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar'
import { useEffect } from "react";

export default function Layout() {

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden')
    NavigationBar.setBehaviorAsync('overlay-swipe')
  }, [])

  return <Slot />;

}