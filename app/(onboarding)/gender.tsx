import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingButton from '@/components/onboarding/OnboardingButton';
import { useState } from 'react';
import BackgroundImage from '@/components/layout/BackgroundImage';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';

export default function OnboardingGender() {
  const [selectedGender, setSelectedGender] = useState<string>('male');

  const handleContinue = async () => {
    if (selectedGender) {
      try {
        // Get existing experience data or initialize new object
        const existingExperience = await AsyncStorage.getItem('experience');
        const experienceData = existingExperience ? JSON.parse(existingExperience) : {};

        // Update experience with selected goal
        experienceData.userGender = selectedGender;

        // Save updated experience data
        await AsyncStorage.setItem('experience', JSON.stringify(experienceData));

        router.push('/birthdate');
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      <OnboardingProgressBar progress={2} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Choose Your Gender</Text>
          <Text style={styles.subtitle}>Choose Your Gender To Personalize Your Experience.</Text>
        </View>

        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderOption,
              selectedGender === 'male' && styles.selectedGender,
            ]}
            onPress={() => setSelectedGender('male')}
          >
            <Image source={selectedGender === 'male' ? require('../../assets/icons/male-selected.png') : require('../../assets/icons/male.png')}  style={styles.iconContainer}/>
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderOption,
              selectedGender === 'female' && styles.selectedGender,
            ]}
            onPress={() => setSelectedGender('female')}
          >
            <Image source={selectedGender === 'female' ? require('../../assets/icons/female-selected.png') : require('../../assets/icons/female.png')}  style={styles.iconContainer} />
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>

        <OnboardingButton
          title="Next"
          onPress={handleContinue}
          style={{
            ...styles.button,
            ...((!selectedGender) ? styles.buttonDisabled : {})
          }}
          disabled={!selectedGender}
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 40,
  },
  genderOption: {
    backgroundColor: '#FFFFFF1A',
    borderRadius: 24,
    alignItems: 'center',
    width: 150,
    height: 150,
  },
  selectedGender: {
    backgroundColor: '#FF6B6B',
    color: '#ADABAB'
  },
  genderSymbol: {
    marginTop: 10,
    fontSize: 64,
    color: 'white',
  },
  genderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    marginBottom: 30,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 56,
    height: 56,
    margin: 20,
  },
}); 