import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingButton from '@/components/onboarding/OnboardingButton';
import { useState } from 'react';
import BackgroundImage from '@/components/layout/BackgroundImage';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';

export default function OnboardingGoal() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    {
      id: 'lose',
      image: require('../../assets/icons/lose-weight.png'),
      title: 'Lose Weight',
      description: 'help reduce calories in a healthy and sustainable way.',
    },
    {
      id: 'maintain',
      image: require('../../assets/icons/maintain-weight.png'),
      title: 'Maintain Weight',
      description: 'Keep things steady with balanced meals',
    },
    {
      id: 'gain',
      image: require('../../assets/icons/gain-weight.png'),
      title: 'Gain Weight',
      description: 'Build up with the right foods and calorie surplus',
    },
  ];

  const handleContinue = async () => {
    if (selectedGoal) {
      try {
        // Get existing experience data or initialize new object
        const existingExperience = await AsyncStorage.getItem('experience');
        const experienceData = existingExperience ? JSON.parse(existingExperience) : {};

        // Update experience with selected goal
        experienceData.userGoal = selectedGoal;

        // Save updated experience data
        await AsyncStorage.setItem('experience', JSON.stringify(experienceData));

        router.push('/gender');
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      <OnboardingProgressBar progress={1} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>What Do You Need{'\n'}Help With?</Text>
          <Text style={styles.subtitle}>Select Your Main Focus — We'll Build A Personalized Path From There.</Text>
        </View>

        <View style={styles.goalsContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalItem,
                selectedGoal === goal.id && styles.selectedGoal,
              ]}
              onPress={() => setSelectedGoal(goal.id)}
            >
              <View style={styles.iconContainer}>
                <Image source={goal.image} style={styles.goalImage} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <OnboardingButton
          title="Next"
          onPress={handleContinue}
          style={{
            ...styles.button,
            ...((!selectedGoal) ? styles.buttonDisabled : {})
          }}
          disabled={!selectedGoal}
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
  goalsContainer: {
    gap: 12,
  },
  goalItem: {
    backgroundColor: '#FFFFFF0D',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedGoal: {
    backgroundColor: '#D9616A',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  goalImage: {
    width: 24,
    height: 24,
  },
  goalTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  goalDescription: {
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