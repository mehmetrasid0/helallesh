import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';
import { useApp } from '../context/AppContext';

export const BottomNavigation = () => {
  const { currentScreen, setCurrentScreen } = useApp();

  const tabs = [
    { key: 'dashboard', label: 'Pano', icon: 'view-dashboard-outline', activeIcon: 'view-dashboard' },
    { key: 'add', label: 'Ekle', isAction: true, icon: 'plus' },
    { key: 'friends', label: 'Kişiler', icon: 'account-group-outline', activeIcon: 'account-group' },
    { key: 'stats', label: 'Özet', icon: 'chart-pie-outline', activeIcon: 'chart-pie' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        if (tab.isAction) {
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.actionTab}
              activeOpacity={0.85}
              onPress={() => setCurrentScreen('add')}
            >
              <View style={styles.actionIconBox}>
                <MaterialCommunityIcons name="plus" size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.actionLabel}>Kayıt Aç</Text>
            </TouchableOpacity>
          );
        }

        const isActive = currentScreen === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setCurrentScreen(tab.key)}
          >
            <MaterialCommunityIcons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={isActive ? THEME.colors.primary : THEME.colors.textMuted}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingHorizontal: THEME.spacing.sm,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: THEME.colors.textMuted,
    marginTop: 4,
  },
  activeTabLabel: {
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  actionTab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.primary,
    marginTop: 3,
  },
});
