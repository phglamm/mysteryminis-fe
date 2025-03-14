import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { route } from "./index"; // Adjust the import path as necessary
import PropTypes from "prop-types"; // Import PropTypes for type checking
import { selectUser } from "../Redux/features/counterSlice";

const ProtectedRoute = ({ children, roles = [] }) => {
  const user = useSelector(selectUser);

  // Check if the user is not logged in or doesn't have a roleId
  if (!user || typeof user.roleId !== "number") {
    return <Navigate to={route.login} />;
  }

  // Ensure roles is an array and check if the user's roleId is in the allowed roles array
  if (!Array.isArray(roles) || !roles.includes(user.roleId)) {
    return <Navigate to={route.home} />;
  }

  // If user has the required role, render the children components
  return children;
};

// Define PropTypes for type checking
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.number), // Change to array of numbers
};

export default ProtectedRoute;
