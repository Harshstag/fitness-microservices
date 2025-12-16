// src/App.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { setCredentials } from "./store/authSlice";
import {
  Button,
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetails from "./components/ActivityDetails";

// Activities Page Component
const ActivitiesPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityCreated = () => {
    // Trigger refresh of activity list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ActivityForm onActivityCreated={handleActivityCreated} />
      <ActivityList refreshTrigger={refreshKey} />
    </Container>
  );
};

// Main App Component
function App() {
  const { token, logIn, logout, isAuthenticated, tokenData } =
    useContext(AuthContext);

  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <Box textAlign="center">
            <Typography variant="h3" gutterBottom fontWeight="bold">
              Fitness Tracker
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Track your activities and reach your fitness goals
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => {
                logIn();
              }}
              sx={{ px: 6, py: 1.5 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <AppBar position="sticky">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Fitness Tracker
              </Typography>
              <Button color="inherit" onClick={() => logout()}>
                Logout
              </Button>
            </Toolbar>
          </AppBar>

          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route
              path="/activities/:id"
              element={
                <Container maxWidth="lg" sx={{ py: 4 }}>
                  <ActivityDetails />
                </Container>
              }
            />
            <Route
              path="/"
              element={
                token ? <Navigate to="/activities" /> : <div>Please Login</div>
              }
            />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
