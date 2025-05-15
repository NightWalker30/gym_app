// app/profile/edit.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from '../../outils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const EditProfile = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.post('/profile', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.profile);
    };
    fetchProfile();
  }, []);

  const handleChange = (key: string, value: any) => {
    setUser((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put('/update', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Succès", "Profil mis à jour !");
      router.back();
    } catch (err) {
      Alert.alert("Erreur", "Échec de la mise à jour.");
    }
  };

  if (!user) return <Text style={{ padding: 20 }}>Chargement...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Modifier le profil</Text>

      <TextInput style={styles.input} placeholder="Prénom" value={user.prenom} onChangeText={(v) => handleChange('prenom', v)} />
      <TextInput style={styles.input} placeholder="Nom" value={user.nom} onChangeText={(v) => handleChange('nom', v)} />
      <TextInput style={styles.input} placeholder="Ville" value={user.ville} onChangeText={(v) => handleChange('ville', v)} />
      <TextInput style={styles.input} placeholder="Pays" value={user.pay} onChangeText={(v) => handleChange('pay', v)} />
      <TextInput style={styles.input} placeholder="Email" value={user.email} onChangeText={(v) => handleChange('email', v)} keyboardType="email-address" />

      <TextInput style={styles.input} placeholder="Sexe (homme/femme)" value={user.sexe || ''} onChangeText={(v) => handleChange('sexe', v)} />
      <TextInput style={styles.input} placeholder="Poids (kg)" value={user.poids?.toString() || ''} onChangeText={(v) => handleChange('poids', Number(v))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Taille (cm)" value={user.taille?.toString() || ''} onChangeText={(v) => handleChange('taille', Number(v))} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Niveau activité (faible/modere/eleve)" value={user.niveau_activite || ''} onChangeText={(v) => handleChange('niveau_activite', v)} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sauvegarder</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#6a11cb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditProfile;
