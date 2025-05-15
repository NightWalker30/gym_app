import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import axios from '../../outils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LineChart,
  BarChart,
  PieChart,
} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// -------------------
// Type Definitions
// -------------------
type DayStat = { day: string; count: number };
type CalorieStat = { date: string; calories: number };
type TypeStat = { name: string; count: number };

// -------------------
// Main Component
// -------------------
const ProgressScreen = () => {
  const [workoutsPerDay, setWorkoutsPerDay] = useState<DayStat[]>([]);
const [caloriesPerDay, setCaloriesPerDay] = useState<CalorieStat[]>([
  { date: '2025-05-01', calories: 200 },
  { date: '2025-05-02', calories: 300 },
]);
  const [workoutTypes, setWorkoutTypes] = useState<TypeStat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      try {
        const res = await axios.get('/statistics/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
       
   
       //setCaloriesPerDay(res.data.caloriesPerDay || []);
        setWorkoutsPerDay(res.data.workoutsPerDay || []);
        setWorkoutTypes(res.data.workoutTypes || []);
      } catch (err) {
        console.error('Erreur stats:', err);
      }
    };

    fetchStats();
    

  }, []);
 


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Statistiques de progrès 📊</Text>

      {/* Line Chart: Calories */}
      <Text style={styles.chartTitle}>Calories brûlées (7 derniers jours)</Text>
      <LineChart
        data={{
          labels: caloriesPerDay.map(d => d.date.slice(5)), // 'MM-DD'
          datasets: [{ data: caloriesPerDay.map(d => Number.isFinite(d.calories) ? d.calories : 0) }],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix=" kcal"
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      {/* Bar Chart: Workout Count */}
      <Text style={styles.chartTitle}>Nombre d'entraînements par jour</Text>
      <BarChart
        data={{
          labels: workoutsPerDay.map(w => w.day),
          datasets: [{ data: workoutsPerDay.map(w => Number.isFinite(w.count) ? w.count : 0) }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        yAxisLabel=""          // ✅ Add this
  yAxisSuffix=" séances" // ✅ Optional: shows "2 séances", etc
        fromZero
        style={styles.chart}
      />

      {/* Pie Chart: Workout Type Ratio */}



    </ScrollView>
  );
};

// -------------------
// Chart Configuration
// -------------------
const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: () => '#fff',
  style: {
    borderRadius: 16,
  },
};

// -------------------
// Pie Colors
// -------------------
const pieColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#00C49F', '#FF6B6B', '#6A1B9A', '#00796B',
];

// -------------------
// Styles
// -------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 20,
  },
  chart: {
    borderRadius: 16,
  },
});

export default ProgressScreen;
