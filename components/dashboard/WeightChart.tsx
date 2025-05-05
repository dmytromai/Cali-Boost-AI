import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
// import { LineChart } from 'react-native-chart-kit';

const WeightChart = () => {
  // const weightData = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  //   datasets: [{
  //     data: [75, 74, 73, 72, 71, 70, 69, 68, 67],
  //     color: () => '#FF6B6B',
  //     strokeWidth: 2,
  //   }],
  // };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Weight</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
      <Image source={require('@/assets/images/weight-chart.png')} style={styles.weightChartImage} />
      {/* <LineChart
        data={weightData}
        width={300}
        height={220}
        chartConfig={{
          // backgroundColor: '#2A2A2A',
          // backgroundGradientFrom: '#2A2A2A',
          // backgroundGradientTo: '#2A2A2A',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
      /> */}
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
