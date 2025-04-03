import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        token: null
    });

    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('authToken');
            const username = localStorage.getItem('username');
            
            if (token && username) {
                setAuthState({
                    isAuthenticated: true,
                    user: { username },
                    token
                });
            }
        };
        
        initializeAuth();
    }, []);

    const login = useCallback((userData, token) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', userData.username);
        
        setAuthState({
            isAuthenticated: true,
            user: userData,
            token
        });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        
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