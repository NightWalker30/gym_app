import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../outils/axios';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Progress from 'react-native-progress';

const { width } = Dimensions.get('window');

const StreakScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [streak, setStreak] = useState(0);
  const [consistency, setConsistency] = useState(0);
  const [daysCompleted, setDaysCompleted] = useState(0);
  const [daysTotal, setDaysTotal] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [monthWorkouts, setMonthWorkouts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreaks = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      try {
        const res = await axios.get('/statistics/streaks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const workoutDates = res.data.dates;
        const today = dayjs().format('YYYY-MM-DD');
        const sorted = workoutDates.sort();

        // Calculate streaks
        let currentStreak = 0;
        let maxStreak = 0;
        let tempStreak = 0;
        let prevDate: dayjs.Dayjs | null = null;

        const marks: Record<string, any> = {};
        workoutDates.forEach((date: string) => {
          // Mark calendar dates
          marks[date] = {
            marked: true,
            dotColor: '#4CAF50',
            customStyles: {
              container: {
                backgroundColor: '#81C784',
                borderRadius: 4,
              },
              text: {
                color: 'white',
                fontWeight: 'bold',
              },
            },
          };

          // Calculate streaks
          const currentDate = dayjs(date);
          if (prevDate && currentDate.diff(prevDate, 'day') === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
          maxStreak = Math.max(maxStreak, tempStreak);
          prevDate = currentDate;
        });

        // Current streak
        let date = dayjs();
        while (marks[date.format('YYYY-MM-DD')]) {
          currentStreak++;
          date = date.subtract(1, 'day');
        }

        setMarkedDates(marks);
        setStreak(currentStreak);
        setLongestStreak(maxStreak);
        
        const currentMonthWorkouts = workoutDates.filter((d : string ) => 
          dayjs(d).isSame(dayjs(), 'month')
        ).length;
        setMonthWorkouts(currentMonthWorkouts);
        
        setDaysCompleted(workoutDates.length);
        const totalDays = dayjs().date();
        setDaysTotal(totalDays);
        setConsistency(Math.round((workoutDates.length / totalDays) * 100));
        
      } catch (err) {
        console.error('Error fetching streaks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreaks();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Progress.CircleSnail color={['#6a11cb', '#2575fc']} size={60} />
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn.duration(600)}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.headerContainer}
        >
          <Text style={styles.header}>Suivi de régularité</Text>
          <MaterialIcons name="whatshot" size={28} color="white" />
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.statsContainer}>
        {/* Current Streak */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Série actuelle</Text>
            <View style={[styles.streakIcon, { backgroundColor: streak > 0 ? '#ff7675' : '#ddd' }]}>
              <MaterialIcons name="whatshot" size={20} color="white" />
            </View>
          </View>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>jours consécutifs</Text>
        </View>

        {/* Longest Streak */}
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Record</Text>
            <View style={[styles.streakIcon, { backgroundColor: '#74b9ff' }]}>
              <MaterialIcons name="stars" size={20} color="white" />
            </View>
          </View>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>jours</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Régularité ce mois</Text>
          <Text style={styles.progressPercent}>{consistency}%</Text>
        </View>
        <Progress.Bar 
          progress={consistency / 100} 
          width={width - 60} 
          height={12}
          color="#6a11cb"
          unfilledColor="#f3f3f3"
          borderWidth={0}
          borderRadius={6}
          animated={true}
        />
        <View style={styles.progressDetails}>
          <Text style={styles.progressText}>{daysCompleted} jours sur {daysTotal}</Text>
          <Text style={styles.progressText}>{monthWorkouts} séances ce mois</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.calendarContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Historique des entraînements</Text>
          <MaterialIcons name="calendar-today" size={20} color="#6a11cb" />
        </View>
        <Calendar
          markingType={'custom'}
          markedDates={markedDates}
          theme={{
            calendarBackground: '#fff',
            todayTextColor: '#e91e63',
            arrowColor: '#333',
            monthTextColor: '#333',
            textMonthFontWeight: '600',
            textDayFontWeight: '400',
            textDayHeaderFontWeight: '600',
            selectedDayBackgroundColor: '#6a11cb',
            selectedDayTextColor: '#fff',
            dayTextColor: '#333',
            textDisabledColor: '#ddd',
          }}
          style={styles.calendar}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.tipsContainer}>
        <View style={styles.tipsHeader}>
          <MaterialIcons name="lightbulb" size={20} color="#f39c12" />
          <Text style={styles.tipsTitle}>Conseils pour garder la série</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Planifiez vos séances à l'avance</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Même une séance courte compte</Text>
        </View>
        <View style={styles.tipItem}>
          <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
          <Text style={styles.tipText}>Trouvez un partenaire d'entraînement</Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fe',
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fe',
  },
  headerContainer: {
    padding: 25,
    paddingTop: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  streakIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  progressContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6a11cb',
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  calendar: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  tipsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 8,
  },
});

export default StreakScreen;