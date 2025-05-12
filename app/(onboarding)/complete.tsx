import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingButton from '@/components/onboarding/OnboardingButton';
import BackgroundImage from '@/components/layout/BackgroundImage';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';
import CircularProgress from '@/components/onboarding/CircularProgress';
import MacroSlider from '@/components/onboarding/MacroSlider';
import { useState, useEffect } from 'react';

export default function OnboardingComplete() {
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [maxCalorieTarget, setMaxCalorieTarget] = useState(2700);
  const [macros, setMacros] = useState({
    protein: 21,
    carbs: 21,
    fat: 21,
  });

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

  const calculateActivityLevels = (bmr: number, activityLevel?: string): number => {
    const activityMultipliers: { [key: string]: number } = {
      'inactive': 1.2,
      'somewhat': 1.375,
      'moderate': 1.55,
      'very': 1.725
    };

    // Default to "Somewhat active" if no activity level is provided
    const multiplier = activityMultipliers[activityLevel?.toLowerCase() || ''] || 1.375;
    return Math.round(bmr * multiplier);
  };

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const experienceData = await AsyncStorage.getItem('experience');
        if (experienceData) {
          const data = JSON.parse(experienceData);
          
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
              const calories = calculateActivityLevels(bmr, data.userActivity);
              setCalorieTarget(calories);
              setMaxCalorieTarget(calories * 1.35);
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, []);

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
              <CircularProgress
                currentValue={calorieTarget}
                maxValue={Math.round(maxCalorieTarget)} // Allow up to 35% more than current target
                onValueChange={handleCalorieChange}
              />
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