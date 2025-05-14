import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  ActivityIndicator, TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../outils/axios';
import { Calendar } from 'react-native-calendars';

type Day = {
  dateString: string;
  day: number;
  month: number;
  year: number;
};

const Statistics = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const calendarTheme = {
    calendarBackground: '#fff',
    todayTextColor: '#6c5ce7',
    arrowColor: '#6c5ce7',
    monthTextColor: '#2d3436',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
  };

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      const response = await axios.get('/statistics', {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate, exerciseType },
      });

      setWorkouts(response.data.workouts);
      setTotalCalories(response.data.totalCalories);
      setWorkoutCount(response.data.workoutCount);
    } catch (err: any) {
      setError('Failed to load statistics. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, exerciseType]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleDateSelect = (date: string, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(date);
      setShowStartCalendar(false);
    } else {
      setEndDate(date);
      setShowEndCalendar(false);
    }
  };

const groupWorkoutsByDay = (workouts: any[]) => {
  const grouped: Record<string, { workouts: any[]; totalCalories: number; totalTime: number }> = {};

  workouts.forEach((workout) => {
    const date = new Date(workout.completedDate).toISOString().split('T')[0]; // "YYYY-MM-DD"

    if (!grouped[date]) {
      grouped[date] = {
        workouts: [],
        totalCalories: 0,
        totalTime: 0,
      };
    }

    grouped[date].workouts.push(workout);
    grouped[date].totalCalories += workout.caloriesBurned || 0;
    grouped[date].totalTime += workout.duration || 0; // Assuming duration is in minutes
  });

  // Convert to array and sort by date (descending)
  return Object.entries(grouped)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
    .map(([date, data]) => ({ date, ...data }));
};

   const groupedWorkouts = groupWorkoutsByDay(workouts);


  if (isLoading) {
    return (
      <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c5ce7" />
        <Text style={styles.loadingText}>Crunching your numbers...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.container}>
        <View style={styles.errorCard}>
          <MaterialIcons name="error-outline" size={48} color="#d63031" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            setError(null);
            fetchStatistics();
          }}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Workout Analytics</Text>
            <FontAwesome5 name="chart-line" size={24} color="#6c5ce7" />
          </View>

          {/* Filters */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Filter Results</Text>

            {/* Date Range Picker */}
            <View style={styles.dateInputContainer}>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartCalendar(true)}>
                <Text style={startDate ? styles.dateText : styles.placeholderText}>
                  {startDate || 'Start Date'}
                </Text>
                <MaterialIcons name="date-range" size={20} color="#6c5ce7" />
              </TouchableOpacity>

              <Text style={styles.dateSeparator}>to</Text>

              <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndCalendar(true)}>
                <Text style={endDate ? styles.dateText : styles.placeholderText}>
                  {endDate || 'End Date'}
                </Text>
                <MaterialIcons name="date-range" size={20} color="#6c5ce7" />
              </TouchableOpacity>
            </View>

            {showStartCalendar && (
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={(day: Day) => handleDateSelect(day.dateString, 'start')}
                  markedDates={{ [startDate]: { selected: true, selectedColor: '#6c5ce7' } }}
                  theme={calendarTheme}
                />
              </View>
            )}

            {showEndCalendar && (
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={(day: Day) => handleDateSelect(day.dateString, 'end')}
                  markedDates={{ [endDate]: { selected: true, selectedColor: '#6c5ce7' } }}
                  theme={calendarTheme}
                />
              </View>
            )}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={exerciseType}
                onValueChange={setExerciseType}
                style={styles.picker}
                dropdownIconColor="#6c5ce7"
              >
                <Picker.Item label="All Exercise Types" value="" />
                <Picker.Item label="Cardio" value="cardio" />
                <Picker.Item label="Strength Training" value="strength" />
                <Picker.Item label="Yoga" value="yoga" />
                <Picker.Item label="HIIT" value="HIIT" />
              </Picker>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, { backgroundColor: '#a29bfe' }]}>
              <Ionicons name="flame" size={28} color="#fff" />
              <Text style={styles.summaryNumber}>{totalCalories.toFixed(0)}</Text>
              <Text style={styles.summaryLabel}>CALORIES BURNED</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: '#74b9ff' }]}>
              <FontAwesome5 name="dumbbell" size={24} color="#fff" />
              <Text style={styles.summaryNumber}>{workoutCount}</Text>
              <Text style={styles.summaryLabel}>WORKOUTS</Text>
            </View>
          </View>

          {/* History */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Workout History</Text>
         {groupedWorkouts.length > 0 ? (
  groupedWorkouts.map((group, index) => (
    <View key={index} style={styles.workoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutDate}>
          {new Date(group.date).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
        <View style={[styles.workoutTypeBadge]}>
          <Text style={styles.workoutTypeText}>
            {group.totalCalories.toFixed(0)} kcal | {group.totalTime} min
          </Text>
        </View>
      </View>
    </View>
  ))
) : (
  <View style={styles.emptyState}>
    <MaterialIcons name="fitness-center" size={48} color="#dfe6e9" />
    <Text style={styles.emptyText}>No workouts recorded</Text>
    <Text style={styles.emptySubtext}>Start training to see your stats</Text>
  </View>
)}

          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#2d3436',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 4,
  },
  dateText: {
    color: '#2d3436',
    fontSize: 16,
  },
  placeholderText: {
    color: '#b2bec3',
    fontSize: 16,
  },
  dateSeparator: {
    marginHorizontal: 8,
    color: '#636e72',
    fontWeight: 'bold',
  },
  calendarContainer: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2d3436',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  workoutCard: {
    backgroundColor: '#f5f6fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },

  workoutStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 6,
    color: '#636e72',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#636e72',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#b2bec3',
    marginTop: 4,
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    margin: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  errorText: {
    fontSize: 16,
    color: '#2d3436',
    marginVertical: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  workoutTypeBadge: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
  backgroundColor: '#6c5ce7', // Color for the badge
  justifyContent: 'center',
  alignItems: 'center',
},

workoutTypeText: {
  color: '#fff',
  fontSize: 14,
  fontWeight: 'bold',
},

});

export default Statistics;
