import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const BottomNavigation = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  const tabs = [
    { key: 'dashboard', label: 'Pano', icon: 'view-dashboard-outline', activeIcon: 'view-dashboard' },
    { key: 'add', label: 'Ekle', isFab: true, icon: 'plus' },
    { key: 'friends', label: 'Agalar', icon: 'account-group-outline', activeIcon: 'account-group' },
    { key: 'stats', label: 'Rapor', icon: 'chart-box-outline', activeIcon: 'chart-box' },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          if (tab.isFab) {
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.fabButton}
                activeOpacity={0.85}
                onPress={() => setCurrentScreen('add')}
              >
                <View style={styles.fabInner}>
                  <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.fabLabel}>Kayıt Aç</Text>
              </TouchableOpacity>
            );
          }

          const isActive = currentScreen === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              activeOpacity={0.7}
              onPress={() => setCurrentScreen(tab.key)}
            >
              <MaterialCommunityIcons
                name={isActive ? tab.activeIcon : tab.icon}
                size={24}
                color={isActive ? THEME.colors.primaryLight : THEME.colors.textMuted}
              />
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: THEME.colors.background,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 8,
    paddingHorizontal: THEME.spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.xl,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: THEME.colors.surfaceBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 64,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  activeTabLabel: {
    color: THEME.colors.primaryLight,
    fontWeight: '700',
  },
  fabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  fabInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3,
    borderColor: THEME.colors.background,
  },
  fabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
    marginTop: 4,
  },
});
