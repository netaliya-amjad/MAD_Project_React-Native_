import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* App Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')} 
          style={styles.logo}
        />
        <Text style={styles.appName}>Polish Pop</Text>
      </View>

      {/* Nail Art Option */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DesignScreen')} 
      >
        <Text style={styles.buttonText}>Nail Art Designs</Text>
      </TouchableOpacity>

      {/* Shopping Nails Option */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ShoppingScreen')} 
      >
        <Text style={styles.buttonText}>Shopping Nails</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#d63384',
    fontFamily: 'Cochin',
  },
  button: {
    backgroundColor: '#d63384',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
