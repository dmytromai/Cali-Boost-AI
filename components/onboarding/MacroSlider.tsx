import { View, Text, StyleSheet, PanResponder } from 'react-native';
import { useRef, useState, useEffect } from 'react';

interface MacroSliderProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
}

export default function MacroSlider({
  label,
  value,
  maxValue,
  color,
  onValueChange,
  disabled = false
}: MacroSliderProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const sliderRef = useRef<View>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderMove: (_, gestureState) => {
        if (sliderRef.current && !disabled) {
          sliderRef.current.measure((x, y, width, height, pageX, pageY) => {
            // Calculate the new value based on the touch position
            const newValue = Math.max(0, Math.min(maxValue,
              Math.round((gestureState.moveX - pageX) / width * maxValue)
            ));

            if (newValue !== currentValue) {
              setCurrentValue(newValue);
              onValueChange?.(newValue);
            }
          });
        }
      },
    })
  ).current;

  const progressPercentage = (currentValue / maxValue) * 100;

  return (
    <View style={styles.macroCard}>
      <Text style={styles.macroLabel}>{label}</Text>
      <View
        ref={sliderRef}
        style={styles.progressBar}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPercentage}%`,
              backgroundColor: disabled ? '#888' : color
            }
          ]}
        />
      </View>
      <Text style={[styles.macroValue, disabled && styles.disabledText]}>
        {currentValue}/{maxValue}g
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  macroCard: {
    backgroundColor: '#FFFFFF0D',
    padding: 8,
    borderRadius: 15,
    borderColor: '#FFFFFF1A',
    borderWidth: 1,
    justifyContent: 'space-between',
    gap: 2,
  },
  macroLabel: {
    color: 'white',
    fontSize: 14,
  },
  macroValue: {
    color: 'white',
    fontSize: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    minWidth: 95,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    borderRadius: 12,
  },
  disabledText: {
    opacity: 0.5,
  },
}); 