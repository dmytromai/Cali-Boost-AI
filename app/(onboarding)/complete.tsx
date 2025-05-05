import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingButton from '@/components/onboarding/OnboardingButton';
import BackgroundImage from '@/components/layout/BackgroundImage';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';
import CircularProgress from '@/components/onboarding/CircularProgress';
import MacroSlider from '@/components/onboarding/MacroSlider';
import { useState } from 'react';

export default function OnboardingComplete() {
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [macros, setMacros] = useState({
    protein: 21,
    carbs: 21,
    fat: 21,
  });

  const handleCalorieChange = (value: number) => {
    setCalorieTarget(value);
  };

  const handleMacroChange = (type: 'protein' | 'carbs' | 'fat', value: number) => {
    setMacros(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleContinue = async () => {
    if (calorieTarget && macros) {
      try {
        const existingExperience = await AsyncStorage.getItem('experience');
        const experienceData = existingExperience ? JSON.parse(existingExperience) : {};

        experienceData.userCalorieTarget = calorieTarget.toString();
        experienceData.userMacroTargets = macros;
        experienceData.userHasLaunched = true;

        await AsyncStorage.setItem('experience', JSON.stringify(experienceData));

        router.push('/subscription');
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      <OnboardingProgressBar progress={7} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>You're All Set!</Text>
          <Text style={styles.subtitle}>Great Job! Your Personalized Plan Is Ready. Let's Start Tracking!</Text>
        </View>

        <View>
          <View>
            <Text style={styles.labelTitle}>Your Daily Target</Text>
            <Text style={styles.labelSubTitle}>You Can Edit This Anytime</Text>
          </View>

          <View style={styles.targetsContainer}>
            <View style={styles.calorieCard}>
              <Text style={styles.labelCalorieTitle}>Calories</Text>
              <CircularProgress currentValue={calorieTarget} maxValue={2700} onValueChange={handleCalorieChange} />
            </View>

            <View style={styles.macrosContainer}>
              <MacroSlider
                label="Protein"
                value={macros.protein}
                maxValue={47}
                color="#6187D9"
                onValueChange={(value) => handleMacroChange('protein', value)}
              />
              <MacroSlider
                label="Carbs"
                value={macros.carbs}
                maxValue={47}
                color="#78B280"
                onValueChange={(value) => handleMacroChange('carbs', value)}
              />
              <MacroSlider
                label="Fat"
                value={macros.fat}
                maxValue={47}
                color="#D98161"
                onValueChange={(value) => handleMacroChange('fat', value)}
              />
            </View>
          </View>
        </View>

        <OnboardingButton
          title="Let's Get Started"
          onPress={handleContinue}
          style={styles.button}
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
  targetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  calorieCard: {
    backgroundColor: '#FFFFFF0D',
    padding: 20,
    borderRadius: 15,
    borderColor: '#FFFFFF1A',
    borderWidth: 1,
  },
  labelTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  labelSubTitle: {
    color: '#FFFFFFB2',
    fontSize: 12,
    marginBottom: 19,
  },
  labelCalorieTitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 12,
  },
  macrosContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 4,
  },
  button: {
    marginBottom: 30,
    borderRadius: 12,
  },
}); 