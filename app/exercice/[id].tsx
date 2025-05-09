import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { exercices, getExerciseImage } from '../data/exercices';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');


const ExerciceDetails = () => {
  const { id } = useLocalSearchParams();
  const exercice = exercices.find(item => item.id === id);
  const router = useRouter();

  if (!exercice) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Exercice non trouvé</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>{exercice.name}</Text>

      {exercice.images.map((img, idx) => (
        <Image
          key={idx}
          source={{ uri: getExerciseImage(img) }}
          style={styles.image}
          resizeMode="contain"
        />
      ))}

      <View style={styles.section}>
        <Text style={styles.infoTitle}>🎯 Zones ciblées</Text>
        <Text style={styles.infoText}>{exercice.primaryMuscles.join(', ')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoTitle}>💪 Secondaires</Text>
        <Text style={styles.infoText}>
          {exercice.secondaryMuscles.length > 0 ? exercice.secondaryMuscles.join(', ') : 'Aucune'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoTitle}>🏋️‍♂️ Équipement</Text>
        <Text style={styles.infoText}>{exercice.equipment}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoTitle}>📋 Instructions</Text>
        {exercice.instructions.map((step, idx) => (
          <Text key={idx} style={styles.infoText}>• {step}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#F9FAFB',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: width - 40,
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    alignSelf: 'center',
    backgroundColor: '#000',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
    zIndex: 1000,
  },
});

export default ExerciceDetails;
