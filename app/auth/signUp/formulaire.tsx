import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Platform,
    ScrollView
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "../../../outils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Formulaire = () => {
    const [prenom, setPrenom] = useState("");
    const [nom, setName] = useState("");
    const [date_naissance, setDateNaissance] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pay, setPay] = useState("");
    const [email, setGmail] = useState("");
    const [password, setPassword] = useState("");
    const [validPrenom, setValidPrenom] = useState(true);
    const [validNom, setValidNom] = useState(true);
    const [validDate, setValidDate] = useState(true);
    const [validPay, setValidPay] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const router = useRouter();

    const isValidGmail = (email: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

    const handleSignUp = async () => {
        let formIsValid = true;

        if (!prenom) {
            setValidPrenom(false);
            formIsValid = false;
        }

        if (!nom) {
            setValidNom(false);
            formIsValid = false;
        }

        if (!pay) {
            setValidPay(false);
            formIsValid = false;
        }

        if (!isValidGmail(email)) {
            setValidEmail(false);
            formIsValid = false;
        }

        if (password.length <= 5) {
            setValidPassword(false);
            formIsValid = false;
        }

        if (!formIsValid) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs correctement.");
            return;
        }

        try {
            const response = await axios.post("/signUp", {
                prenom,
                nom,
                date_naissance,
                pay,
                email,
                password
            });

            const { userId, token } = response.data;

            if (userId && token) {
                await AsyncStorage.setItem('userId', userId);
                await AsyncStorage.setItem('userToken', token);
                router.replace("../signUp/CompleteProfile");
            } else {
                Alert.alert('Erreur', 'Un champ incorrect.');
            }
        } catch (error) {
            Alert.alert("Erreur", "Échec de connexion.");
        }
    };

    const goLogin = () => {
        router.push("/auth/login");
    };

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDateNaissance(selectedDate);
            setValidDate(true);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={require("../../../assets/images/img2.jpg")}
                        style={styles.headerImage}
                    />
                    <View style={styles.overlay} />
                    <Text style={styles.title}>Créer un compte</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Prénom</Text>
                        <TextInput
                            style={[styles.input, !validPrenom && styles.invalidInput]}
                            placeholder="Entrez votre prénom"
                            value={prenom}
                            onChangeText={(text) => {
                                setPrenom(text);
                                setValidPrenom(true);
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nom</Text>
                        <TextInput
                            style={[styles.input, !validNom && styles.invalidInput]}
                            placeholder="Entrez votre nom"
                            value={nom}
                            onChangeText={(text) => {
                                setName(text);
                                setValidNom(true);
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Date de naissance</Text>
                        <TouchableOpacity 
                            style={[styles.input, styles.dateInput, !validDate && styles.invalidInput]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: date_naissance ? '#333' : '#999' }}>
                                {date_naissance ? 
                                    `${date_naissance.getDate().toString().padStart(2, '0')}/${(date_naissance.getMonth() + 1).toString().padStart(2, '0')}/${date_naissance.getFullYear()}` : 
                                    'Sélectionnez une date'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date_naissance}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            maximumDate={new Date()}
                            onChange={handleDateChange}
                        />
                    )}

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Pays</Text>
                        <TextInput
                            style={[styles.input, !validPay && styles.invalidInput]}
                            placeholder="Entrez votre pays"
                            value={pay}
                            onChangeText={(text) => {
                                setPay(text);
                                setValidPay(true);
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, !validEmail && styles.invalidInput]}
                            placeholder="exemple@gmail.com"
                            value={email}
                            onChangeText={(text) => {
                                setGmail(text);
                                setValidEmail(true);
                            }}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            style={[styles.input, !validPassword && styles.invalidInput]}
                            placeholder="Minimum 6 caractères"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setValidPassword(true);
                            }}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Déjà un compte ? </Text>
                        <TouchableOpacity onPress={goLogin}>
                            <Text style={styles.loginLink}>Se connecter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Formulaire;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 94, 255, 0.3)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        marginTop: 20,
    },
    formContainer: {
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 30,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        fontWeight: '500',
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        borderColor: '#e1e5eb',
        borderWidth: 1,
        fontSize: 15,
    },
    dateInput: {
        justifyContent: 'center',
    },
    invalidInput: {
        borderColor: '#ff4d4d',
        backgroundColor: '#fff9f9',
    },
    button: {
        backgroundColor: '#005eff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#005eff',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        color: '#666',
        fontSize: 15,
    },
    loginLink: {
        color: '#005eff',
        fontSize: 15,
        fontWeight: '600',
    }
});