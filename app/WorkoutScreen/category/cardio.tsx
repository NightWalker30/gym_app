import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../../outils/axios';

const durations = [10, 20, 30, 45, 60];

const CardioScreen = () => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Token manquant, veuillez vous reconnecter.');
        return;
      }

      const response = await axios.post(
        '/profile',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userProfile = response.data.profile;
      setUserId(userProfile._id);
    } catch (err) {
      setError('Erreur de chargement du profil');
      console.error('Error loading profile:', err);
    }
  };

  const handleCreateCardioWorkout = async () => {
    if (!selectedDuration) {
      Alert.alert('Veuillez sélectionner une durée');
      return;
    }

    if (!userId) {
      Alert.alert('Utilisateur non identifié');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`/workouts/create/${userId}`, {
        name: `Cardio ${selectedDuration} min`,
        type: 'cardio',
        notes: ` cardio workout for ${selectedDuration} minutes`,
        exerciseNames: [], 
        duration: selectedDuration ,
      });

      setLoading(false);
      Alert.alert('Cardio enregistré en tant que template !');
      router.push(`/WorkoutScreen/workoutDetail/${response.data._id}`);
    } catch (err) {
      console.error('Workout creation failed:', err);
      setLoading(false);
      Alert.alert("Échec de la création de l'entraînement cardio");
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cardio Workout</Text>
      <Text style={styles.description}>Choisissez la durée de votre séance</Text>

      <View style={styles.durationContainer}>
        {durations.map((duration) => (
          <TouchableOpacity
            key={duration}
            style={[
              styles.durationButton,
              selectedDuration === duration && styles.selectedDuration,
            ]}
            onPress={() => setSelectedDuration(duration)}
          >
            <Text style={styles.durationText}>{duration} min</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleCreateCardioWorkout} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="bicycle" size={24} color="white" />
            <Text style={styles.startButtonText}>Créer le Template</Text>
          </>
        )}
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
    marginBottom: 20,
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  durationButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    margin: 5,
  },
  selectedDuration: {
    backgroundColor: '#4f46e5',
  },
  durationText: {
    color: '#111827',
    fontWeight: '500',
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
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CardioScreen;
