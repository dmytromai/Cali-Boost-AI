import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const getIconName = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'dashboard':
        return isFocused ? require('../../assets/icons/dashboard-selected.png') : require('../../assets/icons/dashboard.png');
      case 'intake':
        return isFocused ? require('../../assets/icons/tracking-selected.png') : require('../../assets/icons/tracking.png');
      case 'scanner':
        return isFocused ? require('../../assets/icons/scanner.png') : require('../../assets/icons/scanner.png');
      case 'resource':
        return isFocused ? require('../../assets/icons/resource-selected.png') : require('../../assets/icons/resource.png');
      case 'settings':
        return isFocused ? require('../../assets/icons/settings-selected.png') : require('../../assets/icons/settings.png');
      default:
        return require('../../assets/icons/dashboard.png');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isScanner = route.name.toLowerCase() === 'scanner';

          if (isScanner) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
                style={[styles.scannerTab, isFocused && styles.scannerTabFocused]}
              >
                <Image
                  source={getIconName(route.name.toLowerCase(), isFocused) as any}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tab}
            >
              <Image
                source={getIconName(route.name.toLowerCase(), isFocused) as any}
                style={{ width: 24, height: 24 }}
              />
              <Text style={[
                styles.tabText,
                isFocused && styles.tabTextFocused
              ]}>
                {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A1A',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#FFFFFF99',
    fontSize: 12,
    marginTop: 4,
  },
  tabTextFocused: {
    color: '#D9616A',
  },
  scannerTab: {
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: '#FF6B6B',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  scannerTabFocused: {
    backgroundColor: '#FF8585',
  },
});

export default CustomTabBar; 