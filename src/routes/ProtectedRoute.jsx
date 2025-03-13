import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { route } from "./index"; // Adjust the import path as necessary
import PropTypes from "prop-types"; // Import PropTypes for type checking
import { selectUser } from "../Redux/features/counterSlice";
// import { selectUser } from "../Redux/features/counterSlice"; // Adjust the import path as necessary

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = useSelector(selectUser);

  // Check if the user is not logged in or doesn't have a valid role
  if (!user || !user.role || !user.role.roleName) {
    return <Navigate to={route.login} />;
  }

  // Ensure allowedRoles is an array and check if the user's roleName is in the allowedRoles array
  if (
    !Array.isArray(allowedRoles) ||
    !allowedRoles.includes(user.role.roleName)
  ) {
    return <Navigate to={route.home} />;
  }

  // If user has the required role, render the children components
  return children;
};

// Define PropTypes for type checking
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string), // Change to array of strings (role names)
};

export default ProtectedRoute;
