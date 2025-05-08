import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LineChart } from "react-native-gifted-charts"

const WeightChart = () => {
  const lineData = [
    { value: 80, label: '' },
    { value: 20, label: 'Feb' },
    { value: 18, label: 'Mar' },
    { value: 40, label: 'Apr' },
    { value: 36, label: 'May' },
    { value: 60, label: 'Jun' },
    { value: 54, label: 'Jul' },
    { value: 85, label: 'Aug' },
    { value: 85, label: 'Aug' },
    { value: 85, label: 'Aug' }
  ];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Weight</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
      {/* <Image source={require('@/assets/images/weight-chart.png')} style={styles.weightChartImage} /> */}
      <LineChart
        areaChart
        hideDataPoints
        width={220}
        isAnimated
        rulesType='solid'
        rulesColor='#222222'
        animationDuration={1200}
        startFillColor="#D9616A"
        startOpacity={1}
        endOpacity={0.3}
        initialSpacing={0}
        data={lineData}
        spacing={30}
        thickness={3}
        yAxisColor="transparent"
        xAxisColor="transparent"
        color="#D9616A"
        yAxisTextStyle={{
          color: '#AAA',
        }}
        xAxisLabelTextStyle={{
          color: '#AAA',
        }}
      />
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
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  chart: {
    borderRadius: 16,
    marginLeft: -20,
  },
  weightChartImage: {
    width: '100%',
    height: 220,
    resizeMode: 'contain',
  },
});

export default WeightChart;
