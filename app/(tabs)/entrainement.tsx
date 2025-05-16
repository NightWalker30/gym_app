import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from '../../outils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const Home = () => {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [upcomingWorkouts, setUpcomingWorkouts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
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
        setUserId(userProfile._id);

        // Weekly stats
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const statsRes = await axios.get('/statistics', {
          params: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsRes.data);

        // Upcoming workouts
        const workoutRes = await axios.get(`/workouts/planned/${userProfile._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUpcomingWorkouts(workoutRes.data.slice(0, 2));

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };  

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../../assets/images/loading.gif')} 
          style={styles.loadingGif}
        />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Bonjour{profile ? `, ${profile.prenom}` : ''} 👋</Text>
          <Text style={styles.subtitle}>Suivez votre progression</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/moi')}
        >
          <Image 
            source={{ uri: profile?.photo || 'https://i.pravatar.cc/150?img=3' }} 
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Stats */}
        <Animated.View 
          style={styles.quickStatsContainer}
          entering={FadeInDown.duration(500)}
        >
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ff7675' }]}>
              <FontAwesome5 name="fire" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>{stats?.totalCalories ?? '0'}</Text>
            <Text style={styles.statLabel}>Calories brûlées</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#74b9ff' }]}>
              <MaterialIcons name="fitness-center" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>{stats?.workoutCount ?? '0'}</Text>
            <Text style={styles.statLabel}>Séances</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#55efc4' }]}>
              <FontAwesome5 name="clock" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>{stats?.totalMinutes ? Math.round(stats.totalMinutes/60) : '0'}</Text>
            <Text style={styles.statLabel}>Heures</Text>
          </View>
        </Animated.View>

        {/* Weekly Progress */}
        <Animated.View 
          style={styles.card}
          entering={FadeInDown.duration(500).delay(100)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Votre progression</Text>
            <TouchableOpacity onPress={() => router.push('/statistique')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progressText}>75% de votre objectif hebdomadaire</Text>
          </View>
        </Animated.View>

        {/* Upcoming Workouts */}
        <Animated.View 
          style={styles.card}
          entering={FadeInDown.duration(500).delay(200)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Prochains entraînements</Text>
            <TouchableOpacity onPress={() => router.push('/personaliser')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingWorkouts.length === 0 ? (
            <View style={styles.emptyWorkouts}>
              <MaterialIcons name="fitness-center" size={40} color="#ddd" />
              <Text style={styles.emptyText}>Aucun entraînement prévu</Text>
              <TouchableOpacity 
                style={styles.addWorkoutButton}
                onPress={() => router.push('/WorkoutScreen/Choose')}
              >
                <Text style={styles.addWorkoutText}>Planifier un entraînement</Text>
              </TouchableOpacity>
            </View>
          ) : (
            upcomingWorkouts.map((workout, index) => (
              <Animated.View
                key={workout._id}
                entering={FadeInRight.duration(500).delay(300 + index * 100)}
              >
                <TouchableOpacity
                  onPress={() => router.push(`/WorkoutScreen/workoutDetail/${workout._id}`)}
                  style={styles.workoutCard}
                >
                  <View style={styles.workoutInfo}>
                    <Text style={styles.workoutTitle}>{workout.name}</Text>
                    <Text style={styles.workoutTime}>
                      {new Date(workout.plannedDate).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#6a11cb" />
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={styles.quickActions}
          entering={FadeInDown.duration(500).delay(400)}
        >
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/WorkoutScreen/Choose')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#6a11cb' }]}>
              <MaterialIcons name="add" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Nouvel entraînement</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => router.push('/')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#2575fc' }]}>
              <MaterialIcons name="restaurant" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>Nutrition</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fe',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fe',
  },
  loadingGif: {
    width: 100,
    height: 100,
  },
  headerContainer: {
    padding: 25,
    paddingTop: 50,
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
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  content: {
    padding: 20,
    paddingTop: 15,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#6a11cb',
    fontWeight: '600',
  },
  progressBarContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6a11cb',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
  workoutCard: {
    backgroundColor: '#f8f9fe',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  workoutTime: {
    fontSize: 14,
    color: '#666',
  },
  emptyWorkouts: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    marginBottom: 20,
  },
  addWorkoutButton: {
    backgroundColor: '#6a11cb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addWorkoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAction: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});

export default Home;