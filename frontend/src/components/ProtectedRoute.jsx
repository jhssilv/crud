import { useAuth } from './functions/useAuth.jsx'
import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

 //     PROTECTED ROUTE COMPONENT       \\
// used for blocking access before login \\

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;