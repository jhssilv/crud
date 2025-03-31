import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        token: null
    });

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('authToken');
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (token && user) {
                setAuthState({
                    isAuthenticated: true,
                    user,
                    token
                });
            }
        };
        
        initializeAuth();
    }, []);

    const login = useCallback((userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        setAuthState({
            isAuthenticated: true,
            user: userData,
            token
        });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        setAuthState({
            isAuthenticated: false,
            user: null,
            token: null
        });
    }, []);

    const isAdmin = useCallback(() => {
        return authState.user?.is_admin || false;
    }, [authState.user]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated: authState.isAuthenticated,
            user: authState.user,
            token: authState.token,
            login,
            logout,
            isAdmin: isAdmin()
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;