import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { exercices } from "../data/exercices"; // adapte le chemin si nécessaire
import { Video, ResizeMode } from 'expo-av'; 

const ExercicesList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExercice, setSelectedExercice] = useState<any>(null); 

  const renderExercice = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedExercice(item); // Mettre à jour l'exercice sélectionné
          setModalVisible(true); // Afficher le modal
        }}
      >
        <Text style={styles.exerciceTitle}>{item.nom}</Text>
        <Text style={styles.exerciceCible}>{item.cible}</Text>
      </TouchableOpacity>
    );
  };

  const closeModal = () => {
    setModalVisible(false); // Fermer le modal
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={exercices}
        renderItem={renderExercice}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />

      {/* Modal pour afficher les détails de l'exercice */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal} // Fermer modal lorsque l'utilisateur appuie sur le bouton retour
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {selectedExercice && (
                <>
                  <Text style={styles.modalTitle}>{selectedExercice.nom}</Text>
                  <Text style={styles.modalText}><Text style={styles.bold}>Cible :</Text> {selectedExercice.cible}</Text>
                  <Text style={styles.modalText}><Text style={styles.bold}>Préparation :</Text> {selectedExercice.preparation}</Text>
                  <Text style={styles.modalText}><Text style={styles.bold}>Exécution :</Text> {selectedExercice.execution}</Text>
                  <Text style={styles.modalText}><Text style={styles.bold}>Conseils :</Text> {selectedExercice.conseils}</Text>

                  {/* Video */}
                  {selectedExercice.video && (
                    <Video
                      source={selectedExercice.video}
                      style={styles.video}
                      useNativeControls
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={false}
                      isLooping
                    />
                  )}
                </>
              )}

              {/* Bouton pour fermer le modal */}
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5,
  },
  exerciceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciceCible: {
    fontSize: 16,
    color: '#666',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond sombre transparent
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20 , // Augmenter le padding pour plus d'espace à l'intérieur
    borderRadius: 10,
    width: '98%', // Augmenter la largeur du modal (ici 90% de la largeur de l'écran)
    maxHeight: '80%', // Hauteur maximale du modal à 80% de la hauteur de l'écran
  },
  modalContent: {
    paddingBottom: 20, // Un peu de padding en bas pour éviter que le contenu touche le bouton
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF6347', // Couleur du bouton de fermeture
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});

export default ExercicesList;
