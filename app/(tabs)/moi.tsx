import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../outils/axios';
import { useRouter } from 'expo-router';

const calculerAge = (dateNaissance: string): number => {
  const naissance = new Date(dateNaissance);
  const today = new Date();
  let age = today.getFullYear() - naissance.getFullYear();
  const m = today.getMonth() - naissance.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < naissance.getDate())) {
    age--;
  }

  return age;
};

const Moi = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          setError('Token manquant, veuillez vous reconnecter.');
          return;
        }

        const response = await axios.post('/profile', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfileData(response.data.profile);
      } catch (err: any) {
        setError('Erreur de chargement du profil');
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Chargement...</Text>
      </SafeAreaView>
    );
  }

  const age = calculerAge(profileData.date_naissance);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />
        <Text style={styles.name}>{profileData.prenom} {profileData.nom}</Text>
        <Text style={styles.email}>{profileData.email}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Ville :</Text>
          <Text style={styles.value}>{profileData.ville}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Pays :</Text>
          <Text style={styles.value}>{profileData.pay}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Date de naissance :</Text>
          <Text style={styles.value}>{new Date(profileData.date_naissance).toLocaleDateString()}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Âge :</Text>
          <Text style={styles.value}>{age} ans</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoBox: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#999',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Moi;
