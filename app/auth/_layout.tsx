// app/auth/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {


  return (



   <Stack>
   <Stack.Screen  name='login' options={{headerShown:false}}        />



   </Stack>
  );
}
