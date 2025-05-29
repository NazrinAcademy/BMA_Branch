import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { getQcProfile } from './apiService';

export const ProtectedRouteQc = ({ children, allowedRoles }) => {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQcProfile = async () => {
            try {
                const profileData = await getQcProfile()
                console.log('profileData', profileData); // Debugging log
                
                // setUserRole(profileData.Admins.role); // Store only role
                
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQcProfile();
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


