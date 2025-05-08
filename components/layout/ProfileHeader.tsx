import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const ProfileHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome 👋</Text>
        {/* <Text style={styles.userName}>Wade Thomas</Text> */}
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity>
          <Image source={require('../../assets/icons/notification.png')} style={styles.notificationIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Image source={require('../../assets/icons/avatar.png')} style={styles.notificationIcon} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    color: '#888',
    fontSize: 14,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationIcon: {
    width: 50,
    height: 50,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
