import React from 'react';
import { StyleSheet, Image } from 'react-native';

const BackgroundImage = () => {
  return (
    <Image source={require('../../assets/images/background.png')} style={styles.container}>
    </Image>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    resizeMode: 'cover',
  },
});

export default BackgroundImage; 