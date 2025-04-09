import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import DrawerLayout from "react-native-gesture-handler/DrawerLayout";
import { Menu, User, Clock, Settings, LogOut, X } from "lucide-react-native";

export default function SidebarMenu() {
  const drawer = useRef(null);

  const toggleDrawer = () => {
   
    if (drawer.current.isDrawerOpen()) {
      drawer.current.closeDrawer();
    } else {
      drawer.current.openDrawer();
    }
  };

  const sidebar= () => (
    <View style={styles.sidebarContainer}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => drawer.current.closeDrawer()}
      >
        <X size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://via.placeholder.com/100", // Replace with your image URL
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Joseph Joy</Text>
        <Text style={styles.profileRole}>Admin</Text>
      </View>
      <View style={styles.menuItems}>
        <TouchableOpacity style={styles.menuItem}>
          <User size={20} color="#000" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Clock size={20} color="#000" />
          <Text style={styles.menuText}>Process Time</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} color="#000" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <LogOut size={20} color="#000" />
          <Text style={styles.menuText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <DrawerLayout
      ref={drawer}
      drawerWidth={250}
      drawerPosition="left"
      renderNavigationView={sidebarContent}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleDrawer}>
          <Menu size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Home Screen</Text>
      </View>
    </DrawerLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  profileRole: {
    fontSize: 14,
    color: "gray",
  },
  menuItems: {
    marginTop: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
