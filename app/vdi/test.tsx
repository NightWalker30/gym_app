import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from "expo-router";
export default function WelcomeScreen() {
    const router= useRouter()
  const video = React.useRef(null);
  const passer=()=>{
    router.replace("/auth/login");

  }

  return (
    <View style={styles.container}>
      {/* Cacher la barre de statut (heure, batterie, etc.) */}
      <StatusBar hidden />

      {/* Vidéo plein écran */}
      <Video
        ref={video}
        source={require('../../assets/vedio/v9.mp4')}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      {/* Contenu au-dessus */}
      <View style={styles.overlay}>
      <Text style={styles.title}>
  "Votre potentiel est infini. Cette application est conçue pour vous aider à atteindre vos objectifs, à repousser vos limites et à exceller dans votre discipline.  
  Ensemble, transformons chaque effort en succès !"
</Text>



        <TouchableOpacity style={styles.button} onPress={passer}>
          <Text style={styles.buttonText}>C'est prêt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 30,
    },
    title: {
        marginTop:600,
      fontSize: 24,
      color: '#fff',
      textAlign: 'center',
      fontWeight: '300',
      marginBottom: 10,
    },
    names: {
      fontWeight: 'bold',
      color: '#00e0ff',
    },
    button: {
      backgroundColor: 'rgba(0, 224, 255, 0.8)',
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 30,
      marginTop: 0,
      shadowColor: '#00e0ff',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 10,
    },
    buttonText: {
      color: '#000',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  