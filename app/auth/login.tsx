import React, { useState } from "react";
import { useRouter } from "expo-router";
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
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    try {
      const response = await axios.post("/login", { username, password });

      if (response.data.success) {
     //   Alert.alert("Succès", "Connexion réussie !");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Erreur", "Nom d'utilisateur ou mot de passe incorrect.");
      }
    } catch (error: any) {
      console.error("Erreur :", error.response?.data || error.message);
      Alert.alert("Erreur", error.response?.data?.message || "Échec de connexion.");
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Connexion avec Google en cours...");
    // Implémente l'intégration OAuth ici
  };

  const handleFacebookLogin = () => {
    Alert.alert("Facebook Login", "Connexion avec Facebook en cours...");
    // Implémente l'intégration OAuth ici
  };

  const goToSignUp = () => {
    router.push("/auth/signup"); // Remplace par la route d'inscription réelle
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/images/kip.png")}
        style={styles.logo}
      />

      {/* Entrée du nom d'utilisateur */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={24} color="#43e03d" style={styles.icon} />
        <TextInput
          placeholder="Nom d'utilisateur"
          placeholderTextColor="#999"
          keyboardType="email-address"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      {/* Entrée du mot de passe */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed"
          size={24}
          color="#43e03d"
          style={styles.icon}
        />
        <TextInput
          placeholder="Mot de passe"
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

      {/* Autres moyens de connexion */}
      <Text style={styles.orText}>Ou connectez-vous avec</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialButton}>
          <FontAwesome name="google" size={28} color="#db4437"  />
        </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity onPress={handleFacebookLogin} style={styles.socialButton}>
          <FontAwesome name="facebook" size={28} color="#3b5998" />
        </TouchableOpacity>
      </View>

      {/* Lien vers la page d'inscription */}
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
    width: 180,
    height: 180,
    borderRadius: 90,
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
