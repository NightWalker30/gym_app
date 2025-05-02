import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Video, ResizeMode } from 'expo-av'; // <-- Utilise expo-av
import { exercices } from "../data/exercices"; // adapte le chemin si besoin

const { width } = Dimensions.get('window');


const ExerciceDetails = () => {
  const { id } = useLocalSearchParams();
  const exerciceId = parseInt(id as string, 10);
  const exercice = exercices.find(item => item.id === exerciceId);

  if (!exercice) {
    return <Text>Exercice non trouvé</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{exercice.nom}</Text>

      <Video
        source={exercice.video}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isLooping
      />

      <Text style={styles.infoTitle}>Cible :</Text>
      <Text style={styles.infoText}>{exercice.cible}</Text>

      <Text style={styles.infoTitle}>Équipement :</Text>
      <Text style={styles.infoText}>{exercice.equipement}</Text>

      <Text style={styles.infoTitle}>Préparation :</Text>
      <Text style={styles.infoText}>{exercice.preparation}</Text>

      <Text style={styles.infoTitle}>Exécution :</Text>
      <Text style={styles.infoText}>{exercice.execution}</Text>

      <Text style={styles.infoTitle}>Conseils clés :</Text>
      <Text style={styles.infoText}>{exercice.conseils}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  video: {
    width: width - 40,
    height: 530,
    borderRadius: 10,
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ExerciceDetails;
