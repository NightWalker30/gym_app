import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const filterOptions = [
  { 
    label: 'By Muscle Group', 
    value: 'primaryMuscles',
    icon: 'arm-flex',
    colors: ['#FF416C', '#FF4B2B'],
    emoji: '💪'
  },
  { 
    label: 'By Equipment', 
    value: 'equipement',
    icon: 'dumbbell',
    colors: ['#4776E6', '#8E54E9'],
    emoji: '🏋️'
  },
  { 
    label: 'By Category', 
    value: 'category',
    icon: 'format-list-group',
    colors: ['#00B4DB', '#0083B0'],
    emoji: '📋'
  },
];

const ExercicesList = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#f7f7f7', '#eef2f5']}
      style={styles.container}
    >
      <Text style={styles.header}>Exercise Explorer</Text>
      <Text style={styles.subheader}>Browse exercises by different categories</Text>
      
      <View style={styles.grid}>
        {filterOptions.map((option, index) => (
          <Animated.View 
            key={option.value}
            entering={FadeInDown.duration(500).delay(index * 100)}
          >
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`../../exercices/${option.value}`)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={option.colors as any}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons 
                      name={option.icon as any}  
                      size={32} 
                      color="white" 
                    />
                  </View>
                  <Text style={styles.title}>{option.label}</Text>
                  <Text style={styles.emoji}>{option.emoji}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => router.push('../../exercices/search')}
      >
        <Text style={styles.searchButtonText}>🔍 Search All Exercises</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: width > 500 ? '48%' : '100%',
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  gradient: {
    borderRadius: 20,
    padding: 25,
    height: 150,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 24,
    alignSelf: 'flex-end',
  },
  searchButton: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 15,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default ExercicesList;