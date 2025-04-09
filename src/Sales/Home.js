

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Animated, Image, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Menu, Bell, CalendarDays, X, UserRound, TimerReset, Settings, LogOut, CircleUserRound, Palette } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const [activeTab, setActiveTab] = useState('Today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const sidebarAnimation = useState(new Animated.Value(-250))[0];
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState(104);
  const [production, setProduction] = useState(39);
  const [delivered, setDelivered] = useState(59);
  const [issue, setIssue] = useState(6);
  const [adminname, setAdminname] = useState('');

  const sidebarRef = useRef();
  const navigation = useNavigation();

  const updateData = (tab, date) => {
    if (tab === 'Today') {
      setOrders(104);
      setProduction(39);
      setDelivered(59);
      setIssue(6);
    } else if (tab === 'Weekly') {
      setOrders(500);
      setProduction(200);
      setDelivered(300);
      setIssue(50);
    } else if (tab === 'Monthly') {
      setOrders(2000);
      setProduction(1000);
      setDelivered(1500);
      setIssue(200);
    }
  };

  useEffect(() => {
    updateData(activeTab, selectedDate);
  }, [activeTab, selectedDate]);

  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [1, 15, 20, 25, 18, 22, 17],
        color: () => '#007BFF',
      },
      {
        data: [5, 10, 15, 20, 12, 18, 13],
        color: () => '#FF9900',
      },
      {
        data: [3, 8, 13, 18, 10, 15, 10],
        color: () => '#28A745',
      },
      {
        data: [1, 3, 5, 7, 4, 6, 3],
        color: () => '#DC3545',
      },
    ],
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const toggleSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: isSidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      Animated.timing(sidebarAnimation, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setIsSidebarOpen(false);
    }
  };

  const handleOutsidePress = () => {
    closeSidebar();
  };

  const navigateWithClose = (screen) => {
    closeSidebar();
    navigation.navigate(screen);
  };

  const SummaryCard = ({ title, value, status, arrowColor }) => {
    const Icon = status === "up" ? TrendingUp : TrendingDown;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.cardValueContainer}>
          <Text style={styles.cardValue}>{value}</Text>
          <Icon color={arrowColor} size={20} style={styles.icon} />
        </View>
        <Text style={styles.cardFooter}>Last 7 Days</Text>
      </View>
    );
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 1,
    propsForDots: {
      r: '4',
      strokeWidth: '1',
      stroke: '#07BAD1',
      fill: 'white',
    },
    propsForBackgroundLines: {
      strokeWidth: '1',
      stroke: '#e0e0e0',
      strokeDasharray: "0",
    },
    propsForLabels: {
      dx: 6, 
      dy: 7, 
    },
    style: {
      // borderRadius: 9,
      padding: 10,
    },
    paddingTop: 20, 
    paddingRight: 20, 
    paddingBottom: 0, 
    paddingLeft: 0, 
  };

  return (
    <View style={styles.container}>
      {/* Overlay that appears when sidebar is open */}
      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Sidebar */}
      <Animated.View
        ref={sidebarRef}
        style={[
          styles.sidebar,
          { transform: [{ translateX: sidebarAnimation }] },
        ]}
      >
        <View style={styles.sidebarContainer}>
          <View style={styles.profileSection}>
            <CircleUserRound style={styles.profileImage} />
            <Text style={styles.profileName}>{adminname} karan</Text>
            <Text style={styles.profileRole}>{adminname} SalesManager</Text>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity 
              style={styles.menuItem} 
              // onPress={() => navigateWithClose('Profile')}
            >
              <UserRound size={20} color="#000" />
              <Text style={styles.menuText}>Profile</Text>
            </TouchableOpacity>
          
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigateWithClose('Settings')}
            >
              <Settings size={20} color="#000" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <LogOut size={20} color="#000" />
              <Text style={styles.menuText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.headerContainer}>
          <View style={styles.leftContainer}>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.menu}>
                <Menu color="#1E1F24" />
              </Text>
            </TouchableOpacity>
            <Text style={styles.title}>Karan</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Text style={styles.notification}>
              <Bell size={24} color="black" />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.container1}>
          <View style={styles.tabs}>
            {['Today', 'Weekly', 'Monthly'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTab]}
                onPress={() => handleTabPress(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.date} onPress={showDatePicker}>
              <CalendarDays size={16} color="#BF8965" />
              <Text style={styles.dateText}>
                {selectedDate.toLocaleDateString('en-US', { day: '2-digit' })}
              </Text>

              <View style={styles.dateText1}>
                <Text style={styles.monthText}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'short' })}
                </Text>
                <Text style={styles.yearText}>
                  {selectedDate.toLocaleDateString('en-US', { year: 'numeric' })}
                </Text>
              </View>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.container2}>
            <View style={styles.row}>
              <SummaryCard
                title="Orders"
                value={orders}
                status="up"
                arrowColor="#007bff"
              />
              <SummaryCard
                title="Production"
                value={production}
                status="up"
                arrowColor="#D2691E"
              />
            </View>
            <View style={styles.row}>
              <SummaryCard
                title="Delivered"
                value={delivered}
                status="up"
                arrowColor="#3CB371"
              />
              <SummaryCard
                title="Issue"
                value={issue}
                status="down"
                arrowColor="#FF4500"
              />
            </View>
          </View>

          <LineChart
            data={data}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            bezier={false}
            withDots={true}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={true}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  mainContent: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 200,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 5,
  },
  sidebarContainer: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    color: '#000',
  },
  profileRole: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Lato-Regular',
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#000',
    fontFamily: 'Lato-Regular',
  },
  headerContainer: {
    height: height * 0.11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: width * 0.05,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    marginRight: 10,
    fontSize: 24,
    color: '#1E1F24',
  },
  title: {
    fontFamily: 'Lato-Bold',
    fontSize: 20,
    fontWeight: '600',
    color: '#1E1F24',
  },
  notification: {
    marginLeft: 10,
    fontSize: 24,
  },
  container1: {
    backgroundColor: 'white',
    paddingVertical: height * 0.01,
    justifyContent: 'space-evenly'
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: width * 0.9,
    height: height * 0.07,
    paddingHorizontal: width * 0.07,
    borderRadius: 10,
  },
  tabButton: {
    paddingVertical: height * 0.010,
    paddingHorizontal: width * 0.03,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: 'black',
  },
  tabText: {
    fontSize: width * 0.045,
    color: '#011006',
    fontFamily: 'Lato-Regular'
  },
  activeTabText: {
    fontFamily: 'Lato-Bold',
  },
  date: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: height * 0.01,
    marginRight: width*0.02,
  },
  dateText: {
    fontSize: width * 0.05,
    fontFamily: 'Lato-Bold',
    color: '#011006',
    // marginLeft: width*0.02,
    // marginRight: width*0.02,
    fontWeight: 'bold',
  },
  dateText1: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: width*0.02,

  },
  monthText: {
    fontSize: width * 0.035,
    color: '#011006',
  },
  yearText: {
    fontSize: width * 0.03,
    color: '#011006',
  },
  container2: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: height * 0.01,
    gap: width * 0.03,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.01,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: width * 0.03,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#202020",
    fontFamily: 'Lato-Bold',
    // lineHeight: 21,
    marginBottom: 10,
  },
  cardValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 20,
    color:"#000",
    fontFamily: 'Lato-Regular'
  },
  icon: {
    // marginLeft: 58,
    marginLeft:width*0.15,
  },
  cardFooter: {
    fontSize: 14,
    color: "#666",
     fontFamily: 'Lato-Regular'
  },
  chart: {
    marginVertical: height*0.030,
    borderRadius: 4,
    paddingRight: width * 0.1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F4F4F4',
  },
});

export default Home;