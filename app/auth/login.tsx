import React, { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import axios from "../../outils/axios";


export default function Login() {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
  
    try {
      const response = await axios.post("/login", { email, password });
  
      if (response.data.success) {
        const token = response.data.token; // Récupérer le token JWT
  
        // Afficher le token dans la console
       // console.log("Token JWT reçu:", token);
  
        // Stocker le token dans AsyncStorage (si nécessaire après le test)
        await AsyncStorage.setItem("userToken", token);
  
        // Rediriger l'utilisateur vers la page d'accueil
        router.replace("/(tabs)/entrainement");
      } else {
        Alert.alert("Erreur", "Nom d'utilisateur ou mot de passe incorrect.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Échec de connexion.");
    }
  };
  

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Connexion avec Google en cours...");

  };



  const goToSignUp = () => {
  router.push("/auth/signUp/formulaire"); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
       source={require("../../assets/images/kilo.png")}
        style={styles.logo}
      />

  
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={24} color="#43e03d" style={styles.icon} />
        <TextInput
          placeholder="Username "
          placeholderTextColor="#999"
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

     
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed"
          size={24}
          color="#43e03d"
          style={styles.icon}
        />
        <TextInput
          placeholder="mot de pass"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Bouton de connexion */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Se connecter</Text>
      </TouchableOpacity>

   
      <Text style={styles.orText}>Ou connectez-vous avec</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialButton}>
          <FontAwesome name="google" size={28} color="#db4437"  />
        </TouchableOpacity>
        </View>      
      <View style={styles.signupContainer}>
        <Text style={{ color: "#aaa" }}>Vous n'avez pas de compte ? </Text>
        <TouchableOpacity onPress={goToSignUp}>
          <Text style={styles.signupText}>Inscrivez-vous</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: "#43e03d",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    height: 50,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#43e03d",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
    width:"100%",
    alignItems:'center'
  },
  loginText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 18,
  },
  orText: {
    color: "#aaa",
    marginTop: 20,
    marginBottom: 10,
  },
  socialContainer: {
  
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    backgroundColor: "#fff",
    padding: 10,
    width:200,
    margin:6,
    borderRadius: 20,
    marginHorizontal: 10,
    alignItems: "center", 
    justifyContent:"center"
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 25,
  },
  signupText: {
    color: "#43e03d",
    fontWeight: "bold",
  },
});
