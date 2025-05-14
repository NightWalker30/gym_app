import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import  axios  from '../../../outils/axios'
type WorkoutStatus = 'template' | 'planned' | 'logged';

interface Workout {
  name: string;
  type: WorkoutStatus;
  plannedDate?: string; // ISO string
  completedDate?: string; // ISO string
  
}


const WorkoutDetails = () => {
  const { id } = useLocalSearchParams(); // Get workout ID from the URL parameters
  const [workout, setWorkout] = useState<any>(null); // Store fetched workout data
  const [loading, setLoading] = useState<boolean>(true); // Handle loading state
  const [error, setError] = useState<string>(''); // Handle error state
  const router = useRouter();

  // Fetch workout data from backend API
  useEffect(() => {
    const fetchWorkoutData = async () => {
     
      try {
        const response = await fetch(`http://10.0.2.2:5000/api/workouts/${id}`); 
        const data = await response.json();
        if (response.ok) {
          setWorkout(data); // Set the fetched data into state
        } else {
          setError('Failed to load workout details');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false); // End loading state after API call finishes
      }
    };

    if (id) {
      fetchWorkoutData(); // Trigger the data fetch when the component mounts or the ID changes
    } else {
      console.log('ID is missing'); // If ID is not present, log this
    }
  }, [id]);

  // If data is loading, show loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // If there's an error, show error message
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // If workout is not found, show a message
  if (!workout) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Workout not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Workout Title */}
      <Text style={styles.title}>{workout.name}</Text>

      {/* Exercises List */}
      <View style={styles.section}>
        <Text style={styles.infoTitle}>🏋️‍♂️ Exercises</Text>
        {workout.exercises && workout.exercises.length > 0 ? (
          workout.exercises.map((exercise: any, idx: number) => (
            <Text key={idx} style={styles.infoText}>{exercise.name}</Text>
          ))
        ) : (
          <Text style={styles.infoText}>No exercises available for this workout</Text>
        )}
      </View>

      {/* Notes Section */}
      <View style={styles.section}>
        <Text style={styles.infoTitle}>💬 Notes</Text>
        <Text style={styles.infoText}>{workout.notes || 'No notes available.'}</Text>
      </View>

      {/* Duration Section */}
      <View style={styles.section}>
        <Text style={styles.infoTitle}>📅 Duration</Text>
        <Text style={styles.infoText}>{workout.duration} minutes</Text>
      </View>

      {/* Status Section */}
<View style={styles.section}>
  <Text style={styles.infoTitle}>📌 Status</Text>

  {workout.status === 'template' && (
    <>
      <Text style={styles.infoText}>This is a workout template.</Text>

      {/* 📅 Plan it */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push(`../plan/${id}`)} // Correct absolute path
      >
        <Text style={styles.actionButtonText}>📅 Plan it</Text>
      </TouchableOpacity>

      {/* 🚀 Do it now */}
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
        onPress={async () => {
          try {
            const response = await axios.post(
              `workouts/start/${workout._id}`
            );
            const startedWorkout = response.data;
          } catch (error) {
            console.error('Failed to start workout:', (error as any).message);
          }
        }}
      >
        <Text style={styles.actionButtonText}>🚀 Do it now</Text>
      </TouchableOpacity>
    </>
  )}

  {workout.status === 'planned' && (
    <>
      <Text style={styles.infoText}>
        Planned for: {new Date(workout.plannedDate).toLocaleString()}
      </Text>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => router.push(`../plan/${id}`)}
      >
        <Text style={styles.actionButtonText}>✏️ Change Planned Time</Text>
      </TouchableOpacity>
    </>
  )}

  {workout.status === 'completed' && (
    <Text style={styles.infoText}>
      ✅ Completed on: {new Date(workout.completedDate).toLocaleString()}
    </Text>
  )}
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#F1F5F9',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#4CAF50',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#38B2AC',
    borderRadius: 50,
    padding: 12,
    elevation: 5,
  },
  actionButton: {
  marginTop: 10,
  backgroundColor: '#3182CE',
  padding: 12,
  borderRadius: 10,
  alignItems: 'center',
},
actionButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

});

export default WorkoutDetails;
