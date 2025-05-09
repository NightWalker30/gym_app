import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const filterOptions = [
  { label: 'By Muscle Group 💪', value: 'primaryMuscles' },
  { label: 'By Equipment 𝄂𝄂—𝄂𝄂', value: 'equipement' },
  { label: 'By Category', value: 'category' },
];

const ExercicesList = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {filterOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.card}
          onPress={() => router.push(`../../exercices/${option.value}`)}
        >
          <Text style={styles.title}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ExercicesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
