import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = width - 40; // 20px padding on each side
const CIRCLE_SIZE = 50;
const CIRCLE_MARGIN = 2;
// Adjust MAX_SLIDE_DISTANCE to account for the circle margin
const MAX_SLIDE_DISTANCE = BUTTON_WIDTH - CIRCLE_SIZE * 1.5 - (CIRCLE_MARGIN * 4);

interface Props {
  onComplete: () => void;
  onProgress?: (progress: number) => void;
}

export default function OnboardingSlideToStart({ onComplete, onProgress }: Props) {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);

  // Add listener for progress
  React.useEffect(() => {
    const id = pan.x.addListener(({ value }) => {
      const progress = Math.min(1, value / MAX_SLIDE_DISTANCE);
      onProgress?.(progress);
    });

    return () => pan.x.removeListener(id);
  }, [pan.x, onProgress]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_, gesture) => {
        const newX = Math.max(0, Math.min(gesture.dx, MAX_SLIDE_DISTANCE));
        pan.x.setValue(newX);
      },
      onPanResponderRelease: (_, gesture) => {
        setIsDragging(false);
        if (gesture.dx >= MAX_SLIDE_DISTANCE - 50) {
          Animated.spring(pan.x, {
            toValue: MAX_SLIDE_DISTANCE,
            useNativeDriver: false,
          }).start(() => onComplete());
        } else {
          Animated.spring(pan.x, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const buttonOpacity = pan.x.interpolate({
    inputRange: [0, MAX_SLIDE_DISTANCE],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {/* Background Track */}
        <View style={styles.track}>
          <Animated.Text style={[styles.buttonText, { opacity: buttonOpacity }]}>
            Slide to Get Started
          </Animated.Text>
          <Animated.View style={[styles.arrows, { opacity: buttonOpacity }]}>
            <Ionicons name="chevron-forward" size={24} color="white" />
            <Ionicons name="chevron-forward" size={24} color="white" />
            <Ionicons name="chevron-forward" size={24} color="white" />
          </Animated.View>
        </View>

        {/* Sliding Circle */}
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ translateX: pan.x }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.circleContent}>
            <Image source={require('../../assets/icons/slide.png')} style={styles.slideImage} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    height: CIRCLE_SIZE,
    position: 'relative',
  },
  track: {
    width: '100%',
    height: CIRCLE_SIZE,
    backgroundColor: '#FF6B6B',
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  circle: {
    width: CIRCLE_SIZE - (CIRCLE_MARGIN * 2),
    height: CIRCLE_SIZE - (CIRCLE_MARGIN * 2),
    marginTop: CIRCLE_MARGIN,
    marginLeft: CIRCLE_MARGIN,
    position: 'absolute',
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  circleContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 32,
  },
  arrows: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slideImage: {
    width: 24,
    height: 24,
  }
}); 