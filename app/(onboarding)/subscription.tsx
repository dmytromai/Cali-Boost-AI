import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import BackgroundImage from '@/components/layout/BackgroundImage';
import OnboardingProgressBar from '@/components/onboarding/OnboardingProgressBar';

export default function SubscriptionScreen() {
  const handleGetStarted = () => {
    router.push('/(tabs)/dashboard');
  };

  const handleOpenPrivacy = () => {
    Linking.openURL('https://sites.google.com/view/puffmeter-privacy-policy/home?authuser=1');
  };
  const handleOpenTerms = () => {
    Linking.openURL('https://sites.google.com/view/puffmate-terms-conditions/home?authuser=1');
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      <OnboardingProgressBar progress={8} />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Lose 2x More Weight{'\n'}With Our App</Text>
        <Text style={styles.subtitle}>
          Studies Show Users Lose Twice As Much Weight With{'\n'}Guided Tracking And Support.
        </Text>

        {/* Chart */}
        {/* <View style={styles.chartContainer}>
          <View style={styles.chart}>
            <View style={styles.barContainer}>
              <View style={styles.barLabel}>
                <Text style={styles.barText}>Without{'\n'}Calorie App</Text>
              </View>
              <View style={styles.greyBar}>
                <Text style={styles.barPercentage}>25%</Text>
              </View>
            </View>

            <View style={styles.barContainer}>
              <View style={styles.barLabel}>
                <Text style={styles.barText}>With{'\n'}Calorie App</Text>
              </View>
              <View style={styles.pinkBar}>
                <Text style={styles.barPercentage}>2x</Text>
              </View>
            </View>
          </View>
        </View> */}

      </View>

      <Image source={require('../../assets/images/subscription.png')} style={styles.imageContainer} />

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <Text style={styles.priceText}>
          No Commitment $29.95 Yearly. Cancel Anytime
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Let's Get Started</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleOpenTerms}>
            <Text style={styles.footerLink}>Terms & Condition</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Restore Purchase</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenPrivacy}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 12,
    color: '#FFFFFFB2',
    marginTop: 5,
  },
  imageContainer: {
    // marginTop: 140,
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  chartContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 200,
    alignItems: 'flex-end',
  },
  barContainer: {
    alignItems: 'center',
    width: '40%',
  },
  barLabel: {
    marginBottom: 10,
  },
  barText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  greyBar: {
    width: '100%',
    height: 80,
    backgroundColor: '#444',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinkBar: {
    width: '100%',
    height: 160,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barPercentage: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSection: {
    padding: 20,
  },
  priceText: {
    color: '#FFFFFFB2',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  footerLink: {
    color: '#FFFFFFB2',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
}); 