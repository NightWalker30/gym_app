import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../outils/axios';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

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
        console.log(err);
        setError('Erreur de chargement du profil');
        console.error(err);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    router.replace("/auth/login");
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
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.loadingContainer}
        >
          <Text style={styles.loadingText}>Chargement du profil...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const age = calculerAge(profileData.date_naissance);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="white" />
        </TouchableOpacity>
        
        <Image 
          source={{ uri: profileData.photo || 'https://i.pravatar.cc/150?img=12' }} 
          style={styles.avatar} 
        />
        <Text style={styles.name}>{profileData.prenom} {profileData.nom}</Text>
        <Text style={styles.email}>{profileData.email}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#6a11cb" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Localisation</Text>
              <Text style={styles.value}>{profileData.ville}, {profileData.pay}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <MaterialIcons name="cake" size={20} color="#6a11cb" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Date de naissance</Text>
              <Text style={styles.value}>{new Date(profileData.date_naissance).toLocaleDateString()} ({age} ans)</Text>
            </View>
          </View>
        </View>

        {profileData.poids || profileData.taille || profileData.sexe ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations Physiques</Text>
            
            {profileData.poids && (
              <View style={styles.infoRow}>
                <MaterialIcons name="fitness-center" size={20} color="#6a11cb" />
                <View style={styles.infoText}>
                  <Text style={styles.label}>Poids</Text>
                  <Text style={styles.value}>{profileData.poids} kg</Text>
                </View>
              </View>
            )}

            {profileData.taille && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <MaterialIcons name="straighten" size={20} color="#6a11cb" />
                  <View style={styles.infoText}>
                    <Text style={styles.label}>Taille</Text>
                    <Text style={styles.value}>{profileData.taille} cm</Text>
                  </View>
                </View>
              </>
            )}

            {profileData.sexe && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <MaterialIcons name="person" size={20} color="#6a11cb" />
                  <View style={styles.infoText}>
                    <Text style={styles.label}>Sexe</Text>
                    <Text style={styles.value}>{profileData.sexe}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        ) : null}

        {profileData.objectif && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Objectif</Text>
            <View style={styles.infoRow}>
              <MaterialIcons name="flag" size={20} color="#6a11cb" />
              <View style={styles.infoText}>
                <Text style={styles.value}>{profileData.objectif}</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('../ProfileScreen/updateUser')}
        >
          <Text style={styles.editButtonText}>Modifier le profil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
 paddingTop: 70 ,
     alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
 logoutButton: {
  position: 'absolute',
  top: 50, // was 15
  right: 15,
  padding: 10,
  zIndex: 10,
},

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  infoText: {
    marginLeft: 15,
  },
  label: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  editButton: {
    backgroundColor: '#6a11cb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
});

export default Moi;