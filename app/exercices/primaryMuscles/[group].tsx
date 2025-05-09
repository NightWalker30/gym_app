import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { exercices } from '../../data/exercices';

const MuscleGroupExercises = () => {
  const { group } = useLocalSearchParams();
  const router = useRouter();

  const filtered = exercices.filter(e => e.primaryMuscles.includes(group as string));

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/exercice/${item.id}`)}
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.primaryMuscles.join(', ')}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10, elevation: 3 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666' },
});

export default MuscleGroupExercises;
