import { StyleSheet, Text, View, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from '../../outils/axios';
import { useRouter } from 'expo-router';

// Définition du type d'une séance
interface Seance {
  _id: string;
  nom: string;
  type: string;
  duree: number;
}

const SeancesPage = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Récupération des séances depuis le backend
  const fetchSeances = async () => {
    try {
      const response = await axios.get('/getSeances');
      setSeances(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des séances :', error);
      Alert.alert('Erreur', "Impossible de récupérer les séances.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeances();
  }, []);

  const handleAddSeance = () => {
    router.push('/seances/seance');
  };

  const handleAddExercice = (seanceId: string, type: string) => {
    console.log('ID de la séance sélectionnée :', seanceId); // <-- ici
    const lowerType = type.toLowerCase();
    if (lowerType === 'musculation') {
      router.push({
        pathname: '/seances/musculation', 
        params: { id: seanceId },
      });
    } else if (lowerType === 'course') {
   //   router.push(`/seances/${seanceId}/ajouter-course`);
   router.push({
    pathname: '/seances/course', 
    params: { id: seanceId },
  });
    } else {
      Alert.alert('Type inconnu', `Type de séance non reconnu : ${type}`);
    }
  };

  const handleModifier = (seanceId: string) => {
   // router.push(`/seances/${seanceId}/modifier`);
  };

  const handleSupprimer = async (seanceId: string) => {
    try {
      await axios.delete(`/deleteSeance/${seanceId}`);
      setSeances((prev) => prev.filter(s => s._id !== seanceId));
      Alert.alert('Succès', 'Séance supprimée avec succès.');
    } catch (error) {
      console.error('Erreur de suppression :', error);
      Alert.alert('Erreur', 'Impossible de supprimer la séance.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Séances</Text>

      {loading ? (
        <Text style={styles.loadingText}>Chargement des séances...</Text>
      ) : (
        <FlatList
          data={seances}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
          //  console.log(item._id); // <-- Ajoute ce log
            <View style={styles.seanceContainer}>
              <Text style={styles.seanceText}>📝 Nom : {item.nom}</Text>
              <Text style={styles.seanceText}>🏋️‍♀️ Type : {item.type}</Text>
              <Text style={styles.seanceText}>⏱ Durée : {item.duree} min</Text>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleAddExercice(item._id, item.type)}
                  
                >
                
                  <Text style={styles.buttonText}>Ajouter Exercice</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.modifyButton]}
                  onPress={() => handleModifier(item._id)}
                >
                  <Text style={styles.buttonText}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleSupprimer(item._id)}
                >
                  <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button title="➕ Ajouter une Séance" onPress={handleAddSeance} />
      </View>
    </View>
  );
};

export default SeancesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  seanceContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  seanceText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  modifyButton: {
    backgroundColor: '#f39c12',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
