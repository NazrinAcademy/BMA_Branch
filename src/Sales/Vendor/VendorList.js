import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import {
  Plus,
  Search,
  ArrowLeft,
  CircleChevronRight,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const VendorList = () => {
  const [activeTab, setActiveTab] = useState('Vendor');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [previousSearches, setPreviousSearches] = useState([]);
  const navigation = useNavigation();

  const data = {
    Vendor: [
      {
        id: '1',
        shopname: 'ABC Store',
        vendorname: 'Kalaiyarasan',
        mobileno: '1234567890',
        address: '123 Main St',
        landmark: 'Near Park',
        area: 'Downtown',
        city: 'Chennai',
        pincode: '600001',
      },
      {
        id: '2',
        shopname: 'XYZ Mart',
        vendorname: 'Esakkiraj',
        mobileno: '9876543210',
        address: '456 Market Road',
        landmark: 'Opp. Hospital',
        area: 'Westside',
        city: 'Bangalore',
        pincode: '560002',
      },
      {
        id: '3',
        shopname: 'Super Bazar',
        vendorname: 'Niyas',
        mobileno: '1122334455',
        address: '789 Street Lane',
        landmark: 'Next to Mall',
        area: 'East End',
        city: 'Mumbai',
        pincode: '400003',
      },
    ],
    Production: [
      {
        id: '4',
        name: 'Vincy',
        email: 'vincy@12',
        phone: '2233445566',
        password: 'pass123',
      },
      {
        id: '5',
        name: 'Rajat',
        email: 'Rajat@123',
        phone: '3344556677',
        password: 'wordpass',
      },
    ],
    Logistics: [
      {
        id: '6',
        name: 'Ragul',
        email: 'ragul@12',
        phone: '5566778899',
        password: 'logipass',
      },
      {
        id: '7',
        name: 'Rajan',
        email: 'rajan@34',
        phone: '6677889900',
        password: 'logistic123',
      },
    ],
  };

  const handleSearch = (text) => {
    setSearchText(text);

    if (!previousSearches.includes(text.toLowerCase()) && text.trim() !== '') {
      setPreviousSearches((prev) => [...prev, text.toLowerCase()]);
    }
  };

  const getFilteredData = () => {
    if (!searchText.trim()) return data[activeTab];

    return data[activeTab].filter((member) =>
      activeTab === 'Vendor'
        ? member.shopname.toLowerCase().includes(searchText.toLowerCase()) ||
          member.mobileno.includes(searchText)
        : member.name.toLowerCase().includes(searchText.toLowerCase()) ||
          member.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  useEffect(() => {
    const totalUsers = Object.values(data).reduce(
      (total, members) => total + members.length,
      0
    );

    if (totalUsers === 0) {
      navigation.navigate('emptymember');
    }
  }, [data]);

  const renderMember = ({ item }) => (
    <TouchableOpacity
      style={styles.memberCard}
      onPress={() =>
        navigation.navigate('updatevendor', { member: item, role: activeTab })
      }
    >
      <View style={styles.memberInfo}>
        {activeTab === 'Vendor' ? (
          <>
            <Text style={styles.memberName}>{item.shopname}</Text>
            <Text style={styles.memberEmail}>{item.mobileno}</Text>
          </>
        ) : (
          <>
            <Text style={styles.memberName}>{item.name}</Text>
            <Text style={styles.memberEmail}>{item.email}</Text>
          </>
        )}
      </View>
      <CircleChevronRight size={24} color="#333" />
    </TouchableOpacity>
  );

  const handleArrowLeftClick = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchText('');
    } else {
      navigation.goBack();
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
              value={searchText}
              onChangeText={handleSearch}
              autoFocus
            />
          </View>
        ) : (
          <Text style={styles.headerTitle}>Member</Text>
        )}
        {!isSearchActive && (
          <TouchableOpacity onPress={() => setIsSearchActive(true)}>
            <Search size={24} color="#202020" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Vendor', 'Production', 'Logistics'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getFilteredData()}
        renderItem={renderMember}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.memberList}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
      />
      {activeTab === 'Vendor' && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('addshop')}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: width * 0.01,
    paddingVertical: height * 0.001,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
  },
  tabText: {
    fontSize: width * 0.045,
    color: '#838383',
    fontFamily: 'Lato-Regular',
  },
  activeTab: {
    color: '#1B2F2E',
    borderBottomWidth: 3,
    borderBottomColor: '#1B2F2E',
    paddingBottom: height * 0.01,
    borderRadius: 2,
    fontFamily: 'Lato-Bold',
    
  },
  memberList: {
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: width * 0.045,
    color: '#202020',
    fontFamily: 'Lato-Regular',
  },
  memberEmail: {
    fontSize: width * 0.04,
    color: '#838383',
    marginTop: height * 0.005,
    fontFamily: 'Lato-Regular',
  },
  addButton: {
    position: 'absolute',
    bottom: height * 0.03,
    right: width * 0.05,
    backgroundColor: '#1B2F2E',
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default VendorList;
