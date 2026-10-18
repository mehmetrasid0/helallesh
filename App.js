import React from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { THEME } from './src/constants/theme';
import { Header } from './src/components/Header';
import { BottomNavigation } from './src/components/BottomNavigation';
import { TebligatModal } from './src/components/TebligatModal';

import { DashboardScreen } from './src/screens/DashboardScreen';
import { AddItemScreen } from './src/screens/AddItemScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { FriendsScreen } from './src/screens/FriendsScreen';
import { StatsScreen } from './src/screens/StatsScreen';

function MainNavigator() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'add':
        return <AddItemScreen />;
      case 'detail':
        return <DetailScreen />;
      case 'friends':
        return <FriendsScreen />;
      case 'stats':
        return <StatsScreen />;
      case 'dashboard':
      default:
        return <DashboardScreen />;
    }
  };

  // Hide bottom bar on modal-like forms if preferred, or keep for easy navigation
  const showBottomNav = currentScreen !== 'detail';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {currentScreen !== 'add' && currentScreen !== 'detail' && <Header />}
      
      <View style={styles.contentContainer}>
        {renderScreen()}
      </View>

      {showBottomNav && <BottomNavigation />}
      <TebligatModal />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  contentContainer: {
    flex: 1,
  },
});
