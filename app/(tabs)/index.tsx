// Esta es la pantalla MAIN del Programa
import { auth } from "@/firebaseConfig";
import { router } from 'expo-router';
import { signOut, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function TabOneScreen() {
  const [user, setUser] = useState(auth.currentUser);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u:any) => {
      setUser(u);
      if (!u) {
        router.replace('/'); // app/index.tsx -> login
      }
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      setIsSigningOut(false);
    }
  };

  if (isSigningOut) {
    return (
      <View style={styles.container}>
        <Text>Cerrando sesión...</Text>
      </View>
    );
  }

  if (!user) return null; // mientras redirige

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text>Email: {user.email}</Text>
      <Text>UID: {user.uid}</Text>
      {user.displayName && <Text>Nombre: {user.displayName}</Text>}
      {user.photoURL && <Text>Foto: {user.photoURL}</Text>}
      
      <Button title="Cerrar sesión" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});
