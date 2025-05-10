import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ChooseCategoryScreen = () => {
  const router = useRouter();

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    router.push(`./category/${category}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Workout Category</Text>
      
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => handleCategorySelect('cardio')}
      >
        <Ionicons name="pulse" size={24} color="white" />
        <Text style={styles.buttonText}>Cardio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => handleCategorySelect('yoga')}
      >
        <Ionicons name="body" size={24} color="white" />
        <Text style={styles.buttonText}>Yoga</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => handleCategorySelect('strength')}
      >
        <Ionicons name="barbell" size={24} color="white" />
        <Text style={styles.buttonText}>Strength</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 40,
  },
  categoryButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default ChooseCategoryScreen;
