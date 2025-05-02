import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from "expo-router";
import axios from "../../../outils/axios";

const Formulaire = () => {
    const [prenom, setPrenom] = useState("");
    const [nom, setName] = useState("");
    const [age, setAge] = useState("");
    const [pay, setPay] = useState("");
    const [ville, setVille] = useState("");
    const [email, setGmail] = useState("");
    const [password, setPassword] = useState("");  // État pour le mot de passe
    const router = useRouter();

    const handleSignUp = async () => {
        if (!prenom || !nom || !age || !pay || !ville || !email || !password) {
            Alert.alert("Veuillez remplir tous les champs.");
            return;
        }
        try {
            const response = await axios.post("/signUp", { prenom, nom, age, pay, ville, email, password });
            if (response.data.success) {
                Alert.alert('Bravo, inscription réussie !');
                router.push("/auth/login")
            } else {
                Alert.alert('Un champ incorrect.');
            }
        } catch (error: any) {

           // Alert.alert("Erreur", error.response?.data?.message || "Échec de connexion.");
            Alert.alert("Erreur", error.response?.data?.message || error.message || "Échec de connexion.");
           // Alert.alert(Response.data.success);
        }
    }

    const goLogin = () => {
        router.push("/auth/login");
    }

    return (
        <View style={styles.container}>
            {/* Image décorative en haut */}
            <View style={styles.imageContainer}>
                <Image 
                    source={require("../../../assets/images/img2.jpg")}
                    style={styles.image}
                />
            </View>

            <Text style={styles.title}>Inscription</Text>

            <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={prenom}
                onChangeText={setPrenom}
            />
            <TextInput
                style={styles.input}
                placeholder="Nom"
                value={nom}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Âge"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Pays"
                value={pay}
                onChangeText={setPay}
            />
            <TextInput
                style={styles.input}
                placeholder="Ville"
                value={ville}
                onChangeText={setVille}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setGmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}  // Cache le texte du mot de passe
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.link} onPress={goLogin}>
                <Text style={styles.linkText}>Déjà un compte ? Se connecter</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Formulaire;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9'
    },
    imageContainer: {
        width: '100%',
        height: 200,
        marginBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333'
    },
    input: {
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007bff',
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 10,
    },
    linkText: {
        color: '#007bff',
        fontSize: 16,
    }
});
