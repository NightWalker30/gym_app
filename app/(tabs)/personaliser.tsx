import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import WorkoutTemplatesScreen from '../WorkoutScreen/Templates';
import PlannedWorkoutsScreen from '../WorkoutScreen/Planned';
import WorkoutLogsScreen from '../WorkoutScreen/Logs';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator();

const WorkoutTabs = () => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.header}
      >
        <Text style={styles.headerText}>Workout Manager</Text>
      </LinearGradient>
      
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: '#6a11cb',
          tabBarInactiveTintColor: '#888',
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarStyle: styles.tabBar,
          tabBarPressColor: 'rgba(106, 17, 203, 0.1)',
        }}
      >
        <Tab.Screen 
          name="Templates" 
          component={WorkoutTemplatesScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="format-list-bulleted" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Planned" 
          component={PlannedWorkoutsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="calendar-today" size={22} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Logs" 
          component={WorkoutLogsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="history" size={22} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fe',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginHorizontal: 10,
    marginTop: -15,
    overflow: 'hidden',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 5,
  },
  tabIndicator: {
    backgroundColor: '#6a11cb',
    height: 3,
    borderRadius: 3,
  },
});

export default WorkoutTabs;