import React, { useState,useEffect  } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ArrowLeft, Search } from "lucide-react-native";
import { useFocusEffect } from "@react-navigation/native"; 

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
      time: "01:00:00",
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
      baseProductionTime: 2,
    },

    {
      id: "2",
      name: "Raja Furniture",
      ownername: "kalai",
      phone: "7645932459",
      address: "456, Anna Nagar, Chennai",
      city: "tenkasi",
      pincode: "627411",
      time: "02:00:00",
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
      deliveryTime: "12-02 Am",
      status: "Production",
      products: [
        { productName: "Sofa Set", quantity: 1, productCode: "SS789" },
      ],
      baseProductionTime: 2,
    },
  ],
  Rejected: [
    {
      id: "6",
      name: "Classic Interiors",
      ownername: "Suresh",
      phone: "9876543211",
      address: "321, Oak Street, Mumbai",
      city: "Mumbai",
      pincode: "400001",
      time: "16:45:00",
      date: "20.03.25",
      orderId: "00A009",
      orderDate: "10-10-23",
      salesman: "Raj",
      productType: "Dining Table",
      modelNo: "DT203",
      orderType: "Normal Order",
      size: "72*36",
      skinColorShade: "Mahogany",
      thickness: "1.8mm",
      quantity: 1,
      deliveryTime: "28-02-23-11 Am",
      status: "Rejected",
      products: [
        { productName: "Dining Table", quantity: 1, productCode: "DT203" },
      ],
      baseProductionTime: 2,
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
        { productName: "Refrigerator", quantity: 1, productCode: "RF101",defective: 5 ,approved: 1 },
      ],
      baseProductionTime: 2,
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
      deliveryTime: "20.00.00 Am",
      status: "Delivered",
      products: [
        { productName: "Dining Table", quantity: 1, productCode: "DT202" },
      ],
      baseProductionTime: 2,
    },
  ],
  Logistics: [
    {
      id: "5",
      name: "Modern Furnishings",
      ownername: "Ravi",
      phone: "9876543210",
      address: "789, Elm Street, Bangalore",
      city: "Bangalore",
      pincode: "560001",
      time: "14:30:00",
      date: "15.03.25",
      orderId: "00A008",
      orderDate: "09-10-23",
      salesman: "Kumar",
      productType: "Sofa",
      modelNo: "SF-01",
      orderType: "Normal Order",
      size: "84*36",
      skinColorShade: "Beige",
      thickness: "2.0mm",
      quantity: 2,
      deliveryTime: "25-02-23-02 Pm",
      status: "Ordered",
      products: [
        { productName: "Sofa", quantity: 2, productCode: "SF-01" },
      ],
      baseProductionTime: 2,
    },
  ],
};


const SalesOrder = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("Production"); // Initialize with a valid key
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [orders, setOrders] = useState(ordersData);
  const [rejectedOrders, setRejectedOrders] = useState(ordersData.Rejected); 

   useFocusEffect(
    React.useCallback(() => {
      const removeRejectedOrder = (orderId) => {
        const updatedRejectedOrders = rejectedOrders.filter(order => order.id !== orderId);
        setRejectedOrders(updatedRejectedOrders); 
        console.log("Reorder logged in SalesOrder"); 
      };

      const reorderListener = navigation.addListener('state', (event) => {
        const { params } = event.data?.routes?.find(route => route.name === "SalesOrderAccept") || {};
        if (params?.orderId) {
          removeRejectedOrder(params.orderId); 
        }
      });

      return () => reorderListener(); 
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

  // const filteredOrders = ordersData[activeTab] ? ordersData[activeTab].filter(
  //   (order) =>
  //     order.name.toLowerCase().includes(searchText.toLowerCase()) ||
  //     order.phone.includes(searchText)
  // ) : [];
  // Filter orders based on active tab
  const filteredOrders = activeTab === "Rejected" 
    ? rejectedOrders.filter(
        (order) =>
          order.name.toLowerCase().includes(searchText.toLowerCase()) ||
          order.phone.includes(searchText)
      )
    : orders[activeTab] 
    ? orders[activeTab].filter(
        (order) =>
          order.name.toLowerCase().includes(searchText.toLowerCase()) ||
          order.phone.includes(searchText)
      )
    : [];

  const totalQuantity = filteredOrders.reduce((sum, order) => {
    return sum + order.products.reduce((orderSum, product) => orderSum + product.quantity, 0);
  }, 0);

  // const handleOrderPress = (item) => {
  //   if (activeTab === "Rejected") {
  //     navigation.navigate("SalesOrderAccept", { order: item });
  //   } else {
  //     navigation.navigate("SalesOrderDetails", { order: item });
  //   }
  // };
  //   const handleOrderPress = (item) => {
  //   if (activeTab === "Rejected") {
  //     navigation.navigate("SalesOrderAccept", { 
  //       order: item, 
  //       removeRejectedOrder: handleRemoveRejectedOrder // Pass function to remove rejected order
  //     });
  //   } else {
  //     navigation.navigate("SalesOrderDetails", { order: item });
  //   }
  // };

  const handleOrderPress = (item) => {
    if (activeTab === "Rejected") {
      navigation.navigate("SalesOrderAccept", { 
        order: item, 
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
              {/* <Text style={styles.timeText}>{item.time}</Text> */}
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.orderPhone}>{item.phone}</Text>
                {activeTab === "Defected" ? (
                  <Text style={styles.orderPhone11}>Defected: {item.defected}</Text>
                ) : (
                  <Text style={styles.orderPhone1}>Delivery Date: {item.date}</Text>
                )}
              </View>
              {/* {activeTab === "Production" && (
                <Text style={styles.productionTime}>
                  Total Production Time: {calculateProcessingTime(item.quantity)}
                </Text>
              )} */}
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
    paddingVertical: height * 0.01, // 1% of screen height
    paddingHorizontal: width * 0.05, 
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
  orderPhone: { fontSize: 14, color: "gray", fontFamily: 'Lato-Regular' },
  orderPhone1: { fontSize: 14, color: "#838383" , fontFamily: 'Lato-Regular'},
  orderPhone11: { fontSize: 14, color: "#E5484D" , fontFamily: 'Lato-Regular'},
  defected: {
    fontSize: 14, color: "black"
  },
  rightColumn: {
    alignItems: "flex-end"
  },
  timeBadge: {
    backgroundColor: "#FBE6E3",
    // paddingVertical: 3,
    // paddingHorizontal: 5,
    paddingVertical: height * 0.005, 
    paddingHorizontal: width * 0.02,
   
    borderRadius: width * 0.01, 
    paddingBottom: height * 0.005
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
  productionTime: {
    fontSize: 14,
    color: "#1B2F2E",
    marginTop: 8,
  },
});

export default SalesOrder;