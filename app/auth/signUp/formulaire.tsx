import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Platform
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from "expo-router";
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from "../../../outils/axios";

const Formulaire = () => {
    const [prenom, setPrenom] = useState("");
    const [nom, setName] = useState("");
    const [date_naissance, setDateNaissance] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pay, setPay] = useState("");
    const [ville, setVille] = useState("");
    const [email, setGmail] = useState("");
    const [password, setPassword] = useState("");
    const [validPrenom, setValidPrenom] = useState(true);
    const [validNom, setValidNom] = useState(true);
    const [validDate, setValidDate] = useState(true);
    const [validPay, setValidPay] = useState(true);
    const [validVille, setValidVille] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const router = useRouter();

    const hasNumbers = (str: string) => /\d/.test(str);
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

        if (!ville) {
            setValidVille(false);
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
            Alert.alert("Veuillez remplir tous les champs correctement.");
            return;
        }

        try {
            const response = await axios.post("/signUp", {
                prenom,
                nom,
                date_naissance,
                pay,
                ville,
                email,
                password
            });

            if (response.data.success) {
                Alert.alert('Bravo, inscription réussie !');
                router.push("/auth/login");
            } else {
                Alert.alert('Un champ incorrect.');
            }
        } catch (error) {
            Alert.alert("Erreur", "Échec de connexion.");
        }
    };

    const goLogin = () => {
        router.push("/auth/login");
    };

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false); // Cacher le sélecteur de date après sélection
        if (selectedDate) {
            setDateNaissance(selectedDate);
            setValidDate(true); // Réinitialiser la validité
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require("../../../assets/images/img2.jpg")}
                    style={styles.image}
                />
            </View>

            <Text style={styles.title}>Créer un compte</Text>

            <TextInput
                style={[styles.input, !validPrenom && styles.invalidInput]}
                placeholder="Prénom"
                value={prenom}
                onChangeText={(text) => {
                    setPrenom(text);
                    setValidPrenom(true); // Réinitialiser la validité
                }}
            />
            <TextInput
                style={[styles.input, !validNom && styles.invalidInput]}
                placeholder="Nom"
                value={nom}
                onChangeText={(text) => {
                    setName(text);
                    setValidNom(true);
                }}
            />

            {/* Suppression de l'entrée manuelle pour la date et utilisation du calendrier */}
            <TouchableOpacity 
                style={[styles.input, !validDate && styles.invalidInput]}
                onPress={() => setShowDatePicker(true)} // Afficher le calendrier lorsque l'utilisateur appuie
            >
                <Text style={{ color: '#555' }}>
                    {date_naissance ? `${date_naissance.getDate().toString().padStart(2, '0')}/${(date_naissance.getMonth() + 1).toString().padStart(2, '0')}/${date_naissance.getFullYear()}` : 'Date de naissance'}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={date_naissance}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                />
            )}

            <TextInput
                style={[styles.input, !validPay && styles.invalidInput]}
                placeholder="Pays"
                value={pay}
                onChangeText={(text) => {
                    setPay(text);
                    setValidPay(true);
                }}
            />
            <TextInput
                style={[styles.input, !validVille && styles.invalidInput]}
                placeholder="Ville"
                value={ville}
                onChangeText={(text) => {
                    setVille(text);
                    setValidVille(true);
                }}
            />
            <TextInput
                style={[styles.input, !validEmail && styles.invalidInput]}
                placeholder="Email (ex: exemple@gmail.com)"
                value={email}
                onChangeText={(text) => {
                    setGmail(text);
                    setValidEmail(true);
                }}
                keyboardType="email-address"
            />
            <TextInput
                style={[styles.input, !validPassword && styles.invalidInput]}
                placeholder="Mot de passe"
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    setValidPassword(true);
                }}
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} onPress={goLogin}>
                <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Formulaire;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#f2f6ff',
        justifyContent: 'center',
    },
    imageContainer: {
        height: 180,
        marginBottom: 25,
        borderRadius: 12,
        overflow: 'hidden',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 25,
        color: '#222',
        textAlign: 'center',
    },
    input: {
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15,
        borderColor: '#d0d7e2',
        borderWidth: 1,
    },
    invalidInput: {
        borderColor: 'red', // Rouge pour un champ invalide
    },
    button: {
        backgroundColor: '#005eff',
        paddingVertical: 13,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    link: {
        alignItems: 'center',
    },
    linkText: {
        color: '#005eff',
        fontSize: 15,
        marginTop: 5,
    }
});
