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
import { EATING_ITEMS } from '@/constants/EatingItems';

const EatingChallenge = () => {
  const [selectedMeal, setSelectedMeal] = useState<Challenge | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const formatDescription = (description: string) => {
    // Split the description into lines
    const lines = description.split('\n');
    
    // Process each line to make meal types bold
    return lines.map((line, lineIndex) => {
      // Skip bullet points and empty lines
      if (line.startsWith('•') || line === '') {
        return <Text key={lineIndex} style={styles.modalDescription}>{line}</Text>;
      }

      // Make meal types bold (Breakfast:, Lunch:, etc.)
      if (line.endsWith(':')) {
        return <Text key={lineIndex} style={[styles.modalDescription, styles.boldText]}>{line}</Text>;
      }
      
      return <Text key={lineIndex} style={styles.modalDescription}>{line}</Text>;
    });
  };

  const handleViewDetails = (meal: Challenge) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>WEEKLY MEAL PLAN</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.exerciseSection}
        contentContainerStyle={styles.exerciseSectionContent}
      >
        {EATING_ITEMS.map((meal, index) => (
          <View 
            key={meal.id} 
            style={[
              styles.challengeCard,
              index === EATING_ITEMS.length - 1 ? { marginRight: 0 } : null
            ]}
          >
            <Image source={meal.image as any} style={styles.challengeImage} />
            <View style={styles.challengeContent}>
              <Text style={styles.challengeTitle}>{meal.title}</Text>
              <TouchableOpacity 
                style={styles.viewDetailsButton}
                onPress={() => handleViewDetails(meal)}
              >
                <Text style={styles.viewDetailsButtonText}>{meal.buttonText}</Text>
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
              <Text style={styles.modalTitle}>{selectedMeal?.title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedMeal?.description && formatDescription(selectedMeal.description)}
              {/* <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesText}>
                  Total calories: {selectedMeal?.calories} Cal
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

export default EatingChallenge;