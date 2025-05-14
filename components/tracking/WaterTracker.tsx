import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { LiquidGauge } from 'react-native-liquid-gauge';

const DAILY_GOAL = 2000; // 2000ml daily goal

interface WaterTrackerProps {
  onWaterUpdate: (amount: number) => void;
  initialAmount: number;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ onWaterUpdate, initialAmount }) => {
  const [selectedAmount, setSelectedAmount] = useState(150);
  const [totalWater, setTotalWater] = useState(initialAmount);

  useEffect(() => {
    setTotalWater(initialAmount);
  }, [initialAmount]);

  const handleAddWater = () => {
    const newTotal = Math.min(totalWater + selectedAmount, DAILY_GOAL);
    setTotalWater(newTotal);
    onWaterUpdate(newTotal);
  };

  const getPercentage = () => {
    return (totalWater / DAILY_GOAL) * 100;
  };

  return (
    <View style={styles.waterContainer}>
      <Text style={styles.sectionTitle}>Water</Text>
      <View style={styles.waterGraphContainer}>
        {/* Water Gauge */}
        <LiquidGauge
          value={getPercentage()}
          config={{
            circleColor: '#333',
            waveColor: '#6187D9',
            textColor: 'transparent',
            waveTextColor: '#6187D9',
            waveAnimateTime: 3000,
          }}
        />
        <View style={styles.centeredTextContainer}>
          <Text style={styles.waterAmount}>{totalWater}ml</Text>
        </View>
      </View>
      <View style={styles.waterButtons}>
        <TouchableOpacity
          style={[styles.waterButton, selectedAmount === 150 && styles.waterButtonActive]}
          onPress={() => setSelectedAmount(150)}
        >
          <Image source={require('../../assets/icons/half-full-cup.png')} style={styles.waterButtonIcon} />
          <Text style={styles.waterButtonText}>150 ml</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.waterButton, selectedAmount === 300 && styles.waterButtonActive]}
          onPress={() => setSelectedAmount(300)}
        >
          <Image source={require('../../assets/icons/half-quarter-full-cup.png')} style={styles.waterButtonIcon} />
          <Text style={styles.waterButtonText}>300 ml</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.waterButton, selectedAmount === 500 && styles.waterButtonActive]}
          onPress={() => setSelectedAmount(500)}
        >
          <Image source={require('../../assets/icons/full-cup.png')} style={styles.waterButtonIcon} />
          <Text style={styles.waterButtonText}>500 ml</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.addButton, totalWater >= DAILY_GOAL && styles.addButtonDisabled]}
        onPress={handleAddWater}
        disabled={totalWater >= DAILY_GOAL}
      >
        <Text style={styles.addButtonText}>Add {selectedAmount}ml</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
  },
  waterContainer: {
    padding: 18,
    backgroundColor: '#FFFFFF0D',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    borderRadius: 20,
    marginBottom: 20,
  },
  waterGraphContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  centeredTextContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none', // So it doesn't block touches
  },
  waterAmount: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  waterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  waterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
  },
  waterButtonActive: {
    backgroundColor: '#FFFFFF0D',
    borderWidth: 2,
    borderColor: '#6187D9',
  },
  waterButtonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    width: 200,
    alignSelf: 'center',
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#FF6B6B66',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  waterButtonIcon: {
    width: 20,
    height: 20,
  },
});

export default WaterTracker;
