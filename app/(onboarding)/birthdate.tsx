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

export default function OnboardingBirthdate() {
  const [selectedDate, setSelectedDate] = useState({
    day: '15',
    month: 'April',
    year: '1990',
  });

  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = Array.from({ length: 100 }, (_, i) => String(2024 - i));

  // Create cycled arrays
  const cycledDays = [...days.slice(-2), ...days, ...days.slice(0, 2)];
  const cycledMonths = [...months.slice(-2), ...months, ...months.slice(0, 2)];
  const cycledYears = [...years.slice(-2), ...years, ...years.slice(0, 2)];

  // Set initial scroll positions
  useEffect(() => {
    // Wait for layout to complete
    setTimeout(() => {
      const dayIndex = days.indexOf(selectedDate.day);
      const monthIndex = months.indexOf(selectedDate.month);
      const yearIndex = years.indexOf(selectedDate.year);

      dayScrollRef.current?.scrollTo({ y: dayIndex * ITEM_HEIGHT, animated: false });
      monthScrollRef.current?.scrollTo({ y: monthIndex * ITEM_HEIGHT, animated: false });
      yearScrollRef.current?.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: false });
    }, 100);
  }, []);

  const handleContinue = async () => {
    if (selectedDate) {
      try {
        const birthdate = `${selectedDate.day}-${selectedDate.month}-${selectedDate.year}`;

        // Get existing experience data or initialize new object
        const existingExperience = await AsyncStorage.getItem('experience');
        const experienceData = existingExperience ? JSON.parse(existingExperience) : {};

        // Update experience with selected goal
        experienceData.userBirthdate = birthdate;

        // Save updated experience data
        await AsyncStorage.setItem('experience', JSON.stringify(experienceData));

        router.push('/height');
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>, type: 'day' | 'month' | 'year') => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const actualArray = type === 'day' ? days : type === 'month' ? months : years;

    const actualIndex = index;
    if (actualIndex >= 0 && actualIndex < actualArray.length) {
      const value = actualArray[actualIndex];
      setSelectedDate(prev => ({ ...prev, [type]: value }));
    }
  };

  const scrollToCenter = (value: string, type: 'day' | 'month' | 'year') => {
    const array = type === 'day' ? days : type === 'month' ? months : years;
    const index = array.indexOf(value);
    const ref = type === 'day' ? dayScrollRef : type === 'month' ? monthScrollRef : yearScrollRef;

    ref.current?.scrollTo({
      y: index * ITEM_HEIGHT,
      animated: true,
    });
  };

  const renderPickerColumn = (
    items: string[],
    cycledItems: string[],
    type: 'day' | 'month' | 'year',
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

      <OnboardingProgressBar progress={3} />

      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Choose Your Birthdate</Text>
          <Text style={styles.subtitle}>This Will Be Used To Calibrate Your Custom Plan</Text>
        </View>

        <View style={styles.pickerContainer}>
          {renderPickerColumn(days, cycledDays, 'day', dayScrollRef, selectedDate.day)}
          {renderPickerColumn(months, cycledMonths, 'month', monthScrollRef, selectedDate.month)}
          {renderPickerColumn(years, cycledYears, 'year', yearScrollRef, selectedDate.year)}
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
    top: ITEM_HEIGHT * CENTER_INDEX,
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
  pickerLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerItem: {
    color: '#888',
    fontSize: 16,
    height: ITEM_HEIGHT,
    textAlign: 'center',
    lineHeight: ITEM_HEIGHT,
  },
  selectedItem: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    marginBottom: 30,
    borderRadius: 12,
  },
}); 