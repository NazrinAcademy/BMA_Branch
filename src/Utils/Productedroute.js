import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getUserProfile } from './apiService';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileData = await getUserProfile();
                console.log('profileData', profileData.Admins.role); // Debugging log
                
                setUserRole(profileData.Admins.role); // Store only role
                
            } catch (err) {
                
                  const admin=AsyncStorage.removeItem('adminToken')
       if(admin){
        console.log("Admin token cleared");

        navigation.navigate('Screen')

       }
            
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!userRole) {
        return <Text>You must be logged in to view this screen.</Text>;
    }

    // Check if user role is allowed
    const isRoleAllowed = allowedRoles ? allowedRoles.includes(userRole) : true;

    if (!isRoleAllowed) {
        return <Text>Unauthorized access.</Text>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
