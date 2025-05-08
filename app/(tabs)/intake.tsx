import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import BackgroundImage from '@/components/layout/BackgroundImage';
import ProfileHeader from '@/components/layout/ProfileHeader';
import WaterTracker from '@/components/tracking/WaterTracker';
import MealsList from '@/components/tracking/MealsList';
import Calendar from '@/components/tracking/Calendar';
import { MealSection, DailyData } from '@/types';
import { getDailyData, saveDailyData } from '@/utils/storage';
import CircularProgress from '@/components/onboarding/CircularProgress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Workout from '@/components/tracking/Workout';

interface ProfileData {
  userActivity?: string;
  userBirthdate?: string;
  userCalorieTarget?: string;
  userGender?: string;
  userGoal?: string;
  userHeight?: string;
  userMacroTargets: {
    protein: number;
    carbs: number;
    fat: number;
  };
  userTargetWeight?: number;
  userWeight?: number;
}

const TrackingScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const { updatedData, imageUri } = useLocalSearchParams<{ updatedData?: string; imageUri?: string }>();
  const { newItem, mealType } = useLocalSearchParams<{
    newItem?: string;
    imageUri?: string;
    mealType?: string;
  }>();
  const [profileData, setProfileData] = useState<ProfileData>({
    userMacroTargets: {
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedDate) {
      loadDailyData();
    }
  }, [selectedDate]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const experienceData = await AsyncStorage.getItem('experience');

      if (experienceData) {
        try {
          const data = JSON.parse(experienceData);
          setProfileData(data);
        } catch (parseError) {
          console.error('Error parsing experience data:', parseError);
          // Set default values if parsing fails
          setProfileData({
            userMacroTargets: {
              protein: 0,
              carbs: 0,
              fat: 0,
            }
          });
        }
      } else {
        // Set default values if no data
        setProfileData({
          userMacroTargets: {
            protein: 0,
            carbs: 0,
            fat: 0,
          }
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Set default values on error
      setProfileData({
        userMacroTargets: {
          protein: 0,
          carbs: 0,
          fat: 0,
        }
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (updatedData) {
      try {
        const parsedData = JSON.parse(updatedData);
        if (imageUri && parsedData.meals) {
          parsedData.meals.forEach((section: MealSection) => {
            if (section.items && section.items.length > 0) {
              const lastItem = section.items[section.items.length - 1];
              if (lastItem.image === '') {
                lastItem.image = imageUri;
              }
            }
          });
        }
        setDailyData(parsedData);
      } catch (error) {
        console.error('Error parsing updated data:', error);
      }
    }
  }, [updatedData, imageUri]);

  useEffect(() => {
    if (newItem && mealType) {
      try {
        const parsedItem = JSON.parse(newItem);
        if (imageUri) {
          parsedItem.image = imageUri;
        }

        setDailyData(prevData => {
          if (!prevData) return prevData;

          const updatedMeals = prevData.meals.map(section => {
            if (section.title === mealType) {
              return {
                ...section,
                totalCalories: section.totalCalories + parsedItem.calories,
                items: [...section.items, parsedItem],
              };
            }
            return section;
          });

          return {
            ...prevData,
            calories: {
              ...prevData.calories,
              eaten: prevData.calories.eaten + parsedItem.calories,
            },
            macros: {
              protein: prevData.macros.protein + parsedItem.macros.protein,
              carbs: prevData.macros.carbs + parsedItem.macros.carbs,
              fat: prevData.macros.fat + parsedItem.macros.fat,
            },
            meals: updatedMeals,
          };
        });
      } catch (error) {
        console.error('Error parsing new item:', error);
      }
    }
  }, [newItem, imageUri, mealType]);

  const loadDailyData = useCallback(async () => {
    if (!selectedDate) return;
    try {
      const data = await getDailyData(selectedDate);
      if (!data) {
        const defaultData = {
          date: selectedDate,
          calories: { eaten: 0, burned: 0 },
          macros: { protein: 0, carbs: 0, fat: 0 },
          water: 0,
          meals: [
            { title: 'Breakfast', totalCalories: 0, items: [] },
            { title: 'Lunch', totalCalories: 0, items: [] },
            { title: 'Snacks', totalCalories: 0, items: [] },
            { title: 'Dinner', totalCalories: 0, items: [] },
          ],
        };
        setDailyData(defaultData);
      } else {
        setDailyData(data);
      }
    } catch (error) {
      console.error('Error loading daily data:', error);
      setDailyData({
        date: selectedDate,
        calories: { eaten: 0, burned: 0 },
        macros: { protein: 0, carbs: 0, fat: 0 },
        water: 0,
        meals: [
          { title: 'Breakfast', totalCalories: 0, items: [] },
          { title: 'Lunch', totalCalories: 0, items: [] },
          { title: 'Snacks', totalCalories: 0, items: [] },
          { title: 'Dinner', totalCalories: 0, items: [] },
        ],
      });
    }
  }, [selectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleAddMeal = (mealType: string) => {
    router.push(`/scanner?date=${selectedDate}&mealType=${mealType}`);
  };

  const handleWaterUpdate = async (amount: number) => {
    if (!selectedDate || !dailyData) return;
    const updatedData: DailyData = {
      ...dailyData,
      water: amount,
    };
    await saveDailyData(selectedDate, updatedData);
    setDailyData(updatedData);
  };

  const renderCalorieCircle = () => {
    try {
      const eaten = dailyData?.calories?.eaten ?? 0;
      const burned = dailyData?.calories?.burned ?? 0;
      const target = Number(profileData?.userCalorieTarget ?? 0);

      return (
        <View style={styles.calorieCircleContainer}>
          <Text style={styles.calorieCircleTitle}>Calories Left</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Image
                source={require('../../assets/icons/eaten.png')}
                style={styles.statIcon}
                onError={(e) => console.error('Error loading eaten icon:', e.nativeEvent.error)}
              />
              <Text style={styles.statValue}>{eaten}</Text>
              <Text style={styles.statLabel}>Eaten</Text>
            </View>
            <CircularProgress
              currentValue={eaten - burned}
              maxValue={target}
              disabled={true}
            />
            <View style={styles.statItem}>
              <Image
                source={require('../../assets/icons/burned.png')}
                style={styles.statIcon}
                onError={(e) => console.error('Error loading burned icon:', e.nativeEvent.error)}
              />
              <Text style={styles.statValue}>{burned}</Text>
              <Text style={styles.statLabel}>Burned</Text>
            </View>
          </View>
        </View>
      );
    } catch (error) {
      console.error('Error rendering calorie circle:', error);
      return null;
    }
  };

  const renderMacroBar = (label: string, value: number, total: number, color: string) => (
    <View style={styles.macroItem}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBar, { width: `${Math.min((value / total) * 100, 100)}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.macroValue}>{value.toFixed(0)}/{total}g</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <BackgroundImage />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      <ScrollView style={styles.scrollView}>
        <ProfileHeader />

        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {renderCalorieCircle()}

        <View style={styles.macrosSection}>
          {renderMacroBar('Protein', dailyData?.macros.protein || 0, Number(profileData.userMacroTargets?.protein || 0), '#2196F3')}
          {renderMacroBar('Carbs', dailyData?.macros.carbs || 0, Number(profileData.userMacroTargets?.carbs || 0), '#4CAF50')}
          {renderMacroBar('Fat', dailyData?.macros.fat || 0, Number(profileData.userMacroTargets?.fat || 0), '#FF5722')}
        </View>

        <WaterTracker
          onWaterUpdate={handleWaterUpdate}
          initialAmount={dailyData?.water || 0}
        />

        <View style={styles.mealsContainer}>
          <Text style={styles.sectionTitle}>Eaten</Text>
          {dailyData?.meals.map((section) => (
            <MealsList
              key={section.title}
              {...section}
              onAddMeal={() => handleAddMeal(section.title)}
              targetMacros={profileData.userMacroTargets}
            />
          ))}
        </View>

        <Workout dailyData={dailyData} onDataChange={loadDailyData} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  calorieCircleContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
    backgroundColor: '#FFFFFF0D',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    padding: 20,
  },
  calorieCircleTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  mainStat: {
    alignItems: 'center',
  },
  remainingCalories: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  totalCalories: {
    color: '#888',
    fontSize: 14,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
  macrosSection: {
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    width: '31%',
    backgroundColor: '#FFFFFF0D',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 18,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  macroLabel: {
    color: '#888',
    fontSize: 14,
  },
  macroValue: {
    color: 'white',
    fontSize: 14,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
  },
  mealsContainer: {
    padding: 20,
  },
  calorieCardImage: {
    width: 150,
    height: 150,
  },
  statIcon: {
    width: 18,
    height: 18,
  },
});

export default TrackingScreen; 