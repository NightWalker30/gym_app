import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { exercices } from '../../data/exercices';
import axios from '../../../outils/axios'; // Use your configured axios instance
import AsyncStorage from '@react-native-async-storage/async-storage';



interface Exercise {
  id: string;
  name: string;
  primaryMuscles: string[];
}

const muscleGroups = [
  'abdominals',
  'hamstrings',
  'adductors',
  'quadriceps',
  'biceps',
  'shoulders',
  'chest',
  'middle back',
  'calves',
  'glutes',
  'lower back',
  'lats',
  'triceps',
  'traps',
  'forearms',
  'neck',
  'abductors',
];

const CreateWorkout = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercises, setFilteredExercises] = useState(exercices);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [exercisesPerPage] = useState(20); // Number of exercises to show per page
  const router = useRouter();

  useEffect(() => {
    let filtered = exercices;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.primaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by selected muscle groups
    if (selectedMuscleGroups.length > 0) {
      filtered = filtered.filter(ex => 
        ex.primaryMuscles.some(m => selectedMuscleGroups.includes(m))
      );
    }

    setFilteredExercises(filtered);
  }, [searchQuery, selectedMuscleGroups]);

  const toggleExerciseSelection = (exercise: Exercise) => {
    setSelectedExercises(prev => 
      prev.some(ex => ex.id === exercise.id)
        ? prev.filter(ex => ex.id !== exercise.id)
        : [...prev, exercise]
    );
  };

  const toggleMuscleGroupSelection = (muscleGroup: string) => {
    setSelectedMuscleGroups(prev => 
      prev.includes(muscleGroup)
        ? prev.filter(m => m !== muscleGroup)
        : [...prev, muscleGroup]
    );
  };

const handleCreateWorkout = async () => {
  if (!workoutName.trim()) {
    alert('Please enter a workout name');
    return;
  }

  if (selectedExercises.length === 0) {
    alert('Please select at least one exercise');
    return;
  }

  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      alert('Token manquant. Veuillez vous reconnecter.');
      return;
    }

    // Fetch user profile to get ID
    const profileResponse = await axios.post('/profile', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userId = profileResponse.data.profile._id;
    if (!userId) {
      alert('ID utilisateur introuvable.');
      return;
    }

    const createResponse = await axios.post(`/workouts/create/${userId}`, {
      name: workoutName,
      exerciseNames: selectedExercises.map(ex => ex.name),
      notes,
      status :"template",
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Workout created:', createResponse.data);
    router.back();
  } catch (error: any) {
    console.error('Erreur de création de séance :', error.message || error);
    alert(error.message || 'Erreur de création');
  }
};


  // Function to load more exercises
  const loadMoreExercises = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  // Paginate exercises
  const displayedExercises = filteredExercises.slice(0, currentPage * exercisesPerPage);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Workout Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Workout name (e.g., Leg Day)"
        value={workoutName}
        onChangeText={setWorkoutName}
      />

      <Text style={styles.sectionTitle}>Filter by Muscle Group</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {muscleGroups.map(muscle => (
          <TouchableOpacity
            key={muscle}
            style={[styles.muscleButton, selectedMuscleGroups.includes(muscle) && styles.selectedMuscle]}
            onPress={() => toggleMuscleGroupSelection(muscle)}
          >
            <Text style={styles.muscleButtonText}>{muscle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Search Exercises</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search exercises..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Text style={styles.sectionTitle}>Select Exercises</Text>
      <FlatList
        data={displayedExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.exerciseItem,
              selectedExercises.some(ex => ex.id === item.id) && styles.selectedExercise
            ]}
            onPress={() => toggleExerciseSelection(item)}
          >
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseMuscles}>{item.primaryMuscles.join(', ')}</Text>
            </View>
            {selectedExercises.some(ex => ex.id === item.id) && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        )}
      />

      {/* Load More Button */}
      {filteredExercises.length > displayedExercises.length && (
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={loadMoreExercises}
        >
          <Text style={styles.loadMoreButtonText}>Load More</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Any additional notes..."
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateWorkout}
      >
        <Text style={styles.createButtonText}>Create Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  muscleButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 25,
  },
  selectedMuscle: {
    backgroundColor: '#4CAF50',
  },
  muscleButtonText: {
    color: '#333',
    fontSize: 14,
  },
  exerciseItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedExercise: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
  },
  exerciseMuscles: {
    fontSize: 14,
    color: '#666',
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadMoreButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  loadMoreButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default CreateWorkout;
