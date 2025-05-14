import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../../../outils/axios';

const PlanWorkoutScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  const handleDateChange = (_event: any, date?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (date) setSelectedDate(date);
  };


  const handlePlanWorkout = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`workouts/plan/${id}`, {
        plannedDate: selectedDate,
      });
      Alert.alert('✅ Planned!', 'Workout has been scheduled.');
      router.replace(`../workoutDetail/${res.data._id}`);
    } catch (error) {
      console.error('Error planning workout:', (error as any).message);
      Alert.alert('Error', 'Failed to plan workout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>📅 Plan Workout</Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>Choose a date to plan your workout:</Text>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {!showPicker && (
        <Button title="Select Date" onPress={() => setShowPicker(true)} />
      )}

      <View style={{ marginTop: 30 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <Button title="✅ Plan Workout" onPress={handlePlanWorkout} />
        )}
      </View>
    </View>
  );
};

export default PlanWorkoutScreen;
