import { Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { auth } from '@/firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { router } from 'expo-router'


const three_main = () => {

  return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Esta es la tercera pestaña</Text>
    </SafeAreaView>
  )
}

export default three_main

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA', 
  },
  title: {
    fontSize: 28, 
    fontWeight: '800', 
    marginBottom: 40, 
    color: '#1A237E', 
  },
  textInput: {
    height: 50, 
    width: '90%', 
    backgroundColor: '#FFFFFF', 
    borderColor: '#E8EAF6',
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: 15,
    paddingHorizontal: 25, 
    fontSize: 16, 
    color: '#3C4858', 
    shadowColor: '#9E9E9E', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, 
  },
  button: {
    width: '90%',
    marginVertical: 15,
    backgroundColor: '#5C6BC0', 
    padding: 20,
    borderRadius: 15, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6BC0', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: '600', 
  }
});