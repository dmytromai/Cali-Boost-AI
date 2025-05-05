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

export default function OnboardingHeight() {
  const [selectedHeight, setSelectedHeight] = useState("5'11\" ft");
  const [selectedWeight, setSelectedWeight] = useState('72 kg');

  const heightScrollRef = useRef<ScrollView>(null);
  const weightScrollRef = useRef<ScrollView>(null);

  const heights = [
    "5'1\" ft", "5'2\" ft", "5'3\" ft", "5'4\" ft", "5'5\" ft", "5'6\" ft", "5'7\" ft", "5'8\" ft", "5'9\" ft", "5'10\" ft", "5'11\" ft", "6'0\" ft", "6'1\" ft", "6'2\" ft", "6'3\" ft", "6'4\" ft", "6'5\" ft", "6'6\" ft", "6'7\" ft", "6'8\" ft", "6'9\" ft", "6'10\" ft", "6'11\" ft", "7'0\" ft"
  ];

  const weights = Array.from({ length: 100 }, (_, i) => `${i + 40} kg`);

  // Set initial scroll positions
  useEffect(() => {
    setTimeout(() => {
      const heightIndex = heights.indexOf(selectedHeight);
      const weightIndex = weights.indexOf(selectedWeight);

      heightScrollRef.current?.scrollTo({ y: heightIndex * ITEM_HEIGHT, animated: false });
      weightScrollRef.current?.scrollTo({ y: weightIndex * ITEM_HEIGHT, animated: false });
    }, 100);
  }, []);

  const handleContinue = async () => {
    if (selectedHeight && selectedWeight) {
      try {
        // Get existing experience data or initialize new object
        const existingExperience = await AsyncStorage.getItem('experience');
        const experienceData = existingExperience ? JSON.parse(existingExperience) : {};

        // Update experience with selected goal
        experienceData.userHeight = selectedHeight;
        experienceData.userWeight = selectedWeight;

        // Save updated experience data
        await AsyncStorage.setItem('experience', JSON.stringify(experienceData));

        router.push('/activity');
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>, type: 'height' | 'weight') => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const array = type === 'height' ? heights : weights;

    if (index >= 0 && index < array.length) {
      const value = array[index];
      if (type === 'height') {
        setSelectedHeight(value);
      } else {
        setSelectedWeight(value);
      }
    }
  };

  const scrollToCenter = (value: string, type: 'height' | 'weight') => {
    const array = type === 'height' ? heights : weights;
    const index = array.indexOf(value);
    const ref = type === 'height' ? heightScrollRef : weightScrollRef;

    ref.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const renderPickerColumn = (
    items: string[],
    type: 'height' | 'weight',
    ref: React.RefObject<ScrollView>,
    selected: string,
  ) => (
    <View style={styles.pickerColumn}>
      <View style={styles.pickerWrapper}>
        <View style={styles.highlightBox}>
          <View style={styles.highlightLine} />
          <View style={[styles.highlightLine, styles.bottomLine]} />
        </View>
        <ScrollView
          ref={ref}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: ITEM_HEIGHT * CENTER_INDEX, paddingBottom: ITEM_HEIGHT * CENTER_INDEX }
          ]}
          onMomentumScrollEnd={(e) => handleScroll(e, type)}
        >
          {items.map((item, index) => (
            <Text
              key={`${item}-${index}`}
              style={[
                styles.pickerItem,
                selected === item && styles.selectedItem,
              ]}
              onPress={() => scrollToCenter(item, type)}
            >
              {item}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      <OnboardingProgressBar progress={4} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Height & Weight</Text>
          <Text style={styles.subtitle}>Tell Us Your Current Height And Weight To Track Progress Accurately</Text>
        </View>

        <View style={styles.pickerContainer}>
          {renderPickerColumn(heights, 'height', heightScrollRef, selectedHeight)}
          {renderPickerColumn(weights, 'weight', weightScrollRef, selectedWeight)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    marginVertical: 20,
  },
  pickerColumn: {
    flex: 1,
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