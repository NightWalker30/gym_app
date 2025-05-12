import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import axios from '../../../outils/axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const CompleteProfile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    sexe: '',
    poids: '',
    taille: '',
    niveau_activite: 'modere'
  });
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Retrieve userId from AsyncStorage when the component mounts
  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        console.error('User ID is missing!');
      }
    };

    getUserId();
  }, []);

const handleSubmit = async () => {
  if (!userId) {
    console.error('User ID is required!');
    return;
  }

  setLoading(true);
  try {
    const token = await AsyncStorage.getItem('userToken'); // Assuming you stored it as 'token'
    if (!token) {
      console.error('Token not found');
      return;
    }

    await axios.put(
      `/updateProfile/${userId}`,
      { ...formData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push('../../(tabs)/entrainement'); // Navigate on success
  } catch (error) {
    console.error('Profile completion error:', (error as any)?.response?.data || (error as any).message);
  } finally {
    setLoading(false);
  }
};


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <LinearGradient colors={['#f8f9ff', '#e6f0ff']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require("../../../assets/images/img2.jpg")}
                style={styles.headerImage}
              />
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Help us personalize your fitness experience
              </Text>
            </View>

            {/* Gender Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <FontAwesome name="user" size={16} color="#6c5ce7" /> Gender
              </Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[styles.radioButton, formData.sexe === 'homme' && styles.radioButtonSelected]}
                  onPress={() => handleInputChange('sexe', 'homme')}
                >
                  <Text style={[styles.radioText, formData.sexe === 'homme' && styles.radioTextSelected]}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.radioButton, formData.sexe === 'femme' && styles.radioButtonSelected]}
                  onPress={() => handleInputChange('sexe', 'femme')}
                >
                  <Text style={[styles.radioText, formData.sexe === 'femme' && styles.radioTextSelected]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Body Measurements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="body" size={16} color="#6c5ce7" /> Body Measurements
              </Text>
              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={styles.input}
                      placeholder="70"
                      keyboardType="numeric"
                      value={formData.poids}
                      onChangeText={(text) => handleInputChange('poids', text)}
                    />
                    <Text style={styles.inputUnit}>kg</Text>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Height (cm)</Text>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={styles.input}
                      placeholder="175"
                      keyboardType="numeric"
                      value={formData.taille}
                      onChangeText={(text) => handleInputChange('taille', text)}
                    />
                    <Text style={styles.inputUnit}>cm</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Activity Level */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <MaterialIcons name="directions-run" size={16} color="#6c5ce7" /> Activity Level
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.niveau_activite}
                  onValueChange={(value) => handleInputChange('niveau_activite', value)}
                  style={styles.picker}
                  dropdownIconColor="#6c5ce7"
                >
                  <Picker.Item label="Low (sedentary)" value="faible" />
                  <Picker.Item label="Moderate (3-5 workouts/week)" value="modere" />
                  <Picker.Item label="High (daily workouts)" value="eleve" />
                </Picker>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={['#6c5ce7', '#a29bfe']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <Text style={styles.buttonText}>Processing...</Text>
                ) : (
                  <>
                    <Text style={styles.buttonText}>Complete Profile</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Skip Option */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.push('../../(tabs)/entrainement')}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginHorizontal: 20,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerImage: {
    width: 180,
    height: 180,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 15,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#6c5ce7',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#6c5ce7',
  },
  radioText: {
    fontSize: 14,
    color: '#6c5ce7',
  },
  radioTextSelected: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 10,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b2bec3',
    borderRadius: 10,
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  inputUnit: {
    fontSize: 14,
    color: '#636e72',
    marginLeft: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#b2bec3',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    marginTop: 30,
  },
  buttonGradient: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    color: '#6c5ce7',
    fontWeight: '600',
  },
});

export default CompleteProfile;
