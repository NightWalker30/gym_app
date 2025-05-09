import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { exercices } from '../../data/exercices';
import { useRouter } from 'expo-router';

const EquipmentIndex = () => {
  const router = useRouter();

  const equipments = Array.from(new Set(exercices.map(e => e.equipment)));

  return (
    <View style={styles.container}>
      <FlatList
        data={equipments}
        keyExtractor={(item) => item || 'default-id' }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/exercices/equipement/${item}`)}
          >
            <Text style={styles.text}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 15, borderRadius: 10, elevation: 3 },
  text: { fontSize: 18, fontWeight: '500' },
});

export default EquipmentIndex;
