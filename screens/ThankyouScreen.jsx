import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ThankYouScreen = ({ navigation }) => {
  const goToHome = () => {
    navigation.navigate('HomeTabs');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backArrow} onPress={goBack}>
        <Text style={styles.arrowText}>←</Text>
      </TouchableOpacity>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.thankYouText}>Thank you for booking us!</Text>

        <TouchableOpacity style={styles.homeButton} onPress={goToHome}>
          <Text style={styles.homeButtonText}>Go to Home Page</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFF0',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backArrow: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
  },
  arrowText: {
    fontSize: 28,
    color: '#3CB371',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3CB371',
    marginBottom: 30,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: '#8FBC8F',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ThankYouScreen;
