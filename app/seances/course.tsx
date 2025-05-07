import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';  // Correction de l'import
import React, { useState } from 'react';

const Course = () => {
  const [exercice, setExercice] = useState({
    nom: '',
    duree: '',
    rythme: '', // Ajout du champ rythme
    description: '',
  });

  const [selectedRythme, setSelectedRythme] = useState(''); // Etat pour le rythme sélectionné

  const handleInputChange = (name: string, value: string) => {
    setExercice((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Validation des champs obligatoires
    if (!exercice.nom || !selectedRythme) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (nom et rythme).');
      return;
    }

    // Logique d'envoi à l'API ou stockage des données
    console.log('Données soumises:', { ...exercice, rythme: selectedRythme });
    // Vous pouvez ici envoyer les données au backend ou les enregistrer dans une base de données.
    Alert.alert('Succès', 'Exercice de course ajouté avec succès!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un exercice de Course</Text>

      <Text style={styles.label}>Nom de l'exercice *</Text>
      <TextInput
        style={styles.input}
        value={exercice.nom}
        onChangeText={(text) => handleInputChange('nom', text)}
        placeholder="Ex: Course à pied"
      />

      <Text style={styles.label}>Durée (en minutes) (facultatif)</Text>
      <TextInput
        style={styles.input}
        value={exercice.duree}
        onChangeText={(text) => handleInputChange('duree', text)}
        keyboardType="numeric"
        placeholder="Ex: 30"
      />

      <Text style={styles.label}>Rythme *</Text>
      <Picker
        selectedValue={selectedRythme}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedRythme(itemValue)}>
        <Picker.Item label="Sélectionner le rythme" value="" />
        <Picker.Item label="Modéré" value="modere" />
        <Picker.Item label="Rapide" value="rapide" />
        <Picker.Item label="Lent" value="lent" />
        <Picker.Item label="Très rapide" value="tres_rapide" />
      </Picker>

      <Text style={styles.label}>Description (facultatif)</Text>
      <TextInput
        style={styles.input}
        value={exercice.description}
        onChangeText={(text) => handleInputChange('description', text)}
        placeholder="Description (facultatif)"
        multiline
      />

      <Button title="Ajouter l'exercice" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
  },
});

export default Course;
