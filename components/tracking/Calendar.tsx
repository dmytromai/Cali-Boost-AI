import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

interface WeekDay {
  day: string;
  date: string;
  fullDate: string;
  isActive: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  // Generate dates for the last 7 days
  const generateWeekDays = (): WeekDay[] => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const today = new Date();
    const weekDays: WeekDay[] = [];

    // Get the current day of the week (0 = Sunday, 6 = Saturday)
    const currentDayOfWeek = today.getDay();

    // Calculate how many days to go back to reach Sunday
    const daysToSubtract = currentDayOfWeek;

    // Generate dates for the full week (Sunday to Saturday)
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (daysToSubtract - i));
      const dayName = days[date.getDay()];
      const dateNumber = date.getDate().toString();
      const fullDate = date.toISOString().split('T')[0];
      const isActive = fullDate === selectedDate || (!selectedDate && i === daysToSubtract);

      weekDays.push({
        day: dayName,
        date: dateNumber,
        fullDate,
        isActive,
      });
    }

    return weekDays;
  };

  const weekDays = generateWeekDays();

  return (
    <View style={styles.calendar}>
      {weekDays.map((day, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.dayButton, day.isActive && styles.activeDayButton]}
          onPress={() => onDateSelect(day.fullDate)}
        >
          <Text style={[styles.dayText, day.isActive && styles.activeDayText]}>{day.day}</Text>
          <Text style={[styles.dateText, day.isActive && styles.activeDateText]}>{day.date}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    paddingHorizontal: 15,
    marginTop: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  dayButton: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 45,
  },
  activeDayButton: {
    backgroundColor: '#FFFFFF0D',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
  },
  dayText: {
    color: '#888',
    fontSize: 12,
  },
  dateText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  activeDayText: {
    color: 'white',
  },
  activeDateText: {
    color: 'white',
  },
});

export default Calendar; 