import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/layout/CustomTabBar';
import BackgroundImage from '../../components/layout/BackgroundImage';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <BackgroundImage />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
          },
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
          }}
        />
        <Tabs.Screen
          name="intake"
          options={{
            title: 'Intake',
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Scanner',
          }}
        />
        <Tabs.Screen
          name="resource"
          options={{
            title: 'Resource',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
          }}
        />
      </Tabs>
    </View>
  );
}
