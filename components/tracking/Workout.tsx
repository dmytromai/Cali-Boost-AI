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
import { DailyData } from '@/types';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';

interface WorkoutProps {
  dailyData: DailyData | null;
}

// Get API key from environment variables
const NINJAS_API_KEY = Constants.expoConfig?.extra?.NINJAS_API_KEY;
const FATSECRET_CLIENT_ID = Constants.expoConfig?.extra?.FATSECRET_CLIENT_ID;
const FATSECRET_CLIENT_SECRET = Constants.expoConfig?.extra?.FATSECRET_CLIENT_SECRET;

if (!NINJAS_API_KEY || !FATSECRET_CLIENT_ID || !FATSECRET_CLIENT_SECRET) {
  console.error('API_KEY is not defined in environment variables');
}

interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

interface CaloriesBurned {
  name: string;
  calories_per_hour: number;
  duration_minutes: number;
  total_calories: number;
}

// Calorie burn rates per minute for different activities (approximate values)
const WORKOUT_CALORIES = {
  walking: 4,
  running: 10,
  cycling: 7,
  swimming: 8,
  weightlifting: 5,
  yoga: 3,
  dancing: 6,
};

const Workout = ({ dailyData }: WorkoutProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [duration, setDuration] = useState('');
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calculatingCalories, setCalculatingCalories] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  // Function to get FatSecret access token
  const getFatSecretAccessToken = async () => {
    try {
      const response = await fetch('https://oauth.fatsecret.com/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          'scope': 'premier',
          'grant_type': 'client_credentials',
        }).toString()
      });

      const data = await response.json();
      console.log("FatSecret API Result:", data);
      if (data.access_token) {
        setAccessToken(data.access_token);
        return data.access_token;
      }
      throw new Error('Failed to get access token');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  const fetchExercises = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://api.api-ninjas.com/v1/exercises?muscle=biceps',
        {
          headers: {
            'X-Api-Key': NINJAS_API_KEY || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExercises(data);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Failed to fetch exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateCalories = async (workoutType: string, minutes: number) => {
    try {
      setCalculatingCalories(true);
      setError(null);

      const response = await fetch(
        `https://api.api-ninjas.com/v1/caloriesburned?activity=${workoutType}&weight=70&duration=${minutes}`,
        {
          headers: {
            'X-Api-Key': NINJAS_API_KEY || '',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CaloriesBurned[] = await response.json();
      console.log(data);
      if (data && data.length > 0) {
        setCalculatedCalories(data[0].total_calories);
      } else {
        setCalculatedCalories(0);
      }
    } catch (err) {
      console.error('Error calculating calories:', err);
      setError('Failed to calculate calories. Please try again.');
      setCalculatedCalories(0);
    } finally {
      setCalculatingCalories(false);
    }
  };

  const handleDurationChange = (text: string) => {
    setDuration(text);
    if (selectedWorkout && text) {
      const minutes = parseInt(text);
      if (!isNaN(minutes)) {
        calculateCalories(selectedWorkout, minutes);
      }
    }
  };

  const handleWorkoutSelect = (workout: string) => {
    setSelectedWorkout(workout);
    if (duration) {
      const minutes = parseInt(duration);
      if (!isNaN(minutes)) {
        calculateCalories(workout, minutes);
      }
    }
  };

  const handleAddWorkout = () => {
    // Here you would typically save the workout data
    // For now, we'll just close the modal
    setModalVisible(false);
    setSelectedWorkout('');
    setDuration('');
    setCalculatedCalories(0);
  };

  return (
    <View style={styles.burnedSection}>
      <Text style={styles.sectionTitle}>Burned</Text>
      <View style={styles.workoutItem}>
        <View style={styles.workoutItemLeft}>
          <Text style={styles.workoutTitle}>Walking</Text>
          <Text style={styles.workoutTitle}>60mins</Text>
          {/* <Text style={styles.workoutCalories}>⚡{dailyData?.calories.burned || 0} Cal</Text> */}
          <Text style={styles.workoutCalories}>⚡190 Cal</Text>
        </View>
        {/* <View style={styles.workoutProgress}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBar, { width: '60%', backgroundColor: '#FF5722' }]} />
          </View>
          <View style={styles.workoutStatsContainer}>
            <Text style={styles.workoutStats}>0</Text>
            <Text style={styles.workoutStats}>4000 Steps</Text>
          </View>
        </View> */}

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

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading exercises...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchExercises}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={styles.workoutOptions}>
                {exercises.map((exercise) => (
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
                      {exercise.muscle} • {exercise.difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

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

            {calculatingCalories ? (
              <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesText}>Calculating calories...</Text>
              </View>
            ) : calculatedCalories > 0 && (
              <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesText}>
                  Estimated calories burned: {calculatedCalories} Cal
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.addButton,
                (!selectedWorkout || !duration || calculatingCalories) && styles.addButtonDisabled
              ]}
              onPress={handleAddWorkout}
              disabled={!selectedWorkout || !duration || calculatingCalories}
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
  },
  workoutTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  workoutCalories: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '600',
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF5722',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#D9616A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  workoutDetails: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Workout;
