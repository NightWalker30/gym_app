import React from 'react';
import { View, Text, TouchableOpacity, Alert,SafeAreaView } from 'react-native';
export default function MyButton() {
  const handlePress = () => {
    Alert.alert("Tu as appuyé !");
  };
  return (
<SafeAreaView style={{backgroundColor:'black', marginTop:20}}>
<View style={{ padding: 20, backgroundColor:'black' }}>
      <TouchableOpacity 
        onPress={handlePress}
        style={{
          backgroundColor: '#4CAF50',
          padding: 15,
          borderRadius: 10,
 }}
      >
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
          Appuie ici
        </Text>
      </TouchableOpacity>
    </View>
</SafeAreaView>
);
}
