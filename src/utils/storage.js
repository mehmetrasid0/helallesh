import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@helallesh_app_state_v1';

export const loadFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('AsyncStorage load error:', e);
    return null;
  }
};

export const saveToStorage = async (data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    return true;
  } catch (e) {
    console.error('AsyncStorage save error:', e);
    return false;
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('AsyncStorage clear error:', e);
    return false;
  }
};
