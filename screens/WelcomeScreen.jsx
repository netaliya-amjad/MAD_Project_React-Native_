import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LoginSignupChoice');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assetss/logo.png')} // Updated to use the logo from the 'assetss' folder
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.brand}>Polish Pop</Text>
      <Text style={styles.tagline}>Where beauty meets elegance!</Text>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f5', // soft pink background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150, // Adjusted size for better visual fit
    height: 150,
    marginBottom: 20,
    borderRadius: 75, // Rounded corners to make the logo more appealing
    borderWidth: 5, // Border around logo for a stylish touch
    borderColor: '#c2185b', // Matching border with brand color
    backgroundColor: '#fff', // White background to make logo stand out
    padding: 10,
  },
  title: {
    fontSize: 26,
    color: '#555',
    fontFamily: 'Arial', // Clean and readable font
    marginBottom: 5,
  },
  brand: {
    fontSize: 42, // Increased font size for more emphasis
    fontWeight: 'bold',
    color: '#c2185b', // deep pink
    letterSpacing: 1, // Adding spacing between letters for a modern look
  },
  tagline: {
    fontSize: 18,
    color: '#777', // Lighter color for the tagline text
    fontStyle: 'italic',
    marginTop: 10,
  },
});
 