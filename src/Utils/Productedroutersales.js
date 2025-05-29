import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getSalesProfile } from './apiService';
const ProtectedRouteSales = ({ children, allowedRoles }) => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileData = await getSalesProfile();

                console.log('profileData:', profileData); // Debugging log
                
                if (!profileData || !profileData.Saless || !profileData.Saless.role) {
                    throw new Error('Invalid user profile response');
                }

                setUserRole(profileData.Saless.role); // ✅ Store role correctly
                console.log('User Role Set:', profileData.Saless.role);
                
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
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
export default ProtectedRouteSales