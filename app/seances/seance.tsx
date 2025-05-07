import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'
import axios from '../../outils/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Muscultation = () => {
  const [nomSeance, setNomSeance] = useState('')
  const [typeSeance, setTypeSeance] = useState('musculation')
  const [duree, setDuree] = useState('')
  const router = useRouter()

  const handleSuivant = async () => {
    if (!nomSeance || !duree) {
      Alert.alert('Champs manquants', 'Veuillez remplir le nom et la durée.')
      return
    }

    try {
      // const response = await axios.post("/login", { email, password });
      const response = await axios.post("/setSeance", {
        nom: nomSeance,
        type: typeSeance,
        duree: duree,
      })

      const seanceId = response.data._id
      await AsyncStorage.setItem('currentSeanceId', seanceId)

    
        router.push({ pathname: '/(tabs)/personaliser' })

    } catch (error) {
      console.error(error)
      Alert.alert('Erreur', "Impossible d'enregistrer la séance.")
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom de la séance :</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : Séance du lundi"
        value={nomSeance}
        onChangeText={setNomSeance}
      />

      <Text style={styles.label}>Type de séance :</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={typeSeance}
          onValueChange={(itemValue) => setTypeSeance(itemValue)}
        >
          <Picker.Item label="Musculation" value="musculation" />
          <Picker.Item label="Course" value="course" />
        </Picker>
      </View>

      <Text style={styles.label}>Durée (en minutes) :</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex : 45"
        value={duree}
        onChangeText={setDuree}
        keyboardType="numeric"
      />

      <View style={styles.buttonContainer}>
        <Button title="Ajouter seance" onPress={handleSuivant} />
      </View>
    </View>
  )
}

export default Muscultation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  buttonContainer: {
    marginTop: 10,
  },
})
