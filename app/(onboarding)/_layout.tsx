import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import BackgroundImage from '../../components/layout/BackgroundImage';
import { View } from 'react-native';

export default function OnboardingLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        <BackgroundImage />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="personalize" />
          <Stack.Screen name="goal" />
          <Stack.Screen name="gender" />
          <Stack.Screen name="birthdate" />
          <Stack.Screen name="height" />
          <Stack.Screen name="activity" />
          <Stack.Screen name="target-weight" />
          <Stack.Screen name="complete" />
          <Stack.Screen name="subscription" />
        </Stack>
      </View>
    </ThemeProvider>
  );
} 