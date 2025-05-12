import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { useState } from 'react';
import { Challenge } from '@/types';
import { EXERCISE_ITEMS } from '@/constants/ExerciseItems';

const ExerciseChallenge = () => {
  const [selectedExercise, setSelectedExercise] = useState<Challenge | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const formatDescription = (description: string) => {
    // Split the description into lines
    const lines = description.split('\n');
    
    // Process each line to make exercise names bold
    return lines.map((line, lineIndex) => {
      // Skip special lines that already have bullet points or are headers
      if (line.startsWith('•') || line.startsWith('Choose')) {
        return <Text key={lineIndex} style={styles.modalDescription}>{line}</Text>;
      }

      // Split the line by colon to separate exercise name from details
      const parts = line.split(':');
      if (parts.length === 2) {
        return (
          <Text key={lineIndex} style={styles.modalDescription}>
            <Text>• </Text>
            <Text style={styles.boldText}>{parts[0]}</Text>
            {`:${parts[1]}`}
          </Text>
        );
      }
      
      return <Text key={lineIndex} style={styles.modalDescription}>{line}</Text>;
    });
  };

  const handleViewDetails = (exercise: Challenge) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>WEEKLY EXERCISE PLAN</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false} 
        style={styles.exerciseSection}
        contentContainerStyle={styles.exerciseSectionContent}
      >
        {EXERCISE_ITEMS.map((challenge, index) => (
          <View 
            key={challenge.id} 
            style={[
              styles.challengeCard,
              index === EXERCISE_ITEMS.length - 1 ? { marginRight: 0 } : null
            ]}
          >
            <Image source={challenge.image as any} style={styles.challengeImage} />
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <TouchableOpacity 
                style={styles.viewDetailsButton}
                onPress={() => handleViewDetails(challenge)}
              >
                <Text style={styles.viewDetailsButtonText}>{challenge.buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedExercise?.title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {formatDescription(selectedExercise?.description ?? '')}
              {/* <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesText}>
                  Estimated calories burned: {selectedExercise?.calories} Cal
                </Text>
              </View> */}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  exerciseSection: {
    flexDirection: 'row',
  },
  exerciseSectionContent: {
    paddingRight: 20,
  },
  challengeCard: {
    backgroundColor: '#FFFFFF0D',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    marginRight: 12,
    width: 280,
  },
  challengeImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  challengeContent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  viewDetailsButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    width: 100,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    color: 'white',
    fontSize: 24,
    padding: 5,
  },
  modalBody: {
    maxHeight: '80%',
  },
  modalDescription: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
  },
  caloriesContainer: {
    backgroundColor: '#2A2A2A',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  caloriesText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExerciseChallenge;