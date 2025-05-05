import { View, Text, StyleSheet, ScrollView, SafeAreaView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingButton from '@/components/onboarding/OnboardingButton';
import { useState, useRef, useEffect } from 'react';
import BackgroundImage from '@/components/layout/BackgroundImage';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);

export default function OnboardingTargetWeight() {
  const [selectedWeight, setSelectedWeight] = useState('72 kg');
  const weightScrollRef = useRef<ScrollView>(null);

  const weights = Array.from({ length: 100 }, (_, i) => `${i + 40} kg`);

  // Set initial scroll position
  useEffect(() => {
    setTimeout(() => {
      const weightIndex = weights.indexOf(selectedWeight);
      weightScrollRef.current?.scrollTo({ y: weightIndex * ITEM_HEIGHT, animated: false });
    }, 100);
  }, []);

  const handleContinue = async () => {
    if (selectedWeight) {
      try {
        // Get existing experience data or initialize new object
        const existingExperience = await AsyncStorage.getItem('experience');
        const experienceData = existingExperience ? JSON.parse(existingExperience) : {};

        // Update experience with selected goal
        experienceData.userTargetWeight = selectedWeight;

        // Save updated experience data
        await AsyncStorage.setItem('experience', JSON.stringify(experienceData));

        router.push('/complete');
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);

    if (index >= 0 && index < weights.length) {
      const value = weights[index];
      setSelectedWeight(value);
    }
  };

  const scrollToCenter = (value: string) => {
    const index = weights.indexOf(value);
    weightScrollRef.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      <OnboardingProgressBar progress={6} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Set Your Goal Weight</Text>
          <Text style={styles.subtitle}>Every Journey Needs A Destination. What's Your Goal Weight?</Text>
        </View>

        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <View style={styles.highlightBox}>
              <View style={styles.highlightLine} />
              <View style={[styles.highlightLine, styles.bottomLine]} />
            </View>
            <ScrollView
              ref={weightScrollRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              contentContainerStyle={[
                styles.scrollContent,
                { paddingTop: ITEM_HEIGHT * CENTER_INDEX, paddingBottom: ITEM_HEIGHT * CENTER_INDEX }
              ]}
              onMomentumScrollEnd={handleScroll}
            >
              {weights.map((weight, index) => (
                <Text
                  key={`${weight}-${index}`}
                  style={[
                    styles.pickerItem,
                    selectedWeight === weight && styles.selectedItem,
                  ]}
                  onPress={() => scrollToCenter(weight)}
                >
                  {weight}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>

        <OnboardingButton
          title="Next"
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
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    marginVertical: 20,
  },
  pickerWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    position: 'relative',
  },
  highlightBox: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderRadius: 8,
    zIndex: 1,
  },
  highlightLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFFFFF33',
    top: 0,
  },
  bottomLine: {
    top: 'auto',
    bottom: 0,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  pickerItem: {
    color: '#888',
    fontSize: 16,
    height: ITEM_HEIGHT,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  selectedItem: {
    color: '#FF6B6B',
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 30,
    borderRadius: 12,
  },
}); 