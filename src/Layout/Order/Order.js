import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";

const { width, height } = Dimensions.get('window');

const ordersData = {
  Production: [
    {
      id: "1",
      name: "Arasi Furniture",
      ownername: "kalai",
      phone: "9876543234",
      address: "123, Main Street, Chennai",
      city: "tenkasi",
      pincode: "627411",
      time: "12:56:25",
      date: "12.02.25",
      orderId: "00A004",
      orderDate: "05-10-23",
      salesman: "Vitat",
      productType: "Membarance Door",
      modelNo: "TMD-01",
      orderType: "Normal Order",
      size: "66*27",
      skinColorShade: "Andra Teak",
      thickness: "1.5mm",
      quantity: 15,
      deliveryTime: "10-02-23-12 Pm",
      status: "Production",
      products: [
        { productName: "Wooden Table", quantity: 2, productCode: "WT123" },
        { productName: "Office Chair", quantity: 1, productCode: "OC456" },
      ],
    },
    {
      id: "2",
      name: "Raja Furniture",
      ownername: "kalai",
      phone: "7645932459",
      address: "456, Anna Nagar, Chennai",
      city: "tenkasi",
      pincode: "627411",
      time: "26:52:15",
      date: "10.02.25",
      orderId: "00A005",
      orderDate: "06-10-23",
      salesman: "John",
      productType: "Wooden Chair",
      modelNo: "WC-02",
      orderType: "Urgent Order",
      size: "24*24",
      skinColorShade: "Dark Brown",
      thickness: "2mm",
      quantity: 10,
      deliveryTime: "12-02-23-10 Am",
      status: "Production",
      products: [
        { productName: "Sofa Set", quantity: 1, productCode: "SS789" },
      ],
    },
  ],
  Defected: [
    {
      id: "3",
      name: "KSV Home Appliances",
      ownername: "kalai",
      phone: "5674983409",
      address: "No. 10, Gandhi Road, Chennai",
      city: "tenkasi",
      pincode: "627411",
      defected: "2",
      orderId: "00A006",
      orderDate: "07-10-23",
      salesman: "Mike",
      productType: "Refrigerator",
      modelNo: "RF101",
      orderType: "Normal Order",
      size: "Large",
      skinColorShade: "Silver",
      thickness: "N/A",
      quantity: 1,
      deliveryTime: "15-02-23-03 Pm",
      status: "Defected",
      products: [
        { productName: "Refrigerator", quantity: 1, productCode: "RF101" },
      ],
    },
  ],
  Delivered: [
    {
      id: "4",
      name: "Arasi Furniture",
      ownername: "kalai",
      phone: "9876532234",
      address: "123, Main Street, Chennai",
      city: "tenkasi",
      pincode: "627411",
      date: "10.03.25",
      orderId: "00A007",
      orderDate: "08-10-23",
      salesman: "Vitat",
      productType: "Dining Table",
      modelNo: "DT202",
      orderType: "Normal Order",
      size: "72*36",
      skinColorShade: "Walnut",
      thickness: "1.8mm",
      quantity: 1,
      deliveryTime: "20-02-23-11 Am",
      status: "Delivered",
      products: [
        { productName: "Dining Table", quantity: 1, productCode: "DT202" },
      ],
    },
  ],
};

const Order = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Production");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleArrowLeftClick = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchText('');
    } else {
      navigation.goBack();
    }
  };

  const filteredOrders = ordersData[activeTab].filter(
    (order) =>
      order.name.toLowerCase().includes(searchText.toLowerCase()) ||
      order.phone.includes(searchText)
  );

  const totalQuantity = filteredOrders.reduce((sum, order) => {
    return sum + order.products.reduce((orderSum, product) => orderSum + product.quantity, 0);
  }, 0);

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
        {Object.keys(ordersData).map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabButton, activeTab === tab && styles.activeTabContainer]}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.totalText}>Total Orders: {ordersData[activeTab].length}</Text>
        <Text style={styles.totalText}>Total Qty: {totalQuantity}</Text>
      </View>
      <ScrollView style={styles.listContainer}>
        {filteredOrders.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.orderCard}
            onPress={() => navigation.navigate("OrderDetails", { order: item })}
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.04,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: width * 0.05,
    color: '#1E1F24',
    fontFamily: 'Lato-Bold',
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
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#202020',
    paddingHorizontal: width * 0.03,
    fontFamily: 'Lato-Regular',
  },

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 1,
  },
  tabButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  tabText: {
    fontSize: width * 0.05,
    color: '#838383',
    fontFamily: 'Lato-Regular',
  },
  activeTab: {
    color: '#1B2F2E',
    fontFamily: 'Lato-Bold',
  },
  activeTabContainer: {

    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: '#F4F4F4'
  },

  totalText: {
    fontSize: width * 0.04,
    color: '#1B2F2E',
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.012,
    fontFamily: 'Lato-Regular',
  },
  listContainer: {
    paddingHorizontal: width * 0.04,
  },
  orderCard: {

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
    fontSize: 16, paddingBottom: 8, fontFamily: 'Lato-Regular', color: "#202020"
  },
  orderPhone: { fontSize: 14, color: "gray" },
  orderPhone1: { fontSize: 14, color: "#E5484D" },
  defected: {
    fontSize: 14, color: "black"
  },
  rightColumn: {
    alignItems: "flex-end"
  },
  timeBadge: {
    backgroundColor: "#FBE6E3",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    paddingBottom: 5
  },
  timeText: {
    color: "#D56C45",
    fontWeight: "bold",
    fontSize: 14
  },
  orderDate: {
    fontSize: 12,
    color: "gray",
  },
});

export default Order;

