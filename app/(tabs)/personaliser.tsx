import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../outils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Add this import



// Type definitions for workout data
interface Workout {
  _id: string;
  name: string;
  date: string;
  duration: number;
  caloriesBurned: number;
  exercises: {
    name: string;
    sets?: number;
    reps?: number;
  }[];
}

const WorkoutLogTab = () => {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // New state for userId

  // Fetch workouts from API
  const fetchWorkouts = async (userId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/workouts/user/${userId}`); // Correct the endpoint with dynamic userId
      setWorkouts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workouts');
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile and extract userId
  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Token manquant, veuillez vous reconnecter.');
        return;
      }

      // Fetch profile data to get userId
      const response = await axios.post('/profile', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userProfile = response.data.profile;
      setUserId(userProfile._id);  // Set userId from profile data
    } catch (err) {
      setError('Erreur de chargement du profil');
      console.error('Error loading profile:', err);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

 useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchWorkouts(userId); // Fetch workouts whenever the screen comes into focus
      }
    }, [userId]) // Re-fetch only if userId changes
  );
  const handleCreateWorkout = () => {
    router.push('../WorkoutScreen/Choose');
  };

  const handleWorkoutPress = (workoutId: string) => {
    router.push(`../WorkoutScreen/workoutDetail/${workoutId}`);
  };

  const renderWorkoutCard = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => handleWorkoutPress(item._id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.workoutName}>{item.name}</Text>
        <Text style={styles.workoutDate}>
          {new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </Text>
      </View>

      <View style={styles.workoutStats}>
        <View style={styles.statItem}>
          <Ionicons name="time-outline" size={16} color="#6b7280" />
          <Text style={styles.statText}>{item.duration} min</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="flame-outline" size={16} color="#6b7280" />
          <Text style={styles.statText}>{item.caloriesBurned} cal</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="barbell-outline" size={16} color="#6b7280" />
          <Text style={styles.statText}>{item.exercises.length} exercises</Text>
        </View>
      </View>

      {item.exercises.length > 0 && (
        <View style={styles.exercisesPreview}>
          {item.exercises.slice(0, 3).map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              {exercise.sets && exercise.reps && (
                <Text style={styles.exerciseDetails}>
                  {exercise.sets}x{exercise.reps}
                </Text>
              )}
            </View>
          ))}
          {item.exercises.length > 3 && (
            <Text style={styles.moreExercises}>+{item.exercises.length - 3} more</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            if (userId) fetchWorkouts(userId);
          }}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="barbell-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No workouts recorded yet</Text>
            <Text style={styles.emptySubtext}>Start your fitness journey today</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Workout Log</Text>
            <Text style={styles.subtitle}>Your fitness journey</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateWorkout}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.createButtonText}>New Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  workoutDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
    color: '#6b7280',
    fontSize: 14,
  },
  exercisesPreview: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  exerciseName: {
    color: '#374151',
    fontSize: 15,
  },
  exerciseDetails: {
    color: '#9ca3af',
    fontSize: 14,
  },
  moreExercises: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 6,
  },
  createButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
});

export default WorkoutLogTab;
