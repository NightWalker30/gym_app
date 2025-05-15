// app/(tabs)/index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from '../../outils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Home = () => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<any[]>([]);
    const [userId, setUserId] = useState<string | null>(null); // New state for userId
  
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        // Load profile
        const profileRes = await axios.post('/profile', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userProfile = profileRes.data.profile;
        
        setProfile(userProfile);
          const user = profileRes.data.profile;
      setUserId(userProfile._id);

        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        // Weekly stats
        const statsRes = await axios.get('/statistics', {
          params: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsRes.data);

        // Upcoming workouts
        const workoutRes = await axios.get(`/workouts/planned/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUpcomingWorkouts(workoutRes.data.slice(0, 2)); // Only next 2
      } catch (error) {
        console.error('Erreur de chargement:', error);
      }
    };  

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Bienvenue{profile ? `, ${profile.prenom}` : ''} 👋</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Statistiques de la semaine</Text>
        <Text style={styles.stat}>Calories totales brûlées : {stats?.totalCalories ?? '—'} kcal</Text>
        <Text style={styles.stat}>Nombre d'entraînements : {stats?.workoutCount ?? '—'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Prochains entraînements</Text>
        {upcomingWorkouts.length === 0 ? (
          <Text style={styles.stat}>Aucun entraînement prévu</Text>
        ) : (
          upcomingWorkouts.map((workout, index) => (
            <TouchableOpacity
              key={workout._id}
              onPress={() => router.push(`/WorkoutScreen/workoutDetail/${workout._id}`)}
              style={styles.workoutCard}
            >
              <Text style={styles.workoutTitle}>{workout.name}</Text>
              <Text style={styles.workoutTime}>
                {new Date(workout.plannedDate).toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  stat: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  workoutCard: {
    backgroundColor: '#e8f0ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  workoutTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default Home;
