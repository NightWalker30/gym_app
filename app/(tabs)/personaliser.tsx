import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import WorkoutTemplatesScreen from '../WorkoutScreen/Templates';
import PlannedWorkoutsScreen from '../WorkoutScreen/Planned';
import WorkoutLogsScreen from '../WorkoutScreen/Logs';

const Tab = createMaterialTopTabNavigator();

const WorkoutTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontWeight: '600' },
        tabBarActiveTintColor: '#4f46e5',
        tabBarIndicatorStyle: { backgroundColor: '#4f46e5' },
      }}
    >
      <Tab.Screen name="Templates" component={WorkoutTemplatesScreen} />
      <Tab.Screen name="Planned" component={PlannedWorkoutsScreen} />
      <Tab.Screen name="Logs" component={WorkoutLogsScreen} />
    </Tab.Navigator>
  );
};

export default WorkoutTabs;
