import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { exercices } from '../data/exercices';
import { Ionicons } from '@expo/vector-icons'; // Pour l'icône de la flèche retour

const { width, height } = Dimensions.get('window');

const ExerciceDetails = () => {
  const { id } = useLocalSearchParams();
  const exerciceId = parseInt(id as string, 10);
  const exercice = exercices.find(item => item.id === exerciceId);
  const router = useRouter(); // Utilisé pour la navigation

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

      {/* Flèche de retour */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="white"  />
      </TouchableOpacity>

      <Text style={styles.title}>{exercice.nom}</Text>

      {/* Vidéo */}
      <Video
        source={exercice.video}
        style={styles.video}
       
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={true}
        isLooping
      />

      <View style={styles.section}>
        <Text style={styles.infoTitle}>🎯 Zone ciblée</Text>
        <Text style={styles.infoText}>{exercice.cible}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoTitle}>🏋️‍♂️ Équipement</Text>
        <Text style={styles.infoText}>{exercice.equipement}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoTitle}>⚙️ Préparation</Text>
        <Text style={styles.infoText}>{exercice.preparation}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoTitle}>🚀 Exécution</Text>
        <Text style={styles.infoText}>{exercice.execution}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoTitle}>💡 Conseils clés</Text>
        <Text style={styles.infoText}>{exercice.conseils}</Text>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:20,
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
  video: {
    width: width - 40, // Ajuste la largeur pour une meilleure présentation
    height: height * 0.76, // Rendre la vidéo plus grande
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
    zIndex: 1000, // Assure que la flèche est au-dessus du contenu
  },
});

export default ExerciceDetails;
