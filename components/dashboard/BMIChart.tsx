import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BMIRange {
  label: string;
  range: string;
  color: string;
  min: number;
  max: number;
}

const BMIChart = () => {
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<BMIRange | null>(null);

  const bmiRanges: BMIRange[] = [
    { label: 'Severely Underweight', range: '<15.9', color: '#FFD700', min: 0, max: 15.9 },
    { label: 'Underweight', range: '16.0 - 18.4', color: '#2196F3', min: 16.0, max: 18.4 },
    { label: 'Normal(Healthy Weight)', range: '18.5 - 24.9', color: '#4CAF50', min: 18.5, max: 24.9 },
    { label: 'Over Weight', range: '25.0 - 29.9', color: '#FF9800', min: 25.0, max: 29.9 },
    { label: 'Obese', range: '>30.0', color: '#FF5722', min: 30.0, max: 100 },
  ];

  useEffect(() => {
    const calculateBMI = async () => {
      try {
        const experienceData = await AsyncStorage.getItem('experience');
        if (experienceData) {
          const data = JSON.parse(experienceData);
          const weight = parseFloat(data.userWeight);
          const heightStr = data.userHeight;

          if (weight && heightStr) {
            // Convert height from "5'11" ft" format to meters
            const heightMatch = heightStr.match(/(\d+)'(\d+)"/);
            if (heightMatch) {
              const feet = parseInt(heightMatch[1]);
              const inches = parseInt(heightMatch[2]);
              const heightInMeters = (feet * 0.3048) + (inches * 0.0254);

              // Calculate BMI
              const bmiValue = weight / (heightInMeters * heightInMeters);
              setBmi(Number(bmiValue.toFixed(1)));

              // Find BMI category
              const category = bmiRanges.find(range =>
                bmiValue >= range.min && bmiValue <= range.max
              );
              setBmiCategory(category || null);
            }
          }
        }
      } catch (error) {
        console.error('Error calculating BMI:', error);
      }
    };

    calculateBMI();
  }, []);

  const getPinRotation = () => {
    if (!bmi) return 0;

    // Define the angle ranges for each BMI category
    const angleRanges = [
      { min: 0, max: 15.9, start: -150, end: -90 },      // Severely Underweight
      { min: 16.0, max: 18.4, start: -90, end: -30 },    // Underweight
      { min: 18.5, max: 24.9, start: -30, end: 30 },     // Normal
      { min: 25.0, max: 29.9, start: 30, end: 90 },      // Overweight
      { min: 30.0, max: 100, start: 90, end: 150 },      // Obese
    ];

    let bmiCapped = Math.max(0, Math.min(bmi, 100));
    for (let i = 0; i < angleRanges.length; i++) {
      const range = angleRanges[i];
      if (bmiCapped >= range.min && bmiCapped <= range.max) {
        const progress = (bmiCapped - range.min) / (range.max - range.min);
        return range.start + progress * (range.end - range.start);
      }
    }
    return 0;
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>BMI (kg/m²)</Text>
      <View style={styles.bmiContainer}>
        <View style={styles.bmiGauge}>
          <Image source={require('@/assets/images/bmi-tracker.png')} style={styles.trackerImage} />
          <Image
            source={require('@/assets/images/bmi-pin.png')}
            style={[
              styles.pinImage,
              { transform: [{ rotate: `${getPinRotation()}deg` }] }
            ]}
          />
          <View style={styles.bmiValueContainer}>
            <Text style={styles.bmiValue}>{bmi || '--'}</Text>
            <Text style={[styles.bmiLabel, { color: bmiCategory?.color || '#888' }]}>
              {bmiCategory?.label || '--'}
            </Text>
          </View>
        </View>
        <View style={styles.bmiRanges}>
          {bmiRanges.map((range, index) => (
            <View key={index} style={styles.bmiRangeItem}>
              <View style={[styles.rangeDot, { backgroundColor: range.color }]} />
              <Text style={styles.rangeLabel}>{range.label}</Text>
              <Text style={styles.rangeValue}>{range.range}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF0D',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 20,
    borderColor: '#FFFFFF1A',
    borderWidth: 1,
  },
  sectionTitle: {
    color: '#FFFFFF99',
    fontSize: 14,
    fontWeight: '600',
  },
  bmiContainer: {
    alignItems: 'center',
  },
  bmiGauge: {
    alignItems: 'center',
    position: 'relative',
  },
  bmiValueContainer: {
    position: 'absolute',
    top: 140,
  },
  bmiValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bmiLabel: {
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
  bmiRanges: {
    marginTop: -70,
    width: '100%',
  },
  bmiRangeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rangeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  rangeLabel: {
    color: '#888',
    fontSize: 14,
    flex: 1,
  },
  rangeValue: {
    color: 'white',
    fontSize: 14,
    width: 80,
    textAlign: 'right',
  },
  trackerImage: {
    marginTop: 20,
    width: 308,
    height: 308,
    transform: [{ rotate: '0.5deg' }],
  },
  pinImage: {
    width: 78,
    height: 78,
    position: 'absolute',
    top: 65,
  },
});

export default BMIChart;
