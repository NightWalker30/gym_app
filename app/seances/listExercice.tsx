import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { exercices } from '../data/exercices';
import { useRouter, useLocalSearchParams, } from 'expo-router';

const SelectionExercice = () => {
  const { id } = useLocalSearchParams(); // id = id de la séance
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const router = useRouter();

  const toggleSelection = useCallback((id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const validerSelection = async () => {
    if (selectedId === null) {
      Alert.alert('Erreur', 'Veuillez sélectionner un exercice.');
      return;
    }

    try {
      router.push({
        pathname: '/seances/musculation',
        params: {
          exerciceId: selectedId.toString(),
          id: id?.toString(), // id de la séance
        },
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de rediriger vers le formulaire.');
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.item, selectedId === item.id && styles.itemSelected]}>
      <TouchableOpacity
        style={styles.infoContainer}
        onPress={() => router.push(`/exercice/${item.id}`)}
      >
        <Text style={styles.itemText}>{item.nom}</Text>
        <Text style={styles.zoneText}>Zone : {item.cible}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleSelection(item.id)}>
        <Text style={styles.checkbox}>
          {selectedId === item.id ? '✅' : '⬜'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sélectionner un exercice</Text>
      <FlatList
        data={exercices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.button} onPress={validerSelection}>
        <Text style={styles.buttonText}>Valider la sélection</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SelectionExercice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F2937',
  },
  list: {
    paddingBottom: 20,
  },
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  itemSelected: {
    backgroundColor: '#E0F7FA',
  },
  infoContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  zoneText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  checkbox: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 30,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
