import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ShoppingScreen = () => {
  const [nailPaints, setNailPaints] = useState([]);
  const [filteredNailPaints, setFilteredNailPaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();

  // 🔐 Auth Check & Fetch
  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('LoginSignupChoiceScreen');
        return;
      }

      await fetchNailPaints(token);
    } catch (err) {
      console.error('Auth check error:', err);
      navigation.replace('LoginSignupChoiceScreen');
    } finally {
      setAuthChecking(false);
    }
  };

  const fetchNailPaints = async (token) => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.18.26:5000/nailpaints', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNailPaints(data);
      setFilteredNailPaints(data);
    } catch (error) {
      console.error('Failed to fetch nail paints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    AsyncStorage.getItem('token').then((token) => {
      if (token) {
        fetchNailPaints(token);
      }
    });
  };

  const handleOrderNow = (nailPaint) => {
    navigation.navigate('OrderScreen', { nailPaint });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = nailPaints.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNailPaints(filtered);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `http://192.168.18.26:5000/assets/${item.image_url}` }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>Price: Rs. {item.price}</Text>
        <Text>Rating: {item.rating} ⭐ ({item.reviews_count} reviews)</Text>
        <Text>Stock: {item.stock}</Text>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => handleOrderNow(item)}
        >
          <Text style={styles.orderButtonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (authChecking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={{ marginTop: 10 }}>Checking authentication...</Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={{ marginTop: 10 }}>Loading Products...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search nail paints..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredNailPaints}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
};

export default ShoppingScreen;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e91e63',
  },
  price: {
    fontSize: 16,
    marginVertical: 4,
  },
  orderButton: {
    marginTop: 8,
    backgroundColor: '#e91e63',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
