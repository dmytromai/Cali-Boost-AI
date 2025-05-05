import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import OnboardingButton from '@/components/onboarding/OnboardingButton';
import BackgroundImage from '@/components/layout/BackgroundImage';

export default function OnboardingPersonalize() {
  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />
      <View style={styles.content}>
        <Text style={styles.title}>Personalize Your{'\n'}Experience</Text>

        <Image source={require('../../assets/images/personalize.png')} style={styles.imgContainer} />

        <View>
          <Text style={styles.subtitle}>
            Before Getting Started We Will Need To Gather{'\n'}Some Information About You To Better Assist You{'\n'}In Reaching Goal.
          </Text>
          <OnboardingButton
            title="Continue"
            onPress={() => router.push('/goal')}
            style={styles.button}
          />
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
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40,
  },
  imgContainer: {
    width: '100%',
    height: 300,
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    marginBottom: 30,
  },
}); 