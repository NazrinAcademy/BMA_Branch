import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

const AccountOrder = () => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const [orders, setOrders] = useState([
    { 
      id: Math.random().toString(36).substr(2, 9), 
      name: 'Arasi Furniture', 
      phone: '9876543234', 
      date: '10.02.2025', 
      status: 'Pending',
      vendorName: 'Michael',
      address: '3/186 Main Road, Melameignanapuram',
      city: 'Tenkasi',
      pincode: '627 814',
      products: [
        { type: "Membrane Door", model: "TMD-01", quantity: 15 },
        { type: "2D Membrane Door", model: "TM2D-01", quantity: 15 },
      ],
    },
    { 
      id: Math.random().toString(36).substr(2, 9), 
      name: 'Raja Furniture', 
      phone: '7645932459', 
      date: '12.02.2025', 
      status: 'Pending',
      vendorName: 'Raja',
      address: '4/187 Main Road, Melameignanapuram',
      city: 'Tenkasi',
      pincode: '627 814',
      products: [
        { type: "Membrane Door", model: "TMD-01", quantity: 10 },
        { type: "2D Membrane Door", model: "TM2D-01", quantity: 20 },
      ],
    },
    { 
      id: Math.random().toString(36).substr(2, 9), 
      name: 'KSV Home Appliances', 
      phone: '5674983409', 
      date: '18.02.2025', 
      status: 'Completed',
      vendorName: 'KSV',
      address: '5/188 Main Road, Melameignanapuram',
      city: 'Tenkasi',
      pincode: '627 814',
      products: [
        { type: "Membrane Door", model: "TMD-01", quantity: 5 },
        { type: "2D Membrane Door", model: "TM2D-01", quantity: 25, },
      ],
    },
  ]);

 
  useEffect(() => {
    if (route.params?.updatedOrder) {
      const updatedOrder = route.params.updatedOrder;
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    }
  }, [route.params?.updatedOrder]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.status === activeTab &&
      (order.name.toLowerCase().includes(searchText.toLowerCase()) ||
      order.phone.includes(searchText))
  );

  const totalOrders = filteredOrders.length;

  const handleGoBack = () => {
    if (searchMode) {
      setSearchMode(false);
      setSearchText('');
    } else {
      navigation.goBack();
    }
  };

  const handleOrderClick = (order) => {
    navigation.navigate('accountorderlist', {
      order,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <ArrowLeft size={width * 0.07} color="#1E1F24" />
        </TouchableOpacity>
        {searchMode ? (
          <View style={styles.searchBox}>
            <Search size={16} color="#838383" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor={'#838383'}
              autoFocus
            />
          </View>
        ) : (
          <Text style={styles.headerText}>Order</Text>
        )}
        {!searchMode && (
          <TouchableOpacity onPress={() => setSearchMode(true)}>
            <Search size={width * 0.07} color="#1E1F24" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Pending' && styles.activeTab]}
          onPress={() => setActiveTab('Pending')}
        >
          <Text style={[styles.tabText, activeTab === 'Pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>

      {/* List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.totalText}>Total ({totalOrders})</Text>
      </View>

      {/* Order List */}
      <ScrollView style={styles.listContainer}>
        {filteredOrders.map((order) => (
          <TouchableOpacity key={order.id} onPress={() => handleOrderClick(order)} style={styles.orderItem}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderName}>{order.name}</Text>
              <Text style={styles.orderPhone}>{order.phone}</Text>
            </View>
            <View style={styles.orderDateContainer}>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: height * 0.02,
  },
  headerText: {
    color: '#1E1F24',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    paddingVertical: height * 0.01,
    fontFamily: 'Lato-Bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.085,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1B2F2E',
  },
  tabText: {
    fontSize: width * 0.05,
    color: '#838383',
    fontFamily: 'Lato-Regular',
  },
  activeTabText: {
    color: '#1B2F2E',
    fontFamily: 'Lato-Bold',
  },
  listHeader: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.015,
    backgroundColor: '#F4F4F4',
  },
  totalText: {
    fontSize: width * 0.04,
    color: '#1B2F2E',
    paddingHorizontal: width * 0.03,
    paddingVertical:height * 0.012,
    fontFamily: 'Lato-Regular',
  },
  listContainer: {
    paddingHorizontal: width * 0.04,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: 4,
    marginBottom: height * 0.015,
    shadowColor: '#202020',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: '#202020',
  },
  orderInfo: {
    flex: 1,
  },
  orderName: {
    fontSize: width * 0.045,
    fontFamily: 'Lato-Regular',
    color: '#202020',
  },
  orderPhone: {
    fontSize: 14,
    color: '#838383',
    marginTop: height * 0.009,
    fontFamily:'Lato-Regular',
  },
  orderDateContainer: {
    justifyContent: 'flex-end',
  },
  orderDate: {
    fontSize: 12,
    color: '#838383',
    fontFamily: 'Lato-Regular',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 4,
    marginHorizontal: width * 0.03,
    paddingHorizontal: width * 0.03,
    borderColor: '#CECECE',
    borderWidth: 1,
    marginTop:height * 0.009
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#202020',
    paddingHorizontal: width * 0.03,
    fontFamily: 'Lato-Regular',
  },
});

export default AccountOrder;
