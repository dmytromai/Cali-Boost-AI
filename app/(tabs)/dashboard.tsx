import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import BackgroundImage from '@/components/layout/BackgroundImage';
import ProfileHeader from '@/components/layout/ProfileHeader';
import WeightChart from '@/components/dashboard/WeightChart';
import NutritionChart from '@/components/dashboard/NutritionChart';
import BMIChart from '@/components/dashboard/BMIChart';
import CalorieBudget from '@/components/dashboard/CalorieBudget';

interface ProfileData {
  userBirthdate?: string;
  userHeight?: string;
  userWeight?: number;
  userTargetWeight?: number;
  userGender?: string;
  userGoal?: string;
  activityLevel?: string;
}

const DashboardScreen = () => {
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);

  const calcAge = (birthdate: string | undefined): string | undefined => {
    if (!birthdate) return undefined;

    // Split the date string
    const [day, month, year] = birthdate.split('-');

    // Create a map of month names to numbers
    const monthMap: { [key: string]: number } = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3,
      'May': 4, 'June': 5, 'July': 6, 'August': 7,
      'September': 8, 'October': 9, 'November': 10, 'December': 11
    };

    // Get the month number from our map
    const monthNumber = monthMap[month];
    if (monthNumber === undefined) {
      console.error('Invalid month name:', month);
      return undefined;
    }

    // Create the birth date
    const birthDate = new Date(parseInt(year), monthNumber, parseInt(day));

    // Get today's date
    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if birthday hasn't occurred this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age.toString();
  };

  const loadProfileData = async () => {
    try {
      const experienceData = await AsyncStorage.getItem('experience');
      if (experienceData) {
        const data = JSON.parse(experienceData);
        setProfileData(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile data:', error);
      setLoading(false);
    }
  };

  // Use useFocusEffect to reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [])
  );

  // Initial load
  useEffect(() => {
    loadProfileData();
  }, []);

  const renderProfileCard = (title: string, value: string | number | undefined, icon: any, suffix: string = '') => (
    <View style={styles.profileCard}>
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardValue}>
            {value ? `${value}${suffix}` : '--'}
          </Text>
        </View>
        <Image source={icon} style={styles.cardIcon} />
      </View>
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
        {/* Profile Info */}
        <ProfileHeader />

        <View style={styles.profileGrid}>
          {renderProfileCard('Age', calcAge(profileData.userBirthdate), require('../../assets/icons/age.png'), ' Years')}
          {renderProfileCard('Height', profileData.userHeight, require('../../assets/icons/height.png'))}
          {renderProfileCard('Goal Weight', profileData.userTargetWeight, require('../../assets/icons/goal-weight.png'))}
          {renderProfileCard('Current Weight', profileData.userWeight, require('../../assets/icons/current-weight.png'))}
        </View>

        {/* Calories Budget */}
        <CalorieBudget />

        {/* BMI Chart */}
        <BMIChart />

        {/* Nutrition Chart */}
        <NutritionChart />

        {/* Weight Chart */}
        <WeightChart />
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
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: 15,
  },
  profileCard: {
    width: '50%',
    padding: 5,
  },
  cardTitle: {
    color: '#FFFFFF99',
    fontSize: 12,
    marginBottom: 4,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF0D',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 15,
    borderColor: '#FFFFFF1A',
    borderWidth: 1,
  },
  cardValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cardIcon: {
    width: 36,
    height: 36,
  },
});

export default DashboardScreen; 