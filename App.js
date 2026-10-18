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

  const showBottomNav = currentScreen !== 'detail';

  return (
    <View style={styles.webOuterWrapper}>
      <View style={styles.phoneContainer}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar style="dark" />
          {currentScreen !== 'add' && currentScreen !== 'detail' && <Header />}
          
          <View style={styles.contentContainer}>
            {renderScreen()}
          </View>

          {showBottomNav && <BottomNavigation />}
          <TebligatModal />
        </SafeAreaView>
      </View>
    </View>
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
  webOuterWrapper: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#F1F5F9' : THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : '100%',
    backgroundColor: THEME.colors.background,
    ...Platform.select({
      web: {
        height: '100vh',
        maxHeight: 900,
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.06)',
        borderRadius: 24,
        overflow: 'hidden',
        marginVertical: 'auto',
      },
      default: {},
    }),
  },
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  contentContainer: {
    flex: 1,
  },
});
