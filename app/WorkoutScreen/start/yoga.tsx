import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const CardioStartScreen = () => {
  const [duration, setDuration] = useState<number>(30); // Default duration 30 minutes
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(duration * 60); // Time in seconds
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      setTimer(interval);

      return () => clearInterval(interval); // Cleanup on component unmount or when stopping the timer
    } else if (timeLeft <= 0) {
      setIsRunning(false); // Stop timer when time is up
    }
  }, [isRunning, timeLeft]);

  const handleStartStop = () => {
    if (isRunning) {
      // Stop the workout
      if (timer) clearInterval(timer);
      setIsRunning(false);
    } else {
      // Start the workout
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    if (timer) clearInterval(timer);
    setIsRunning(false);
    setTimeLeft(duration * 60); // Reset time back to original duration
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cardio Workout</Text>
      <Text style={styles.subtitle}>Duration: {duration} min</Text>

      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.startStopButton}
          onPress={handleStartStop}
        >
          <Ionicons name={isRunning ? 'pause' : 'play'} size={24} color="white" />
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.durationSelector}>
        <Text style={styles.durationLabel}>Select Duration:</Text>
        <View style={styles.durationButtons}>
          {[10, 20, 30, 45, 60].map((minute) => (
            <TouchableOpacity
              key={minute}
              style={[styles.durationButton, duration === minute && styles.selectedDuration]}
              onPress={() => {
                setDuration(minute);
                setTimeLeft(minute * 60); // Reset timer to selected duration
              }}
            >
              <Text style={styles.durationButtonText}>{minute} min</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  timer: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#4f46e5',
    marginBottom: 30,
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  startStopButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  resetButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  durationSelector: {
    marginTop: 30,
    alignItems: 'center',
  },
  durationLabel: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 10,
  },
  durationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  durationButton: {
    backgroundColor: '#d1d5db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    borderRadius: 30,
  },
  selectedDuration: {
    backgroundColor: '#4f46e5',
  },
  durationButtonText: {
    color: '#111827',
    fontSize: 16,
  },
});

export default CardioStartScreen;
