import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        user: null,
        token: null,
        isAdmin: false
    });

    const logout = useCallback(() => {

        setAuthState({
            isAuthenticated: false,
            username: null,
            token: null,
            isAdmin: false
        });
    }, []);

    useEffect(() => {
        logout();
    }, [logout]);

    const login = useCallback(async (userData, token) => {
        
        setAuthState({
            isAuthenticated: true,
            username: userData.username,
            token,
            isAdmin: userData.isAdmin
        });
    }, []);

    return (
        <AuthContext.Provider value={{
            ...authState,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;