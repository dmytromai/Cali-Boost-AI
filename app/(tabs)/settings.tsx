import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackgroundImage from '@/components/layout/BackgroundImage';

interface MenuItemProps {
  icon: string;
  title: string;
  onPress?: () => void;
  showVersion?: boolean;
  isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress, showVersion, isLast }) => (
  <TouchableOpacity style={[styles.menuItem, isLast && styles.menuItemLast]} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Image source={icon as any} style={styles.menuIcon} />
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    {showVersion ? (
      <Text style={styles.restoreText}>9.0.2</Text>
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#888" />
    )}
  </TouchableOpacity>
);

const SettingsScreen = () => {
  const generalSettings: MenuItemProps[] = [
    { icon: require('../../assets/icons/edit-profile.png'), title: 'Edit Profile', onPress: () => { } },
    { icon: require('../../assets/icons/notification-preferences.png'), title: 'Notification Preferences', onPress: () => { } },
    { icon: require('../../assets/icons/language.png'), title: 'Language', onPress: () => { } },
    { icon: require('../../assets/icons/tracking-goals.png'), title: 'Tracking & Goals', onPress: () => { } },
    { icon: require('../../assets/icons/units-measurements.png'), title: 'Units & Measurements', onPress: () => { } },
  ];

  const privacySettings: MenuItemProps[] = [
    { icon: require('../../assets/icons/help-support.png'), title: 'Help & Support', onPress: () => { } },
    { icon: require('../../assets/icons/terms-conditions.png'), title: 'Terms & Conditions', onPress: () => { } },
    { icon: require('../../assets/icons/contact-us.png'), title: 'Contact Us', onPress: () => { } },
    { icon: require('../../assets/icons/app-version.png'), title: 'App Version', onPress: () => { } },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage />

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        {/* <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Image source={require('../../assets/icons/avatar.png')} style={styles.profileImage} />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>Wade Warren</Text>
              <Text style={styles.profileEmail}>wadewarren674@gmail.com</Text>
              <Text style={styles.profileLocation}>Canada</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Image source={require('../../assets/icons/logout.png')} style={styles.logoutIcon} width={24} height={24} />
          </TouchableOpacity>
        </View> */}

        {/* Subscription Section */}
        <View style={[styles.section, styles.profileSection]}>
          <View style={styles.sectionHeader}>
            <Image source={require('../../assets/icons/my-subscription.png')} style={styles.menuIcon} />
            <Text style={styles.sectionTitle}>My Subscription</Text>
          </View>
          <TouchableOpacity style={styles.restoreButton}>
            <Text style={styles.restoreButtonText}>Restore</Text>
          </TouchableOpacity>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GENERAL SETTINGS</Text>
          {generalSettings.map((item, index) => (
            <MenuItem
              key={index}
              {...item}
              isLast={index === generalSettings.length - 1}
            />
          ))}
        </View>

        {/* Privacy & Security */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionLabel}>PRIVACY & SECURITY</Text>
          {privacySettings.map((item, index) => (
            <MenuItem
              key={index}
              {...item}
              showVersion={item.title === 'App Version'}
              isLast={index === privacySettings.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#FFFFFF0D',
    marginTop: 20,
    marginBottom: 12,
    borderColor: '#FFFFFF0D',
    borderWidth: 1,
    borderRadius: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileText: {
    justifyContent: 'center',
  },
  profileName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#FFFFFFB2',
    fontSize: 12,
    marginBottom: 2,
  },
  profileLocation: {
    color: '#FFFFFFB2',
    fontSize: 12,
  },
  section: {
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#FFFFFF0D',
    borderColor: '#FFFFFF0D',
    borderWidth: 1,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionLabel: {
    color: '#FFFFFF99',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF0D',
  },
  menuItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTitle: {
    color: 'white',
    fontSize: 16,
  },
  restoreText: {
    color: '#888',
    fontSize: 14,
  },
  restoreButton: {
    position: 'absolute',
    right: 20,
    top: 22,
  },
  restoreButtonText: {
    color: '#888',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  lastSection: {
    marginBottom: 60,
  },
  logoutIcon: {
    width: 50,
    height: 50,
  }
});

export default SettingsScreen; 
