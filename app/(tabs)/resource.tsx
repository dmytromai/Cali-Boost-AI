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

interface Challenge {
  id: string;
  title: string;
  calories?: number;
  image?: string;
  description?: string;
  type: 'meal' | 'exercise' | 'challenge';
  buttonText?: string;
}

const ResourceScreen = () => {
  const [activeTab, setActiveTab] = useState<'eating' | 'exercise'>('eating');

  const breakfastItems: Challenge[] = [
    {
      id: '1',
      title: 'Cow Milk',
      calories: 25,
      type: 'meal',
      image: require('../../assets/images/milk.png'),
    },
    {
      id: '2',
      title: 'Avocado toast',
      calories: 100,
      type: 'meal',
      image: require('../../assets/images/avocado-toast.png'),
    },
  ];

  const lunchItems: Challenge[] = [
    {
      id: '1',
      title: 'Cow Milk',
      calories: 25,
      type: 'meal',
      image: require('../../assets/images/milk.png'),
    },
    {
      id: '2',
      title: 'Avocado toast',
      calories: 100,
      type: 'meal',
      image: require('../../assets/images/avocado-toast.png'),
    },
  ];

  const exerciseItems: Challenge[] = [
    {
      id: '1',
      title: 'Push-ups',
      description: '3 sets of 15-20 reps',
      calories: 120,
      type: 'exercise',
      image: require('../../assets/images/push-up.png'),
      buttonText: 'Start',
    },
    {
      id: '2',
      title: 'Squats',
      description: '3 sets of 20 reps',
      calories: 90,
      type: 'exercise',
      image: require('../../assets/images/squat.png'),
      buttonText: 'Start',
    },
  ];

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

  const renderMealItem = (item: Challenge) => (
    <View key={item.id} style={styles.mealItem}>
      <View style={styles.mealItemLeft}>
        <Image source={item.image as any} style={styles.mealImage} />
        <View>
          <Text style={styles.mealTitle}>{item.title}</Text>
          <Text style={styles.calories}>⚡{item.calories} Cal</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  const renderExerciseItem = (challenge: Challenge, index: number) => (
    <View
      key={challenge.id}
      style={[
        styles.challengeCard,
        styles.exerciseCard,
        index === exerciseItems.length - 1 ? { marginRight: 0 } : null
      ]}
    >
      <Image source={challenge.image as any} style={[styles.challengeImage, styles.exerciseImage]} />
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TODAY'S EATING CHALLENGE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exerciseSection}>
              <View style={[styles.mealSection, { marginRight: 12 }]}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealType}>Breakfast</Text>
                  <Text style={styles.totalCalories}>⚡456 Cal</Text>
                </View>
                {breakfastItems.map(renderMealItem)}
              </View>
              <View style={styles.mealSection}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealType}>Lunch</Text>
                  <Text style={styles.totalCalories}>⚡456 Cal</Text>
                </View>
                {lunchItems.map(renderMealItem)}
              </View>
            </ScrollView>
          </View>

          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>MORE CHALLENGES</Text>
            {eatingChallenges.map(renderChallengeCard)}
          </View>
        </ScrollView>}

      {activeTab === 'exercise' &&
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TODAY'S EXERCISE CHALLENGE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exerciseSection}>
              {exerciseItems.map((challenge, index) => renderExerciseItem(challenge, index))}
            </ScrollView>
          </View>

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
  mealSection: {
    backgroundColor: '#FFFFFF0D',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    // width: '80%',
    minWidth: 260,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF1A',
    paddingBottom: 10,
    marginBottom: 15,
  },
  mealType: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  totalCalories: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseSection: {
    flexDirection: 'row',
  },
  exerciseCard: {
    // width: '80%',
    marginRight: 12,
    minWidth: 260,
  },
  exerciseImage: {
    height: 170,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 6,
  },
  mealTitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  calories: {
    color: '#888',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
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