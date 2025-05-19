import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const NailArtDesignScreen = ({ route }) => {
  const [designs, setDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true); // for auth check loading
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { user } = route.params;

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // No token, navigate to Login
        navigation.replace('Login'); // replace so user can't go back here
        return;
      }
      // Optionally: you can verify token validity by calling an endpoint here

      // If token is present, fetch the designs
      await fetchDesigns(token);
    } catch (err) {
      console.log('Auth check error:', err);
      navigation.replace('Login');
    } finally {
      setAuthChecking(false);
    }
  };

  const fetchDesigns = async (token) => {
    try {
      const response = await axios.get('http://192.168.18.26:5000/nailart', {
        headers: {
          Authorization: `Bearer ${token}`, // send token in headers for protected route
        },
      });
      if (response.data.length === 0) {
        setError('No nail art designs available');
      } else {
        setDesigns(response.data);
        setFilteredDesigns(response.data);
      }
    } catch (error) {
      console.error('Error fetching designs:', error);
      setError('Failed to fetch designs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = designs.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase()) ||
      item.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredDesigns(filtered);
  };

  const renderDesignItem = ({ item }) => {
    const imageUri = item.imageUrl
      ? `http://192.168.18.26:5000/assets/${item.imageUrl}`
      : 'https://via.placeholder.com/150';

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
        <Text style={styles.title}>{item.name || 'Unnamed Design'}</Text>
        <Text style={styles.description}>{item.description || 'No description available'}</Text>
        <Text style={styles.price}>Price: ${item.price || 'N/A'}</Text>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookingScreen', { user, design: item })}
        >
          <Text style={styles.bookText}>Book</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (authChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Checking authentication...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e91e63" />
        <Text style={styles.loadingText}>Loading Nail Art Designs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search nail art designs..."
        value={searchText}
        onChangeText={handleSearch}
      />
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredDesigns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDesignItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default NailArtDesignScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e91e63',
  },
  searchInput: {
    height: 40,
    borderColor: '#e91e63',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffe4ec',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#c2185b',
  },
  description: {
    fontSize: 14,
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: '#e91e63',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});
