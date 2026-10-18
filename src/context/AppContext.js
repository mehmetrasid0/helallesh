import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FRIENDS, INITIAL_ITEMS } from '../data/mockData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Navigation & UI state
  const [currentScreen, setCurrentScreen] = useState('dashboard'); // 'dashboard', 'add', 'detail', 'friends', 'stats'
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'item', 'debt', 'overdue'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tebligat Modal state
  const [tebligatItem, setTebligatItem] = useState(null);

  // Load from local storage or initialize with seed data
  useEffect(() => {
    const initData = async () => {
      const stored = await loadFromStorage();
      if (stored && stored.items && stored.friends) {
        setItems(stored.items);
        setFriends(stored.friends);
      } else {
        setItems(INITIAL_ITEMS);
        setFriends(INITIAL_FRIENDS);
        await saveToStorage({ items: INITIAL_ITEMS, friends: INITIAL_FRIENDS });
      }
      setIsLoading(false);
    };
    initData();
  }, []);

  // Save to storage on change
  const persist = async (newItems, newFriends) => {
    await saveToStorage({
      items: newItems || items,
      friends: newFriends || friends,
    });
  };

  // Add Item / Debt
  const addItem = (itemData) => {
    const newItem = {
      ...itemData,
      id: `${itemData.type}_${Date.now()}`,
      isResolved: false,
      resolvedDate: null,
      givenDate: itemData.givenDate || new Date().toISOString().split('T')[0],
    };
    const updated = [newItem, ...items];
    setItems(updated);
    persist(updated, friends);
    setCurrentScreen('dashboard');
  };

  // Mark as Helalleşildi (Resolve)
  const resolveItem = (id) => {
    let resolvedFriendId = null;
    let wasOverdue = false;

    const updated = items.map((it) => {
      if (it.id === id) {
        resolvedFriendId = it.friendId;
        const today = new Date().toISOString().split('T')[0];
        if (it.dueDate && it.dueDate < today) {
          wasOverdue = true;
        }
        return {
          ...it,
          isResolved: true,
          resolvedDate: today,
        };
      }
      return it;
    });

    // Update friend score (+10 if timely, +3 if overdue)
    let updatedFriends = [...friends];
    if (resolvedFriendId) {
      const delta = wasOverdue ? 3 : 8;
      updatedFriends = updatedFriends.map((f) => {
        if (f.id === resolvedFriendId) {
          const newScore = Math.min(100, Math.max(0, f.score + delta));
          return { ...f, score: newScore };
        }
        return f;
      });
      setFriends(updatedFriends);
    }

    setItems(updated);
    persist(updated, updatedFriends);
  };

  // Delete Item
  const deleteItem = (id) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    persist(updated, friends);
    if (selectedItemId === id) {
      setCurrentScreen('dashboard');
      setSelectedItemId(null);
    }
  };

  // Add Friend
  const addFriend = (name, phone = '') => {
    const avatars = ['😎', '🧢', '🔥', '🦁', '⚡', '👑', '🚀', '🎯'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const newFriend = {
      id: `f_${Date.now()}`,
      name,
      phone,
      avatar: randomAvatar,
      score: 75, // Starting score
    };
    const updated = [...friends, newFriend];
    setFriends(updated);
    persist(items, updated);
    return newFriend;
  };

  // Reset to seed data
  const resetToDefaults = async () => {
    setItems(INITIAL_ITEMS);
    setFriends(INITIAL_FRIENDS);
    await persist(INITIAL_ITEMS, INITIAL_FRIENDS);
    setCurrentScreen('dashboard');
  };

  // Computed Stats
  const activeItems = items.filter((it) => !it.isResolved);
  const resolvedItems = items.filter((it) => it.isResolved);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = activeItems.filter((it) => it.dueDate && it.dueDate < todayStr).length;

  const totalReceivable = activeItems
    .filter((it) => it.type === 'debt')
    .reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);

  const totalActiveLoansCount = activeItems.filter((it) => it.type === 'item').length;

  const totalRecoveredMoney = resolvedItems
    .filter((it) => it.type === 'debt')
    .reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);

  const selectedItem = items.find((it) => it.id === selectedItemId);

  return (
    <AppContext.Provider
      value={{
        items,
        friends,
        isLoading,
        currentScreen,
        setCurrentScreen,
        selectedItemId,
        setSelectedItemId,
        selectedItem,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        addItem,
        resolveItem,
        deleteItem,
        addFriend,
        resetToDefaults,
        tebligatItem,
        setTebligatItem,
        stats: {
          totalReceivable,
          totalActiveLoansCount,
          overdueCount,
          totalResolvedCount: resolvedItems.length,
          totalRecoveredMoney,
          activeCount: activeItems.length,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
