import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { outils } from '../data/outilsSport'; // adapte ce chemin si nécessaire
import { useRouter } from 'expo-router';

const OutilsPage = () => {
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => alert(`Vous avez sélectionné : ${item.nom}`)}
    >
      <Image source={item.video} style={styles.image} resizeMode="contain" />
      <Text style={styles.name}>{item.nom}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Outils de musculation</Text>
      <FlatList
        data={outils}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:20,
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  list: {
    justifyContent: 'center',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textTransform: 'capitalize',
  },
});

export default OutilsPage;
