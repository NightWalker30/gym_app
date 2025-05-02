import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const _layout = () => {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#0a09f4',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            height: 60,
            marginBottom: 0,
            marginHorizontal: 0,
          
          },
        }}
      >
        <Tabs.Screen
          name="entrainement"
          options={{
            title: 'Entraînement',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'barbell' : 'barbell-outline'}
                size={24}
                color={focused ? '#0a09f4' : 'gray'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="personaliser"
          options={{
            title: 'Personnalisé',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'sparkles' : 'sparkles-outline'}
                size={24}
                color={focused ? '#0a09f4' : 'gray'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="exercices"
          options={{
            title: 'Exercices',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'accessibility-outline' : 'accessibility-outline'}
                size={24}
                color={focused ? '#0a09f4' : 'gray'}
              />
            ),
          }}
        />
             <Tabs.Screen
          name="statistique"
          options={{
            title: 'statistique',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'stats-chart-outline' : 'stats-chart-outline'}
                size={24}
                color={focused ? '#0a09f4' : 'gray'}
              />
            ),
          }}
        />
         
        <Tabs.Screen
          name="moi"
          options={{
            title: 'Moi',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'person-circle' : 'person-circle-outline'}
                size={24}
                color={focused ? '#0a09f4' : 'gray'}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default _layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
