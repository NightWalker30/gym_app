import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { exercices } from '../data/exercices';
import axios from '../../outils/axios';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';

const AjouterExerciceMusculation = () => {
  const { id } = useLocalSearchParams(); // id = id de la séance
  const { exerciceId } = useLocalSearchParams(); // exerciceId = id de l'exercice sélectionné

  const [exercice, setExercice] = useState({
    nom: '',
    series: '',
    repetitions: '',
    charge: '',
    description: ''
  });

  const [seanceId, setSeanceId] = useState(id); // État pour stocker l'ID de la séance

  useEffect(() => {
    if (exerciceId) {
      const selectedExercice = exercices.find((ex) => ex.id === Number(exerciceId));
      if (selectedExercice) {
        setExercice((prev) => ({
          ...prev,
          nom: selectedExercice.nom
        }));
      }
    }
  }, [exerciceId]);

  const handleInputChange = (name: string, value: string) => {
    setExercice((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSoumettre = async () => {
    if (!exercice.nom || !exercice.series || !exercice.repetitions) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires.');
      return;
    }
    
    try {
      console.log(`Le id généré à la base de données est ${seanceId}`);
      const response = await axios.post(`/seances/${seanceId}/ajouterExercice`, {
        nom: exercice.nom,
        series: Number(exercice.series),
        repetitions: Number(exercice.repetitions),
        charge: exercice.charge ? Number(exercice.charge) : null,
        description: exercice.description || null
      });
       console.log( `le nom est ${exercice.nom}`)
       console.log( `le serie est ${exercice.series}`)
      if (response.data.success) {
        Alert.alert('Succès', 'Exercice ajouté avec succès!');
        // Vous pouvez décommenter cette ligne pour naviguer vers la page de musculation après l'ajout.
        // router.push(`/seances/${seanceId}/musculation`);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ajouter l\'exercice.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'exercice:', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajouter un exercice de Musculation</Text>

      <Text>Exercice</Text>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => router.push(`/seances/listExercice?id=${seanceId}`)} // Redirige vers la page pour sélectionner un exercice
      >
        <Text style={styles.selectButtonText}>
          {exercice.nom || 'Choisir un exercice'}
        </Text>
      </TouchableOpacity>

      <Text>Séries</Text>
      <TextInput
        style={styles.input}
        value={exercice.series}
        onChangeText={(text) => handleInputChange('series', text)}
        keyboardType="numeric"
        placeholder="Ex: 4"
      />

      <Text>Répétitions</Text>
      <TextInput
        style={styles.input}
        value={exercice.repetitions}
        onChangeText={(text) => handleInputChange('repetitions', text)}
        keyboardType="numeric"
        placeholder="Ex: 10"
      />

      <Text>Charge (kg) (optionnelle)</Text>
      <TextInput
        style={styles.input}
        value={exercice.charge}
        onChangeText={(text) => handleInputChange('charge', text)}
        keyboardType="numeric"
        placeholder="Ex: 20"
      />

      <Text>Description</Text>
      <TextInput
        style={styles.input}
        value={exercice.description}
        onChangeText={(text) => handleInputChange('description', text)}
        placeholder="Description (optionnelle)"
        multiline
      />

      <Button title="Terminer" onPress={handleSoumettre} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5
  },
  selectButton: {
    backgroundColor: '#e2e8f0',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15
  },
  selectButtonText: {
    color: '#1e293b',
    fontWeight: '500'
  }
});

export default AjouterExerciceMusculation;
