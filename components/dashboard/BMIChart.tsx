import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

interface BMIRange {
  label: string;
  range: string;
  color: string;
}

const BMIChart = () => {
  const bmiRanges: BMIRange[] = [
    { label: 'Severely Underweight', range: '<15.9', color: '#FFD700' },
    { label: 'Underweight', range: '16.0 - 18.4', color: '#2196F3' },
    { label: 'Normal(Healthy Weight)', range: '18.5 - 24.9', color: '#4CAF50' },
    { label: 'Over Weight', range: '25.0 - 29.9', color: '#FF9800' },
    { label: 'Obese', range: '>30.0', color: '#FF5722' },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>BMI (kg/m²)</Text>
      <View style={styles.bmiContainer}>
        <View style={styles.bmiGauge}>
          {/* Semi-circular gauge implementation */}
          <Image source={require('@/assets/images/bmi-tracker.png')} style={styles.trackerImage} />
          <Image source={require('@/assets/images/bmi-pin.png')} style={styles.pinImage} />
          <View style={styles.bmiValueContainer}>
            <Text style={styles.bmiValue}>24.3</Text>
            <Text style={styles.bmiLabel}>Normal</Text>
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
  },
  bmiLabel: {
    color: '#4CAF50',
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
