// src/components/ActivityForm.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createActivity } from "../service/activity-service";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Grid,
  IconButton,
  Collapse,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  FitnessCenter,
  DirectionsRun,
  DirectionsBike,
  Pool,
  DirectionsWalk,
  SelfImprovement,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const ACTIVITY_TYPES = [
  "RUNNING",
  "CYCLING",
  "SWIMMING",
  "WALKING",
  "YOGA",
  "STRENGTH_TRAINING",
  "HIIT",
  "DANCE",
  "PILATES",
  "ROWING",
];

const ActivityForm = ({ onActivityCreated }) => {
  const userId = useSelector((state) => state.auth.userId);

  const [formData, setFormData] = useState({
    userId: userId || "",
    type: "WALKING",
    duration: "",
    caloriesBurned: "",
    startTime: "",
    additionalMatrics: {
      distance: "",
      heartRate: "",
    },
  });

  const [showMetrics, setShowMetrics] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMetricChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      additionalMatrics: {
        ...prev.additionalMatrics,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestBody = {
      userId: formData.userId,
      type: formData.type,
      duration: parseInt(formData.duration),
      caloriesBurned: parseInt(formData.caloriesBurned),
      startTime: formData.startTime,
      additionalMatrics: {
        ...(formData.additionalMatrics.distance && {
          distance: formData.additionalMatrics.distance,
        }),
        ...(formData.additionalMatrics.heartRate && {
          heartRate: parseInt(formData.additionalMatrics.heartRate),
        }),
      },
    };

    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    try {
      const response = await createActivity(requestBody);
      console.log("Activity created:", response);

      setSnackbar({
        open: true,
        message: "Activity logged successfully!",
        severity: "success",
      });

      // Reset form
      setFormData({
        userId: userId || "",
        type: "WALKING",
        duration: "",
        caloriesBurned: "",
        startTime: "",
        additionalMatrics: {
          distance: "",
          heartRate: "",
        },
      });
      setShowMetrics(false);

      // Notify parent component
      if (onActivityCreated) {
        onActivityCreated();
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      setSnackbar({
        open: true,
        message: "Failed to log activity. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <FitnessCenter sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            Log New Activity
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Activity Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                {ACTIVITY_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Calories Burned"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                onClick={() => setShowMetrics(!showMetrics)}
                endIcon={showMetrics ? <ExpandLess /> : <ExpandMore />}
                sx={{ textTransform: "none" }}
              >
                {showMetrics ? "Hide" : "Add"} Additional Metrics
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Collapse in={showMetrics}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Distance (e.g., 5km)"
                      name="distance"
                      value={formData.additionalMatrics.distance}
                      onChange={handleMetricChange}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Heart Rate (bpm)"
                      name="heartRate"
                      value={formData.additionalMatrics.heartRate}
                      onChange={handleMetricChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>
              </Collapse>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                {loading ? "Logging Activity..." : "Log Activity"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ActivityForm;
