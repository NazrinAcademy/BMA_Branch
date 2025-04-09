import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

const { width, height } = Dimensions.get('window');

const SalesOrder = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Production");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [orders, setOrders] = useState(ordersData);
  const [rejectedOrders, setRejectedOrders] = useState(ordersData.Rejected);

  // Handle reorder logic when SalesOrderAccept navigates back
  useFocusEffect(
    React.useCallback(() => {
      const removeRejectedOrder = (orderId) => {
        const updatedRejectedOrders = rejectedOrders.filter(order => order.id !== orderId);
        setRejectedOrders(updatedRejectedOrders); // Update rejected orders state
        console.log("Reorder logged in SalesOrder"); // Log the event
      };

      // Listen for reorder event from SalesOrderAccept
      const reorderListener = navigation.addListener('state', (event) => {
        const { params } = event.data?.routes?.find(route => route.name === "SalesOrderAccept") || {};
        if (params?.orderId) {
          removeRejectedOrder(params.orderId); // Remove the rejected order
        }
      });

      return () => reorderListener(); // Cleanup listener
    }, [rejectedOrders])
  );

  const handleArrowLeftClick = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchText('');
    } else {
      navigation.goBack();
    }
  };

  const filteredOrders = activeTab === "Rejected"
    ? rejectedOrders.filter(
        (order) =>
          order.name.toLowerCase().includes(searchText.toLowerCase()) ||
          order.phone.includes(searchText)
    : orders[activeTab]
    ? orders[activeTab].filter(
        (order) =>
          order.name.toLowerCase().includes(searchText.toLowerCase()) ||
          order.phone.includes(searchText))
    : [];

  const totalQuantity = filteredOrders.reduce((sum, order) => {
    return sum + order.products.reduce((orderSum, product) => orderSum + product.quantity, 0);
  }, 0);

  const handleOrderPress = (item) => {
    if (activeTab === "Rejected") {
      navigation.navigate("SalesOrderAccept", { 
        order: item, // Pass only serializable data
      });
    } else {
      navigation.navigate("SalesOrderDetails", { order: item });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleArrowLeftClick}>
          <ArrowLeft size={24} color="#202020" />
        </TouchableOpacity>
        {isSearchActive ? (
          <View style={styles.searchBox}>
            <Search size={16} color="#838383" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor={'#838383'}
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              autoFocus
            />
          </View>
        ) : (
          <Text style={styles.headerTitle}>Orders</Text>
        )}
        {!isSearchActive && (
          <TouchableOpacity onPress={() => setIsSearchActive(true)}>
            <Search size={24} color="#202020" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.tabsContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {Object.keys(ordersData).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabButton, activeTab === tab && styles.activeTabContainer]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.totalText}>Total Orders: {filteredOrders.length}</Text>
        <Text style={styles.totalText}>Total Qty: {totalQuantity}</Text>
      </View>
      <ScrollView style={styles.listContainer}>
        {filteredOrders.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.orderCard}
            onPress={() => handleOrderPress(item)}
          >
            <View style={styles.orderInfo}>
              <Text style={styles.orderName}>{item.name}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.orderPhone}>{item.phone}</Text>
                {activeTab === "Defected" ? (
                  <Text style={styles.orderPhone1}>Defected: {item.defected}</Text>
                ) : (
                  <Text style={styles.orderPhone1}>Delivery Date: {item.date}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};