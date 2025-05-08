export interface MealItem {
  id: string;
  title: string;
  calories: number;
  image: any;
  time: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MealSection {
  title: string;
  totalCalories: number;
  items: MealItem[];
}

export interface ExerciseEntry {
  id: string;
  name: string;
  duration: number; // in minutes
  calories: number;
  time: string; // e.g., '14:30'
}

export interface DailyData {
  date: string;
  calories: {
    eaten: number;
    burned: number;
  };
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  water: number;
  meals: MealSection[];
  exercises?: ExerciseEntry[];
}

export interface FoodResponse {
  food_id: number;
  food_entry_name: string;
  eaten: {
    food_name_singular: string;
    food_name_plural: string;
    total_nutritional_content: {
      calories: string;
      protein: string;
      carbohydrate: string;
      fat: string;
    };
  };
}
