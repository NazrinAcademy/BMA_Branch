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
  CircleChevronDown,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllProduction, getAllQc, getAllSales } from '../../Utils/apiService';

const { width, height } = Dimensions.get('window');

const Member = () => {
  const [activeTab, setActiveTab] = useState('Sales Man');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [previousSearches, setPreviousSearches] = useState([]);
  const [data, setData] = useState({
    'Sales Man': [],
    'Production': [],
    'Logistics': [],
  });

  const navigation = useNavigation();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // ✅ Fetch Sales Data
        const resultsales = await getAllSales();
        console.log('Raw Sales API Response:', resultsales);
  
        if (resultsales.data) {
          const salesMen = resultsales.data.filter((user) => user.role === 'sales');
          setData((prevData) => ({
            ...prevData,
            'Sales Man': salesMen,
          }));
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
  
      try {
        // ✅ Fetch Production Data
        const resultproduction = await getAllProduction();
        console.log('Raw Production API Response:', resultproduction);
  
        if (resultproduction.data) {
          const production = resultproduction.data.filter((user) => user.role === 'production');
          setData((prevData) => ({
            ...prevData,
            'Production': production,
          }));
        }
      } catch (error) {
        console.error('Error fetching production data:', error);
      }
  
      try {
        // ✅ Fetch QC Data
        const resultqc = await getAllQc();
        console.log("Raw QC API Response:", resultqc);
  
        if (resultqc.data) {
          const qc = resultqc.data.filter((user) => user.role === 'qc');
          setData((prevData) => ({
            ...prevData,
            'Logistics': qc,
          }));
        }
      } catch (error) {
        console.error('Error fetching QC data:', error);
      }
    };
  
    fetchSales();
  }, []);
  
  

  const handleSearch = (text) => {
    setSearchText(text);
    if (!previousSearches.includes(text.toLowerCase()) && text.trim() !== '') {
      setPreviousSearches((prev) => [...prev, text.toLowerCase()]);
    }
  };

  const getFilteredData = () => {
    if (!searchText.trim()) return data[activeTab];

    return data[activeTab].filter(
      (member) =>
        member.name.toLowerCase().includes(searchText.toLowerCase()) ||
        member.email.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // const renderMember = ({ item }) => {
  //   console.log("Navigating with:", item);
  //   if (!item || !item._id) {
  //     console.error("Error: Missing item data in navigation!");
  //     return;
  //   }
  //   else{
  //     console.log("successs");
      
  //   }
  const renderMember = ({ item }) => {
    if (!item) {
      console.error("Invalid member data");
      return null;
    }
  
  
    return (
      <TouchableOpacity
      style={styles.memberCard}
      onPress={() =>
        navigation.navigate("UpdateMember", {
          member: {
            _id: item._id || "",
            name: item.name || "",
            email: item.email || "",
            phonenumber: item.phonenumber || "",
            role: item.role || "Sales Man",
          },
        })
      }
    >
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.memberEmail}>{item.email}</Text>
        </View>
        <CircleChevronDown size={24} color="#333" />
      </TouchableOpacity>
    );
  };
  

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
              placeholderTextColor={"#838383"}
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
        {['Sales Man', 'Production', 'Logistics'].map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTab,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getFilteredData()}
        renderItem={renderMember}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.memberList}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('addmember')}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    justifyContent: "space-around",
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

export default Member;
