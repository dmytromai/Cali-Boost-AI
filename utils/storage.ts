import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyData } from '@/types';

const STORAGE_KEY = '@daily_data';

export const saveDailyData = async (date: string, data: DailyData) => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const dailyData = existingData ? JSON.parse(existingData) : {};
    dailyData[date] = data;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dailyData));
  } catch (error) {
    console.error('Error saving daily data:', error);
  }
};

export const getDailyData = async (date: string): Promise<DailyData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    const dailyData = JSON.parse(data);
    return dailyData[date] || null;
  } catch (error) {
    console.error('Error getting daily data:', error);
    return null;
  }
};

export const getAllDailyData = async (): Promise<Record<string, DailyData>> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting all daily data:', error);
    return {};
  }
}; 