import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { MotiView } from 'moti';

export default function ChooseSession() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          onPress: () => {
            // Ajoute ici toute logique de suppression de token, etc.
            router.replace("/auth/login");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisissez votre séance</Text>

      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 200, type: 'timing' }}
        style={styles.card}
      >
        <TouchableOpacity onPress={() => router.push("/seances/musculation")}>
          <Image
            source={require("../../assets/images/musulp.jpg")}
            style={styles.image}
          />
          <Text style={styles.text}>Musculation</Text>
        </TouchableOpacity>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 400, type: 'timing' }}
        style={styles.card}
      >
        <TouchableOpacity onPress={() => router.push("/seances/musculation")}>
          <Image
            source={require("../../assets/images/run.jpg")}
            style={styles.image}
          />
          <Text style={styles.text}>Course</Text>
        </TouchableOpacity>
      </MotiView>

      {/* 🔘 Bouton de déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  card: {
    width: '90%',
    marginVertical: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
