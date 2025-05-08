import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DailyData, ExerciseEntry } from '@/types';
import { useState, useEffect } from 'react';
import STATIC_EXERCISES from '../../constants/ExerciseCalories';
import { saveDailyData, getDailyData } from '../../utils/storage';

interface WorkoutProps {
  dailyData: DailyData | null;
  onDataChange?: () => void;
}

const Workout = ({ dailyData, onDataChange }: WorkoutProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [duration, setDuration] = useState('');
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);

  // Load exercises for the current date
  useEffect(() => {
    if (dailyData?.date) {
      getDailyData(dailyData.date).then((data) => {
        setExercises(data?.exercises || []);
      });
    }
  }, [dailyData?.date]);

  // New calorie calculation using static data
  const calculateCalories = (workoutName: string, minutes: number) => {
    const exercise = STATIC_EXERCISES.find(e => e.name === workoutName);
    if (!exercise) return 0;
    return Math.round((exercise.caloriesPer30Min / 30) * minutes);
  };

  const handleDurationChange = (text: string) => {
    setDuration(text);
    if (selectedWorkout && text) {
      const minutes = parseInt(text);
      if (!isNaN(minutes)) {
        setCalculatedCalories(calculateCalories(selectedWorkout, minutes));
      } else {
        setCalculatedCalories(0);
      }
    } else {
      setCalculatedCalories(0);
    }
  };

  const handleWorkoutSelect = (workout: string) => {
    setSelectedWorkout(workout);
    if (duration) {
      const minutes = parseInt(duration);
      if (!isNaN(minutes)) {
        setCalculatedCalories(calculateCalories(workout, minutes));
      } else {
        setCalculatedCalories(0);
      }
    } else {
      setCalculatedCalories(0);
    }
  };

  const handleAddWorkout = async () => {
    if (!dailyData?.date || !selectedWorkout || !duration) return;
    const minutes = parseInt(duration);
    if (isNaN(minutes)) return;
    const calories = calculateCalories(selectedWorkout, minutes);
    const newExercise: ExerciseEntry = {
      id: Date.now().toString(),
      name: selectedWorkout,
      duration: minutes,
      calories,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    // Get current data, add exercise, update calories.burned
    const currentData = await getDailyData(dailyData.date) || { ...dailyData, exercises: [] };
    const updatedExercises = [...(currentData.exercises || []), newExercise];
    const updatedData = {
      ...currentData,
      exercises: updatedExercises,
      calories: {
        ...currentData.calories,
        burned: (currentData.calories?.burned || 0) + calories,
      },
    };
    await saveDailyData(dailyData.date, updatedData);
    setExercises(updatedExercises);
    if (typeof onDataChange === 'function') onDataChange();
    setModalVisible(false);
    setSelectedWorkout('');
    setDuration('');
    setCalculatedCalories(0);
  };

  // Calculate total burned calories from exercises
  const totalBurned = exercises.reduce((sum, ex) => sum + ex.calories, 0);

  return (
    <View style={styles.burnedSection}>
      <Text style={styles.sectionTitle}>Burned</Text>
      
      {/* Summary item */}
      <View style={styles.workoutItem}>
        <View style={styles.workoutItemLeft}>
          <Text style={styles.workoutTitle}>Total</Text>
          <Text style={styles.workoutCalories}>⚡{totalBurned} Cal</Text>
        </View>

        {/* List of saved exercises */}
        {exercises.length > 0 && (
          <View style={{ marginBottom: 15 }}>
            {exercises.map((ex) => (
              <View key={ex.id}>
                <View style={styles.workoutItemLeft}>
                  <Text style={styles.workoutTitle}>{ex.name}</Text>
                  <Text style={[styles.workoutTitle, styles.workoutDuration]}>{ex.duration} mins</Text>
                  <Text style={styles.workoutCalories}>⚡{ex.calories} Cal</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.addWorkoutButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="white" />
          <Text style={styles.addWorkoutText}>Add More Workout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Workout</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.workoutOptions}>
              {STATIC_EXERCISES.map((exercise) => (
                <TouchableOpacity
                  key={exercise.name}
                  style={[
                    styles.workoutOption,
                    selectedWorkout === exercise.name && styles.selectedWorkout
                  ]}
                  onPress={() => handleWorkoutSelect(exercise.name)}
                >
                  <Text style={[
                    styles.workoutOptionText,
                    selectedWorkout === exercise.name && styles.selectedWorkoutText
                  ]}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.workoutDetails}>
                    {exercise.caloriesPer30Min} Cal / 30 min
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={duration}
                onChangeText={handleDurationChange}
                placeholder="Enter duration"
                placeholderTextColor="#666"
              />
            </View>

            {calculatedCalories > 0 && (
              <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesText}>
                  Estimated calories burned: {calculatedCalories} Cal
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.addButton,
                (!selectedWorkout || !duration) && styles.addButtonDisabled
              ]}
              onPress={handleAddWorkout}
              disabled={!selectedWorkout || !duration}
            >
              <Text style={styles.addButtonText}>Add Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
  },
  burnedSection: {
    padding: 20,
    marginBottom: 20,
  },
  workoutItem: {
    backgroundColor: '#FFFFFF0D',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  workoutItemLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingVertical: 5,
  },
  workoutTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
    width: '40%',
  },
  workoutDuration: {
    width: '30%',
  },
  workoutCalories: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '600',
    width: '30%',
  },
  workoutProgress: {
    flex: 1,
    marginBottom: 10,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  workoutStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statIcon: {
    width: 18,
    height: 18,
  },
  workoutStats: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  addWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#D9616A',
    width: 200,
    borderRadius: 12,
    marginTop: 10,
    margin: 'auto',
  },
  addWorkoutText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
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
    maxHeight: '80%',
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
  workoutOptions: {
    maxHeight: 200,
  },
  workoutOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#2A2A2A',
  },
  selectedWorkout: {
    backgroundColor: '#D9616A',
  },
  workoutOptionText: {
    color: 'white',
    fontSize: 16,
  },
  selectedWorkoutText: {
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
  },
  caloriesContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
  },
  caloriesText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#D9616A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonDisabled: {
    backgroundColor: '#666',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  workoutDetails: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Workout;
