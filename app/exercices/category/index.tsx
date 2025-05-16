import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { exercices } from '../../data/exercices';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width > 500 ? width * 0.45 : width * 0.9;

const CategoryIndex = () => {
  const router = useRouter();
const categories = Array.from(new Set(exercices.map(e => e.category))) as string[];

  // Category icons mapping
const categoryIcons = {
  'Strength': 'fitness-center',            // ✅ Valid
  'cardio': 'directions-run',              // ✅ Valid
  'Flexibility': 'self-improvement',       // ✅ Yoga pose icon
  'Balance': 'accessibility',              // ✅ Standing human
  'plyometrics': 'sports-kabaddi',         // ✅ Dynamic movement icon
  'olympic weightlifting': 'sports-mma',   // ✅ Boxing glove
  'Strongman': 'sports-handball',          // ✅ Dynamic sport icon
  'stretching': 'self-improvement',        // ✅ Yoga pose again
  'powerlifting': 'fitness-center',        // ✅ Reuse of weight ico
};


  // Default gradient colors
  const getGradientColors = (category: string) => {
    const colorMap: Record<string, string[]> = {
      'Strength': ['#FF416C', '#FF4B2B'],
      'cardio': ['#4776E6', '#8E54E9'],
      'Flexibility': ['#00B4DB', '#0083B0'],
      'Balance': ['#4CAF50', '#8BC34A'],
      'Plyometrics': ['#FF9800', '#FFC107'],
      'Olympic Weightlifting': ['#9C27B0', '#E91E63'],
      'Strongman': ['#3F51B5', '#2196F3'],
      'Stretching': ['#009688', '#4CAF50'],
      'Powerlifting': ['#795548', '#9E9E9E'],
    };
    return colorMap[category] || ['#6a11cb', '#2575fc'];
  };

  const handlePress = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/exercices/category/${category}`);
  };

  return (
    <LinearGradient
      colors={['#f8f9fe', '#eef2f5']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Exercise Categories</Text>
        <Text style={styles.subtitle}>{categories.length} categories available</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        numColumns={width > 500 ? 2 : 1}
        columnWrapperStyle={width > 500 ? styles.columnWrapper : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.duration(500).delay(index * 100)}
          >
            <TouchableOpacity
              style={styles.card}
              onPress={() => handlePress(item)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={getGradientColors(item) as any}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons 
                      name={categoryIcons[item as keyof typeof categoryIcons] as any|| 'fitness-center'} 
                      size={32} 
                      color="white" 
                    />
                  </View>
                  <Text style={styles.categoryText}>{item}</Text>
                  <Text style={styles.countText}>
                    {exercices.filter(e => e.category === item).length} exercises
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  gradient: {
    borderRadius: 20,
    padding: 24,
    height: 160,
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
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  countText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
});

export default CategoryIndex;