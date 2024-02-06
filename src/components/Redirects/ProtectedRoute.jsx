import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/UserAuth";

export default function ProtectedRouteWrapper({ children }) {
  const { currentUser } = useAuth(); // Access the currentUser from the context

  // Check if the user is authenticated
  if (!currentUser) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children
  return children;
}
