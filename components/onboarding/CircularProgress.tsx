import React from 'react';
import { Text, StyleSheet, Image, View, GestureResponderEvent } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Circle } from 'react-native-svg';
import { useState, useRef, useEffect } from 'react';

interface CircularProgressProps {
  currentValue: number;
  maxValue: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
}

export default function CircularProgress({ currentValue, maxValue, onValueChange, disabled = false }: CircularProgressProps) {
  const [value, setValue] = useState(currentValue);
  const [center, setCenter] = useState<{ x: number; y: number } | null>(null);
  const progressRef = useRef<View>(null);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  // Set center position after layout
  const onLayout = () => {
    if (progressRef.current) {
      progressRef.current.measure((x, y, width, height, pageX, pageY) => {
        setCenter({ x: pageX + width / 2, y: pageY + height / 2 });
      });
    }
  };

  // Helper to calculate value from touch position
  const calculateValueFromTouch = (touchX: number, touchY: number) => {
    if (!center) return value;
    const dx = touchX - center.x;
    const dy = touchY - center.y;
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += 2 * Math.PI;
    const progress = angle / (2 * Math.PI);
    return Math.round(progress * maxValue);
  };

  // Handle tap on the circular progress
  const handleTap = (e: GestureResponderEvent) => {
    if (disabled || !center) return;
    const { pageX, pageY } = e.nativeEvent;
    const newValue = calculateValueFromTouch(pageX, pageY);
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <View
      ref={progressRef}
      onLayout={onLayout}
      onStartShouldSetResponder={() => !disabled}
      onResponderRelease={handleTap}
    >
      <AnimatedCircularProgress
        size={120}
        width={8}
        fill={value / maxValue * 100}
        tintColor="#D9616A"
        backgroundColor="#3d5875"
        rotation={0}
        renderCap={({ center: capCenter }) => (
          <Circle
            cx={capCenter.x}
            cy={capCenter.y}
            r="10"
            fill="#D9616A"
            pointerEvents="none"
          />
        )}
        padding={5}
      >
        {
          (fill) => (
            <View style={styles.progressContainer} pointerEvents="none">
              <Image source={require('../../assets/icons/light.png')} style={[styles.statIcon, disabled && styles.disabledIcon]} />
              <Text style={[styles.progressValue, disabled && styles.disabledText]}>
                {value}
              </Text>
              <Text style={[styles.progressLabel, disabled && styles.disabledText]}>
                / {maxValue}kcal
              </Text>
            </View>
          )
        }
      </AnimatedCircularProgress>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  statIcon: {
    width: 18,
    height: 18,
  },
  progressValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
  },
  progressLabel: {
    color: '#888',
    fontSize: 14,
  },
  disabledIcon: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  }
});