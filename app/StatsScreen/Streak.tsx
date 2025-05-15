import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../outils/axios';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';

const StreakScreen = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [streak, setStreak] = useState(0);
  const [consistency, setConsistency] = useState(0);
  const [daysCompleted, setDaysCompleted] = useState(0);
  const [daysTotal, setDaysTotal] = useState(0);

  useEffect(() => {
    const fetchStreaks = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      try {
        const res = await axios.get('/statistics/streaks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const workoutDates = res.data.dates; // e.g., ['2025-05-10', '2025-05-11', ...]
        const today = dayjs().format('YYYY-MM-DD');
        const sorted = workoutDates.sort();

        const marks: Record<string, any> = {};
        workoutDates.forEach((date: string)  => {
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
        });

        setMarkedDates(marks);

        // Streak calculation
        let currentStreak = 0;
        let date = dayjs();
        while (marks[date.format('YYYY-MM-DD')]) {
          currentStreak++;
          date = date.subtract(1, 'day');
        }

        setStreak(currentStreak);
        setDaysCompleted(workoutDates.length);
        const totalDays = dayjs().date(); // e.g., day of the month = total days so far
        setDaysTotal(totalDays);
        setConsistency(Math.round((workoutDates.length / totalDays) * 100));

      } catch (err) {
        console.error('Erreur streaks:', err);
      }
    };

    fetchStreaks();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🎯 Suivi de régularité</Text>

      <Text style={styles.streakText}>🔥 Série actuelle : <Text style={styles.highlight}>{streak}</Text> jours</Text>
      <Text style={styles.consistencyText}>🧠 Régularité : <Text style={styles.highlight}>{daysCompleted}</Text> sur <Text style={styles.highlight}>{daysTotal}</Text> jours – <Text style={styles.highlight}>{consistency}%</Text></Text>

      <Text style={styles.calendarTitle}>📅 Vos jours d'entraînement</Text>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        theme={{
          calendarBackground: '#fff',
          todayTextColor: '#e91e63',
          arrowColor: '#333',
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
  },
  streakText: {
    fontSize: 18,
    marginBottom: 8,
  },
  consistencyText: {
    fontSize: 16,
    marginBottom: 16,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
});

export default StreakScreen;
