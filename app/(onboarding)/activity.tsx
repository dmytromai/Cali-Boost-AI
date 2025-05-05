import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingButton from '@/components/onboarding/OnboardingButton';
import { useState } from 'react';
import BackgroundImage from '@/components/layout/BackgroundImage';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';

export default function OnboardingActivity() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  const activities = [
    {
      id: 'inactive',
      range: '0 - 2',
      title: 'In Active',
      description: 'No regular workouts, only daily routine activities.',
    },
    {
      id: 'somewhat',
      range: '2 - 7',
      title: 'Somewhat Active',
      description: 'Light exercise or casual activity 1-2 times a week.',
    },
    {
      id: 'moderate',
      range: '7 - 14',
      title: 'Moderate Active',
      description: 'Balanced exercise with movement and rest.',
    },
    {
      id: 'very',
      range: '14 - 25',
      title: 'Very Active',
      description: 'Highly active lifestyle with frequent exercise.',
    },
  ];

  const handleContinue = async () => {
    if (selectedActivity) {
      try {
        // Get existing experience data or initialize new object
        const existingExperience = await AsyncStorage.getItem('experience');
        const experienceData = existingExperience ? JSON.parse(existingExperience) : {};
        
        // Update experience with selected goal
        experienceData.userActivity = selectedActivity;
        
        // Save updated experience data
        await AsyncStorage.setItem('experience', JSON.stringify(experienceData));
        
        router.push('/target-weight');
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      <OnboardingProgressBar progress={5} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>How Much Workouts{'\n'}Do You Do Per Week?</Text>
          <Text style={styles.subtitle}>Exercise Plays A Big Role In Reaching Your Goal!</Text>
        </View>

        <View style={styles.activitiesContainer}>
          {activities.map((activity) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.activityItem,
                selectedActivity === activity.id && styles.selectedActivity,
              ]}
              onPress={() => setSelectedActivity(activity.id)}
            >
              <View>
                <Text style={styles.activityRange}>{activity.range}</Text>
              </View>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>{activity.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <OnboardingButton
          title="Next"
          onPress={handleContinue}
          style={{
            ...styles.button,
            ...((!selectedActivity) ? styles.buttonDisabled : {})
          }}
          disabled={!selectedActivity}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    color: '#FFFFFFB2',
    fontSize: 12,
    marginTop: 5,
  },
  activitiesContainer: {
    marginVertical: 20,
  },
  activityItem: {
    backgroundColor: '#FFFFFF0D',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedActivity: {
    backgroundColor: '#D9616A',
  },
  activityHeader: {
    flexDirection: 'column',
    marginBottom: 5,
  },
  activityRange: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
    minWidth: 36,
    textAlign: 'center',
  },
  activityTitle: {
    color: 'white',
    fontSize: 16,
  },
  activityDescription: {
    color: '#FFFFFFB2',
    fontSize: 12,
  },
  button: {
    marginBottom: 30,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
}); 