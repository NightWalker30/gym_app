import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../outils/axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from "expo-router";
const Profile = () => {
  const router=useRouter()
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const loadEmailAndFetchProfile = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        if (storedEmail) {
          setEmail(storedEmail);
          const response = await axios.post('/profile', { email: storedEmail });
          setProfileData(response.data.profile);
        } else {
          setError('Aucun email trouvé. Veuillez vous reconnecter.');
        }
      } catch (err: any) {
        setError(err.response?.data.message || 'Erreur inconnue');
      }
    };
    loadEmailAndFetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
   //   await axios.post('/logout');
      await AsyncStorage.removeItem("userEmail");
    //  Alert.alert('Déconnexion', 'Vous avez été déconnecté avec succès.');
      router.replace("/auth/login");
    } catch (err) {
      Alert.alert('Erreur', 'Échec de la déconnexion.');
    }
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.avatar} />

      <Text style={styles.name}>{profileData.prenom} {profileData.nom}</Text>
      <Text style={styles.email}>{profileData.email}</Text>

      <View style={styles.card}>
        <Icon name="location-outline" size={22} color="#666" />
        <Text style={styles.cardText}>Ville: {profileData.ville}</Text>
      </View>

      <View style={styles.card}>
        <Icon name="calendar-outline" size={22} color="#666" />
        <Text style={styles.cardText}>Âge: {profileData.age}</Text>
      </View>

      <View style={styles.card}>
        <Icon name="flag-outline" size={22} color="#666" />
        <Text style={styles.cardText}>Pays: {profileData.pay}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingTop: 50,
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '90%',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardText: {
    marginLeft: 10,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: '#e53935',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  text: {
    fontSize: 18,
  },
});

export default Profile;
