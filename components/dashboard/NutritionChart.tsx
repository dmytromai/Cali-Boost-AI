import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from "react-native-gifted-charts";
import { useEffect, useState } from 'react';
import { DailyData } from '@/types';
import { getDailyData } from '@/utils/storage';

const NutritionChart = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    loadWeekData();
  }, []);

  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    // Get the start of the week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    
    // Set the date range text
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    setDateRange(`${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`);
    
    // Generate dates for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const calculateMacroPercentages = (macros: { protein: number; carbs: number; fat: number }) => {
    const total = macros.protein + macros.carbs + macros.fat;
    if (total === 0) return { protein: 0, carbs: 0, fat: 0 };
    
    return {
      protein: Math.round((macros.protein / total) * 100),
      carbs: Math.round((macros.carbs / total) * 100),
      fat: Math.round((macros.fat / total) * 100)
    };
  };

  const loadWeekData = async () => {
    try {
      const weekDates = getWeekDates();
      const weekData = [];

      for (const date of weekDates) {
        const dailyData = await getDailyData(date);
        
        if (dailyData) {
          const percentages = calculateMacroPercentages(dailyData.macros);
          weekData.push({
            stacks: [
              { value: percentages.protein, color: '#6187D9' },
              { value: percentages.carbs, color: '#78B280', marginBottom: 2 },
              { value: percentages.fat, color: '#D98161', marginBottom: 2 },
            ],
            label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          });
        } else {
          // Use sample data if no data exists for the date
          weekData.push({
            stacks: [
              { value: 33, color: '#333333' },
              { value: 33, color: '#333333', marginBottom: 2 },
              { value: 34, color: '#333333', marginBottom: 2 },
            ],
            label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          });
        }
      }

      setChartData(weekData);
    } catch (error) {
      console.error('Error loading week data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nutrition (%)</Text>
        <TouchableOpacity style={styles.dateSelector}>
          <Text style={styles.dateText}>{dateRange}</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <BarChart
          width={200}
          rotateLabel
          noOfSections={3}
          stackData={chartData}
          stepValue={20}
          maxValue={100}
          barWidth={15}
          initialSpacing={13}
          spacing={13}
          rulesType='solid'
          yAxisLabelSuffix="%"
          xAxisColor="white"
          yAxisColor="white"
          yAxisTextStyle={{
            color: 'white',
          }}
          barBorderRadius={5}
          xAxisLabelTextStyle={{
            color: 'white',
          }}
        />
      )}
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
    marginBottom: 20,
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
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default NutritionChart;
