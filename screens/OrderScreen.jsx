import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderScreen = ({ route, navigation }) => {
  const { nailPaint } = route.params || {}; // Handle undefined route.params
  const [orderHistory, setOrderHistory] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [authChecking, setAuthChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🔐 Auth Check & Fetch Orders
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (!storedUserId) {
          Alert.alert('Unauthorized', 'Please login first.');
          navigation.replace('LoginSignupChoiceScreen');
          return;
        }
        setUserId(parseInt(storedUserId));
        setAuthChecking(false);
        fetchOrderHistory(parseInt(storedUserId));
      } catch (error) {
        console.error('Error checking login status:', error);
        Alert.alert('Error', 'Failed to verify user login.');
        navigation.replace('LoginSignupChoiceScreen');
      }
    };

    checkAuthAndFetch();
  }, []);

  const fetchOrderHistory = async (uid) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://192.168.18.26:5000/orders/user/${uid}`);
      setOrderHistory(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error('Error fetching order history:', error);
      Alert.alert('Error', 'Failed to fetch order history.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredOrders(orderHistory);
    } else {
      const filtered = orderHistory.filter(order =>
        order.product_name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  };

  const confirmOrder = async () => {
    if (!nailPaint || !userId) {
      Alert.alert('Error', !nailPaint ? 'No product selected.' : 'User not logged in.');
      return;
    }

    const orderData = {
      user_id: userId,
      product_id: nailPaint.id,
      product_name: nailPaint.name,
      product_price: nailPaint.price,
    };

    try {
      await axios.post('http://192.168.18.26:5000/orders', orderData);
      Alert.alert('Order Confirmed!', 'Your order for ' + nailPaint.name + ' has been placed successfully.');
      fetchOrderHistory(userId);
      setTimeout(() => {
        navigation.navigate('GreetingsScreen');
      }, 3000);
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm order.');
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://192.168.18.26:5000/orders/${orderId}`);
      Alert.alert('Deleted', 'Order deleted successfully.');
      fetchOrderHistory(userId);
    } catch (error) {
      console.error('Error deleting order:', error);
      Alert.alert('Error', 'Failed to delete order.');
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text>Product: {item.product_name}</Text>
      <Text>Price: Rs. {item.product_price}</Text>
      <Text>Ordered On: {new Date(item.order_date).toLocaleDateString()} - {new Date(item.order_date).toLocaleTimeString()}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            Alert.alert(
              'Edit Order',
              'Do you want to go back and choose another product?',
              [
                { text: 'OK', onPress: () => navigation.goBack() },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert('Delete Order', 'Are you sure you want to delete this order?', [
              { text: 'Yes', onPress: () => deleteOrder(item.id), style: 'destructive' },
              { text: 'No', style: 'cancel' },
            ]);
          }}
        >
          <Text style={styles.buttonText}>Delete</Text>
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

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={{ marginTop: 10 }}>Loading order history...</Text>
      </View>
    );
  }

  if (!nailPaint) {
    return (
      <View style={styles.container}>
        <Text>No product details available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{nailPaint.name}</Text>
        <Text style={styles.productPrice}>Price: Rs. {nailPaint.price}</Text>
        {nailPaint.description && <Text style={styles.productDescription}>{nailPaint.description}</Text>}
        {nailPaint.image_url && (
          <Image
            source={{ uri: `http://192.168.18.26:5000/assets/${nailPaint.image_url}` }}
            style={styles.productImage}
          />
        )}
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={confirmOrder}>
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>Order History</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search orders..."
        value={searchText}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredOrders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOrderItem}
        ListEmptyComponent={<Text>No order history available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  productInfo: { marginBottom: 24, alignItems: 'center' },
  productName: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  productPrice: { fontSize: 18, color: 'green', marginBottom: 8 },
  productDescription: { fontSize: 16, color: '#555', marginBottom: 16, textAlign: 'center' },
  productImage: { width: 150, height: 150, borderRadius: 8, marginBottom: 16 },
  confirmButton: { backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  historyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 12 },
  searchBar: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, marginBottom: 12 },
  orderItem: { padding: 10, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  editButton: { backgroundColor: '#007bff', padding: 8, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  deleteButton: { backgroundColor: '#dc3545', padding: 8, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default OrderScreen;
