import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';

interface OnboardingProgressBarProps {
  progress: number
}

export default function OnboardingProgressBar({
  progress
}: OnboardingProgressBarProps) {
  const handleBack = () => {
    router.back();
  };

  const progressWidth = `${(progress / 8) * 100}%`;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Image source={require('../../assets/icons/back.png')} style={styles.backButton} />
      </TouchableOpacity>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: progressWidth as any }]} />
      </View>
      <Text style={styles.progressText}>0{progress}/08</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 18,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    marginHorizontal: 15,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
  },
  progressText: {
    color: '#D9616A',
    fontSize: 14,
    fontWeight: 800,
  },
}); 