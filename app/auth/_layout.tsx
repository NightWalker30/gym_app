// app/auth/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {


  return (

  //   <Stack
  //   screenOptions={{
  //     headerShown: false, // On cache tous les headers
  //     contentStyle: { backgroundColor: 'light' },
  //   }}
  // >

   <Stack   screenOptions={{
      headerShown: false, // On cache tous les headers
        contentStyle: { backgroundColor: 'light' },
     }}>
   <Stack.Screen  name='login' options={{headerShown:false}}        />
   </Stack>
  );
}
