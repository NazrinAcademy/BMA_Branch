import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ArrowLeft, Search ,Plus } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ordersData = {
  Ordered: [
    {
      id: "5",
      name: "Modern Furnishings",
      ownername: "Ravi",
      phone: "9876543210",
      address: "789, Elm Street, Bangalore",
      city: "Bangalore",
      pincode: "560001",
      time: "14:30:00",
      deliverydate: "15.03.25",
      orderId: "00A008",
      orderDate: "09-10-23",
      salesman: "Kumar",
      status: "Ordered",
      products: [
        { 
          productName: "Sofa", 
          quantity: 2, 
          productCode: "SF-01",
          productType: "Sofa",
          modelNo: "SF-01",
          orderType: "Normal Order",
          size: "84*36",
          skinColorShade: "Beige",
          thickness: "2.0mm",
          baseProductionTime: 2
        },
        {
          productName: "Wooden Door",
          quantity: 10,
          productCode: "TWD-02",
          productType: "Wooden Door",
          modelNo: "TWD-02",
          orderType: "Normal Order",
          size: { width: 90, height: 40 },
          skinColorShade: "Brown",
          thickness: "3.0mm",
          baseProductionTime: 5
        }
      ]
    }
  ],
  
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
      deliverydate: "12.02.25",
      orderId: "00A004",
      orderDate: "05-10-23",
      salesman: "Vitat",
      status: "Production",
      products: [
        { 
          productName: "Membrane Door", 
          quantity: 15, 
          productCode: "TMD-01",
          productType: "Membrane Door",
          modelNo: "TMD-01",
          orderType: "Normal Order",
          size: "66*27",
          skinColorShade: "Andra Teak",
          thickness: "1.5mm",
          baseProductionTime: 2
        },
        { 
          productName: "Wooden Table", 
          quantity: 2, 
          productCode: "WT123",
          productType: "Wooden Table",
          modelNo: "WT123",
          orderType: "Normal Order",
          size: "48*30",
          skinColorShade: "Teak",
          thickness: "2.0mm",
          baseProductionTime: 3
        },
        { 
          productName: "Office Chair", 
          quantity: 1, 
          productCode: "OC456",
          productType: "Office Chair",
          modelNo: "OC456",
          orderType: "Normal Order",
          size: "22*22",
          skinColorShade: "Black",
          thickness: "N/A",
          baseProductionTime: 1
        }
      ]
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
      deliverydate: "10.02.25",
      orderId: "00A005",
      orderDate: "06-10-23",
      salesman: "John",
      status: "Production",
      products: [
        { 
          productName: "Wooden Chair", 
          quantity: 10, 
          productCode: "WC-02",
          productType: "Wooden Chair",
          modelNo: "WC-02",
          orderType: "Urgent Order",
          size: "24*24",
          skinColorShade: "Dark Brown",
          thickness: "2mm",
          baseProductionTime: 2
        },
        { 
          productName: "Sofa Set", 
          quantity: 1, 
          productCode: "SS789",
          productType: "Sofa Set",
          modelNo: "SS789",
          orderType: "Urgent Order",
          size: "84*36",
          skinColorShade: "Dark Brown",
          thickness: "2.5mm",
          baseProductionTime: 4
        }
      ]
    }
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
      status: "Defected",
      products: [
        { 
          productName: "Refrigerator", 
          quantity: 1, 
          productCode: "RF101",
          productType: "Refrigerator",
          modelNo: "RF101",
          orderType: "Normal Order",
          size: "Large",
          skinColorShade: "Silver",
          thickness: "N/A",
          baseProductionTime: 0,
          defective: 5 ,approved: 1
        }
      ]
    }
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
      deliverydate: "10.03.25",
      orderId: "00A007",
      orderDate: "08-10-23",
      salesman: "Vitat",
      status: "Delivered",
      products: [
        { 
          productName: "Dining Table", 
          quantity: 1, 
          productCode: "DT202",
          productType: "Dining Table",
          modelNo: "DT202",
          orderType: "Normal Order",
          size: "72*36",
          skinColorShade: "Walnut",
          thickness: "1.8mm",
          baseProductionTime: 3
        }
      ]
    }
  ]
};




const Order = () => {
  const [activeTab, setActiveTab] = useState("Ordered");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation();

  const handleArrowLeftClick = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchText('');
    } else {
      navigation.pop();
    }
  };

  const filteredOrders = ordersData[activeTab].filter(
    (order) =>
      order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery)
  );

  const totalQuantity = filteredOrders.reduce((sum, order) => {
    return sum + order.products.reduce((orderSum, product) => orderSum + product.quantity, 0);
  }, 0);

  const handleOrderPress = (item) => {
    if (activeTab === "Ordered") {
    //   navigation.navigate("OrderAccept", { order: item });
    // } else {
      navigation.navigate("OrderDetails", { order: item });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (isSearchVisible) {
            setIsSearchVisible(false); 
          } else {
            navigation.goBack(); 
          }
        }}>
          <ArrowLeft size={24} color="#1E1F24" />
        </TouchableOpacity>

        {isSearchVisible ? (
          <View style={styles.searchBox}>
            <TouchableOpacity onPress={() => setIsSearchVisible(false)}>
              <Search size={16} color="#838383" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
              placeholderTextColor={"#838383"}
            />
          </View>
        ) : (
          <Text style={styles.headerText}>Orders</Text>
        )}

        <View style={styles.rightContainer}>
          {!isSearchVisible && (
            <TouchableOpacity
              style={styles.plusIcon}
              onPress={() => navigation.navigate('BeforeOrder')}
            >
              <Plus size={24} color="#1E1F24" />
            </TouchableOpacity>
          )}
          {!isSearchVisible && (
            <TouchableOpacity onPress={() => setIsSearchVisible(true)}>
              <Search size={24} color="#1E1F24" />
            </TouchableOpacity>
          )}
        </View>
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
        <Text style={styles.totalText}>Total Orders: {ordersData[activeTab].length}</Text>
        <Text style={styles.totalText}>Total Qty: {totalQuantity}</Text>
      </View>
      <ScrollView style={styles.listContainer}>
        {filteredOrders.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.orderCard}
            // onPress={() => handleOrderPress(item)}
            onPress={() => navigation.navigate("OrderDetails", { order: item })}
          >

<View style={styles.orderInfo}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text style={styles.orderName}>{item.name}</Text>
    {/* {activeTab === "Production" && (
      <Text style={styles.productionTime}>
        Production Time: {calculateProcessingTime(item.quantity)}
      </Text>
    )} */}
  </View>

  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.orderPhone}>{item.phone}</Text>
                {activeTab === "Defected" ? (
                  <Text style={styles.orderPhone1}>Defected: {item.defected}</Text>
                ) : (
                  <Text style={styles.orderPhone2}>Delivery Date: {item.deliverydate}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.065, 
    backgroundColor: '#FFF',    
  },
  headerText: {
    fontSize: width * 0.05, 
    color: '#1E1F24',
    fontFamily:'Lato-Bold',
    textAlign: 'center',
    flex: 1, 
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 4,
    paddingHorizontal: width * 0.03,
    borderColor: '#CECECE',
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: '#202020',
    fontFamily: 'Lato-Regular',
    marginLeft: width * 0.02,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.04, 
  },
  plusIcon: {
    marginRight: width * 0.01, 
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
  orderPhone: { fontSize: 14, color: "#838383" ,fontFamily: 'Lato-Regular'},
  orderPhone1: { fontSize: 14, color: "#E5484D" ,fontFamily: 'Lato-Regular'},
  orderPhone2: { fontSize: 14, color: "#838383" ,fontFamily: 'Lato-Regular'},
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
  productionTime: {
    fontSize: 14,
    color: "#1B2F2E",
    marginTop: 8,
  },
});

export default Order;