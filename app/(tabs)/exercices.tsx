import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { exercices } from "../data/exercices"; // adapte le chemin si nécessaire
import { useRouter } from 'expo-router';

const ExercicesList = () => {
  const router = useRouter();

  const renderExercice = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          router.push(`/exercice/${item.id}`);
        }}
      >
        <Text style={styles.exerciceTitle}>{item.name}</Text>
        <Text style={styles.exerciceCible}>{item.primaryMuscles}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={exercices}
        renderItem={renderExercice}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
      />
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
});

export default ExercicesList;
