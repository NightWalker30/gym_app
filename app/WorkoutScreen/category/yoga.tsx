import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../../outils/axios';

const YogaScreen = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Placeholder for API if needed
    const fetchYogaInfo = async () => {
      try {
        // Example API call
        // const response = await axios.get('/workouts/category/yoga');
        setLoading(false);
      } catch (err) {
        setError('Failed to load yoga info');
        console.error(err);
        setLoading(false);
      }
    };

    fetchYogaInfo();
  }, []);

  const handleStartWorkout = () => {
    // Navigate to workout timer or details page
    router.push('../../WorkoutScreen/start/yoga');
  };

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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yoga Workout</Text>
      <Text style={styles.description}>Choose your session length and enjoy a calming yoga session.</Text>
      
      <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
        <Ionicons name="play" size={24} color="white" />
        <Text style={styles.startButtonText}>Start Yoga Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
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
  },
});

export default YogaScreen;
