import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const NutritionChart = () => {
  // const nutritionData = {
  //   labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Today', 'Sat', 'Sun'],
  //   datasets: [
  //     {
  //       data: [30, 35, 28, 32, 40, 0, 0],
  //       color: () => '#2196F3', // Protein
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: [45, 50, 42, 48, 35, 0, 0],
  //       color: () => '#4CAF50', // Carbs
  //       strokeWidth: 2,
  //     },
  //     {
  //       data: [25, 15, 30, 20, 25, 0, 0],
  //       color: () => '#FF5722', // Fat
  //       strokeWidth: 2,
  //     },
  //   ],
  // };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nutrition(%)</Text>
        <TouchableOpacity style={styles.dateSelector}>
          <Text style={styles.dateText}>12-18 Sep</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>
      <Image source={require('@/assets/images/nutrition-chart.png')} style={styles.nutritionChartImage} />
      {/* <LineChart
        data={nutritionData}
        width={300}
        height={220}
        chartConfig={{
          // backgroundColor: '#2A2A2A',
          // backgroundGradientFrom: '#2A2A2A',
          // backgroundGradientTo: '#2A2A2A',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: 'white',
    fontSize: 14,
    marginRight: 5,
  },
  chart: {
    borderRadius: 16,
    marginLeft: -20,
  },
  nutritionChartImage: {
    width: '100%',
    height: 220,
    resizeMode: 'contain',
  },
});

export default NutritionChart;
