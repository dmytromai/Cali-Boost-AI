import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MealSection } from '@/types';

interface MealsListProps extends MealSection {
  onAddMeal: () => void;
  targetMacros: {
    protein: number;
    fat: number;
    carbs: number;
  }
}

const MealsList: React.FC<MealsListProps> = ({ title, totalCalories, items, onAddMeal, targetMacros }) => {
  // Calculate total macros from all items
  const totalMacros = items.reduce((acc, item) => ({
    protein: acc.protein + (item.macros?.protein || 0),
    carbs: acc.carbs + (item.macros?.carbs || 0),
    fat: acc.fat + (item.macros?.fat || 0),
  }), { protein: 0, carbs: 0, fat: 0 });

  // Calculate percentage for progress bars
  const getPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <View style={styles.mealSection}>
      <View style={styles.mealHeader}>
        <View>
          <Text style={styles.mealTitle}>{title}</Text>
          <Text style={styles.mealCalories}>⚡{totalCalories} Cal</Text>
        </View>
        <View style={styles.mealHeaderRight}>
          <TouchableOpacity style={styles.addMealButton} onPress={onAddMeal}>
            <Text style={styles.addMealButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.macrosContainer}>
        <View style={styles.macroContent}>
          <View style={styles.macroBar}>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroPercentage}>{totalMacros.protein.toFixed(0)}/{targetMacros.protein}g</Text>
          </View>
          <View style={styles.macroBarInner}>
            <View style={[styles.macroProgress, { width: `${getPercentage(totalMacros.protein, targetMacros.protein)}%`, backgroundColor: '#2196F3' }]} />
          </View>
        </View>
        <View style={styles.macroContent}>
          <View style={styles.macroBar}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroPercentage}>{totalMacros.carbs.toFixed(0)}/{targetMacros.carbs}g</Text>
          </View>
          <View style={styles.macroBarInner}>
            <View style={[styles.macroProgress, { width: `${getPercentage(totalMacros.carbs, targetMacros.carbs)}%`, backgroundColor: '#4CAF50' }]} />
          </View>
        </View>
        <View style={styles.macroContent}>
          <View style={styles.macroBar}>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroPercentage}>{totalMacros.fat.toFixed(0)}/{targetMacros.fat}g</Text>
          </View>
          <View style={styles.macroBarInner}>
            <View style={[styles.macroProgress, { width: `${getPercentage(totalMacros.fat, targetMacros.fat)}%`, backgroundColor: '#FF5722' }]} />
          </View>
        </View>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.mealItem}>
          <View style={styles.mealItemLeft}>
            <Image source={{ uri: item.image }} style={styles.mealImage} />
            <View>
              <Text style={styles.mealItemTitle}>{item.title}</Text>
              <Text style={styles.mealItemCalories}>⚡{item.calories} Cal</Text>
            </View>
          </View>
          <Text style={styles.mealTime}>{item.time}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mealSection: {
    backgroundColor: '#FFFFFF0D',
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mealTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mealHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCalories: {
    color: '#FF6B6B',
    fontSize: 16,
    marginRight: 10,
  },
  addMealButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addMealButtonText: {
    color: 'white',
    fontSize: 14,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  mealItemTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  mealItemCalories: {
    color: '#888',
    fontSize: 14,
  },
  mealTime: {
    color: '#888',
    fontSize: 12,
  },
  macrosContainer: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroContent: {
    flexDirection: 'column',
    width: '32%',
    position: 'relative',
  },
  macroBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroBarInner: {
    flex: 1,
    height: 4,
    backgroundColor: '#3A3A3A',
    borderRadius: 2,
  },
  macroProgress: {
    height: '100%',
    borderRadius: 2,
  },
  macroPercentage: {
    color: '#888',
    fontSize: 12,
    width: 50,
    marginRight: -8,
  },
  macroLabel: {
    color: '#888',
    fontSize: 12,
  },
});

export default MealsList;
