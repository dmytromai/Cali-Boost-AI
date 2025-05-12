import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ActivityLevel {
  label: string;
  calories: number;
}

interface ProfileData {
  userBirthdate?: string;
  userHeight?: string;
  userWeight?: number;
  userGender?: string;
  userActivity?: string;
  userCalorieTarget?: string;
}

const CalorieBudget = () => {
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [activityLevels, setActivityLevels] = useState<ActivityLevel[]>([]);

  const calculateBMR = (weight: number | string, height: string, age: number, gender: string): number => {
    // Convert height from "5'10" ft" format to centimeters
    const heightMatch = height.match(/(\d+)'(\d+)"/);
    if (!heightMatch) return 0;

    const feet = parseInt(heightMatch[1]);
    const inches = parseInt(heightMatch[2]);
    const heightInCm = (feet * 30.48) + (inches * 2.54);

    // Convert weight from "74 kg" format to number
    const weightInKg = typeof weight === 'string' ? parseFloat(weight.split(' ')[0]) : Number(weight);

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * age;
    bmr = gender.toLowerCase() === 'male' ? bmr + 5 : bmr - 161;

    return Math.round(bmr);
  };

  const calculateActivityLevels = (bmr: number): ActivityLevel[] => {
    return [
      { label: 'Inactive', calories: Math.round(bmr * 1.2) },
      { label: 'Somewhat active', calories: Math.round(bmr * 1.375) },
      { label: 'Active', calories: Math.round(bmr * 1.55) },
      { label: 'Very active', calories: Math.round(bmr * 1.725) },
    ];
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const experienceData = await AsyncStorage.getItem('experience');
        if (experienceData) {
          const data = JSON.parse(experienceData);
          setProfileData(data);

          // Calculate age from birthdate
          const birthdate = data.userBirthdate;
          if (birthdate) {
            const [day, month, year] = birthdate.split('-');
            const monthMap: { [key: string]: number } = {
              'January': 0, 'February': 1, 'March': 2, 'April': 3,
              'May': 4, 'June': 5, 'July': 6, 'August': 7,
              'September': 8, 'October': 9, 'November': 10, 'December': 11
            };
            const birthDate = new Date(parseInt(year), monthMap[month], parseInt(day));
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            // Calculate BMR and activity levels
            if (data.userWeight && data.userHeight && data.userGender) {
              const bmr = calculateBMR(data.userWeight, data.userHeight, age, data.userGender);
              setActivityLevels(calculateActivityLevels(bmr));
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, []);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Calories Budget</Text>
        <Image source={require('../../assets/icons/calories-budget.png')} style={styles.caloriesBudgetIcon} />
      </View>
      <Text style={styles.caloriesValue}>{Number(profileData?.userCalorieTarget ?? 0)} cal/day</Text>
      <View style={styles.activityLevels}>
        {activityLevels.map((level, index) => (
          <View key={index} style={styles.activityItem}>
            <Text style={styles.activityLabel}>{level.label}</Text>
            <Text style={styles.activityCalories}>{level.calories} cal/day</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF0D',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 20,
    borderColor: '#FFFFFF1A',
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#FFFFFF99',
    fontSize: 14,
    fontWeight: '600',
  },
  caloriesBudgetIcon: {
    width: 36,
    height: 36,
  },
  caloriesValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  activityLevels: {
    marginTop: 10,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activityLabel: {
    color: '#888',
    fontSize: 14,
  },
  activityCalories: {
    color: 'white',
    fontSize: 14,
  },
});

export default CalorieBudget;