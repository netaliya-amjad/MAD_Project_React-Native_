
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const GreetingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎉😊</Text>
      <Text style={styles.thankYouText}>Thank You for your Order!</Text>
      
      <TouchableOpacity 
        style={styles.homeButton} 
        onPress={() => navigation.navigate('HomeTabs')}  // ya aapke navigation stack mein jo naam hai wahi yahan use karen
      >
        <Text style={styles.homeButtonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding: 20 },
  emoji: { fontSize: 64, marginBottom: 20 },
  thankYouText: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  homeButton: { backgroundColor: '#007bff', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
  homeButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default GreetingsScreen;
