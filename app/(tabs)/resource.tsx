import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import BackgroundImage from '@/components/layout/BackgroundImage';
import ProfileHeader from '@/components/layout/ProfileHeader';
import { Challenge } from '@/types';
import ExerciseChallenge from '@/components/resource/ExerciseChallenge';
import EatingChallenge from '@/components/resource/EatingChallenge';

const ResourceScreen = () => {
  const [activeTab, setActiveTab] = useState<'eating' | 'exercise'>('eating');

  const eatingChallenges: Challenge[] = [
    {
      id: '3',
      title: 'Eat the Rainbow',
      description: 'Eat fruits and veggies of 7 colors',
      type: 'challenge',
      image: require('../../assets/images/rainbow-challenge.png'),
      buttonText: 'Start',
    },
    {
      id: '4',
      title: 'Hydration Challenge',
      description: '8 glasses of water every day',
      type: 'challenge',
      image: require('../../assets/images/hydration-challenge.png'),
      buttonText: 'Start',
    },
  ];

  const exerciseChallenges: Challenge[] = [
    {
      id: '3',
      title: '7-Day Move More Challenge',
      description: 'Do at least 30 minutes of any physical activity',
      type: 'challenge',
      image: require('../../assets/images/rainbow-challenge.png'),
      buttonText: 'Start',
    },
    {
      id: '4',
      title: '10K Steps-a-Day Challenge',
      description: 'Hit 10,000 steps daily for 14 days straight',
      type: 'challenge',
      image: require('../../assets/images/hydration-challenge.png'),
      buttonText: 'Start',
    },
  ];

  const renderChallengeCard = (challenge: Challenge) => (
    <View key={challenge.id} style={styles.challengeCard}>
      <Image source={challenge.image as any} style={styles.challengeImage} />
      <View style={styles.challengeContent}>
        <View>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
        </View>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>{challenge.buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      {/* Profile Info */}
      <ProfileHeader />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'eating' && styles.activeTab]}
          onPress={() => setActiveTab('eating')}
        >
          <Text style={[styles.tabText, activeTab === 'eating' && styles.activeTabText]}>
            Eating Challenge
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'exercise' && styles.activeTab]}
          onPress={() => setActiveTab('exercise')}
        >
          <Text style={[styles.tabText, activeTab === 'exercise' && styles.activeTabText]}>
            Exercise Challenge
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'eating' &&
        <ScrollView style={styles.content}>
          <EatingChallenge />

          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>MORE CHALLENGES</Text>
            {eatingChallenges.map(renderChallengeCard)}
          </View>
        </ScrollView>}

      {activeTab === 'exercise' &&
        <ScrollView style={styles.content}>
          <ExerciseChallenge />

          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>MORE CHALLENGES</Text>
            {exerciseChallenges.map(renderChallengeCard)}
          </View>
        </ScrollView>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 16,
  },
  activeTabText: {
    color: '#FF6B6B',
  },
  content: {
    flex: 1,
  },
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
  challengeCard: {
    backgroundColor: '#FFFFFF0D',
    borderRadius: 15,
    marginBottom: 15,
    padding: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
  },
  challengeImage: {
    width: '100%',
    borderRadius: 15,
    height: 240,
    resizeMode: 'cover',
    marginBottom: 12,
  },
  challengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  challengeDescription: {
    color: '#FFFFFF99',
    fontSize: 12,
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  lastSection: {
    marginBottom: 40,
  },
});

export default ResourceScreen; 