import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ExperienceData {
  userGender?: string;
  userBirthdate?: string;
  userHeight?: string;
  userWeight?: string;
  userTargetWeight?: string;
  userGoal?: string;
  userActivity?: string;
  userCalorieTarget?: string;
  userMacroTargets?: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const [data, setData] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      AsyncStorage.getItem('experience').then((val) => {
        if (val) setData(JSON.parse(val));
        setLoading(false);
      });
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Your Profile Data</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 400 }}>
            {loading ? (
              <Text style={styles.label}>Loading...</Text>
            ) : data ? (
              <View>
                {data.userGender && <Text style={styles.label}><Text style={styles.bold}>Gender:</Text> {data.userGender}</Text>}
                {data.userBirthdate && <Text style={styles.label}><Text style={styles.bold}>Birthdate:</Text> {data.userBirthdate}</Text>}
                {data.userHeight && <Text style={styles.label}><Text style={styles.bold}>Height:</Text> {data.userHeight}</Text>}
                {data.userWeight && <Text style={styles.label}><Text style={styles.bold}>Weight:</Text> {data.userWeight}</Text>}
                {data.userTargetWeight && <Text style={styles.label}><Text style={styles.bold}>Target Weight:</Text> {data.userTargetWeight}</Text>}
                {data.userGoal && <Text style={styles.label}><Text style={styles.bold}>Goal:</Text> {data.userGoal}</Text>}
                {data.userActivity && <Text style={styles.label}><Text style={styles.bold}>Activity Level:</Text> {data.userActivity}</Text>}
                {data.userCalorieTarget && <Text style={styles.label}><Text style={styles.bold}>Calorie Target:</Text> {data.userCalorieTarget}</Text>}
                {data.userMacroTargets && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={styles.label}><Text style={styles.bold}>Macros:</Text></Text>
                    <Text style={styles.label}>  Protein: {data.userMacroTargets.protein}g</Text>
                    <Text style={styles.label}>  Carbs: {data.userMacroTargets.carbs}g</Text>
                    <Text style={styles.label}>  Fat: {data.userMacroTargets.fat}g</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.label}>No data found.</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    color: 'white',
    fontSize: 24,
    padding: 5,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
});

export default EditProfileModal;
