import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { router } from 'expo-router';
import OnboardingSlideToStart from '@/components/onboarding/OnboardingSlideToStart';
import Animated, { useAnimatedStyle, interpolate, useSharedValue } from 'react-native-reanimated';
import BackgroundImage from '@/components/layout/BackgroundImage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
  const slideProgress = useSharedValue(0);

  const checkExperience = async () => {
    try {
      const experience = await AsyncStorage.getItem('experience');

      if (experience) {
        const experienceData = JSON.parse(experience);

        if (experienceData && experienceData.userHasLaunched) {
          router.push('/(tabs)/dashboard');
        } else {
          router.push('/(onboarding)/personalize');
        }
      } else {
        router.push('/(onboarding)/personalize');
      }
    } catch (error) {
      console.error('Error checking experience:', error);
      // Default to personalize screen on error
      router.push('/(onboarding)/personalize');
    }
  };

  const waterTrackerImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(slideProgress.value, [0, 1], [-6, 0])}deg`,
        },
      ],
      left: interpolate(slideProgress.value, [0, 1], [-100, -60]),
      top: interpolate(slideProgress.value, [0, 1], [-100, 0]),
    };
  });

  const weightLossImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(slideProgress.value, [0, 1], [-6, 0])}deg`,
        },
      ],
      left: interpolate(slideProgress.value, [0, 1], [-100, 80]),
      top: interpolate(slideProgress.value, [0, 1], [-100, 130]),
    };
  });

  const nutritionTrackingImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(slideProgress.value, [0, 1], [-6, 0])}deg`,
        },
      ],
      left: interpolate(slideProgress.value, [0, 1], [-70, 230]),
      top: interpolate(slideProgress.value, [0, 1], [-12, 230]),
    };
  });

  const handleComplete = () => {
    checkExperience();
    // router.push('/(onboarding)/personalize');
  };

  const handleProgress = (progress: number) => {
    slideProgress.value = progress;
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />
      <View style={styles.content}>
        <Text style={styles.title}>Being Your{'\n'}Calories Tracking{'\n'}Today</Text>

        <View style={styles.imagesContainer}>
          <Animated.Image
            source={require('../../assets/images/water-tracker.png')}
            style={[styles.image, waterTrackerImageStyle]}
          />
          <Animated.Image
            source={require('../../assets/images/weight-loss.png')}
            style={[styles.image, weightLossImageStyle]}
          />
          <Animated.Image
            source={require('../../assets/images/nutrition-tracking.png')}
            style={[styles.image, nutritionTrackingImageStyle]}
          />
        </View>

        <View style={styles.bottomSection}>
          <OnboardingSlideToStart onComplete={handleComplete} onProgress={handleProgress} />
        </View>
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
    marginTop: 40,
  },
  imagesContainer: {
    flex: 1,
    margin: -16,
    marginTop: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: 270,
    height: 322,
    position: 'absolute',
  },
  bottomSection: {
    paddingBottom: 50,
  },
}); 