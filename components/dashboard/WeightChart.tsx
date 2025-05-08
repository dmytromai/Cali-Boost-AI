import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import DatePicker from "expo-datepicker";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WeightEntry {
  date: string;
  weight: number;
}

const WeightChart = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weight, setWeight] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    loadWeightData();
  }, []);

  const loadWeightData = async () => {
    try {
      const data = await AsyncStorage.getItem('weightData');
      if (data) {
        const parsedData = JSON.parse(data);
        setWeightData(parsedData);
      }
    } catch (error) {
      console.error('Error loading weight data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async () => {
    if (!weight) return;

    const newEntry: WeightEntry = {
      date: selectedDate.toISOString().split('T')[0],
      weight: parseFloat(weight)
    };
    // console.log(newEntry);

    try {
      // Check if there's already data for this date
      const existingDataIndex = weightData.findIndex(
        entry => entry.date === newEntry.date
      );

      let updatedData;
      if (existingDataIndex !== -1) {
        // Update existing entry
        updatedData = [...weightData];
        updatedData[existingDataIndex] = newEntry;
      } else {
        // Add new entry
        updatedData = [...weightData, newEntry];
      }

      await AsyncStorage.setItem('weightData', JSON.stringify(updatedData));
      setWeightData(updatedData);
      setModalVisible(false);
      setWeight('');
    } catch (error) {
      console.error('Error saving weight data:', error);
    }
  };

  const onDateChange = (date?: string) => {
    setFirstLoad(false);
    setShowDatePicker(false);
    // console.log(date);
    if (date) {
      // Convert date string (YYYY/MM/DD) to Date object
      const [year, month, day] = date.split('/').map(Number);
      const newDate = new Date(year, month - 1, day); // month is 0-based in JavaScript Date
      setSelectedDate(newDate);
    }
  };

  const formatChartData = () => {
    // Get start and end of current week
    const today = new Date();
    // Set to Sunday of current week
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    // Filter data for current week
    const weekData = weightData.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });

    // Sort by date
    const sortedData = weekData.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // If no data for the week, return empty array
    if (sortedData.length === 0) {
      return [];
    }

    // Format data for chart
    const res = sortedData.map(entry => {
      const [year, month, day] = entry.date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      return {
        value: entry.weight,
        label: localDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        date: entry.date
      };
    });
    // console.log("res: ", res);

    return res;
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Weight</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : formatChartData().length === 0 ? (
        <Text style={styles.noDataText}>No weight data for this week</Text>
      ) : (
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
          initialSpacing={15}
          data={formatChartData()}
          spacing={30}
          thickness={3}
          yAxisColor="transparent"
          xAxisColor="transparent"
          color="#D9616A"
          yAxisTextStyle={{
            color: '#AAA',
            fontSize: 8,
          }}
          xAxisLabelTextStyle={{
            color: '#AAA',
            fontSize: 8,
          }}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Weight</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {
                  selectedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
                {/* {firstLoad 
                  ? selectedDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                } */}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DatePicker
                date={selectedDate.toString()}
                onChange={(date) => onDateChange(date)}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Enter weight (kg)"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />

            <TouchableOpacity
              style={[styles.submitButton, !weight && styles.submitButtonDisabled]}
              onPress={handleAddWeight}
              disabled={!weight}
            >
              <Text style={styles.submitButtonText}>Add Weight</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  loadingText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    color: 'white',
    fontSize: 24,
    padding: 5,
  },
  dateButton: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#D9616A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
});

export default WeightChart;
