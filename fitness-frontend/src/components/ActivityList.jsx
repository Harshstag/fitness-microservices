// src/components/ActivityList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllActivities, deleteActivity } from "../service/activity-service";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AccessTime,
  LocalFireDepartment,
  DirectionsRun,
} from "@mui/icons-material";

const ActivityList = ({ refreshTrigger }) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    activityId: null,
  });

  useEffect(() => {
    fetchActivities();
  }, [refreshTrigger]);

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllActivities();
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const { activityId } = deleteDialog;
    try {
      await deleteActivity(activityId);
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
      setDeleteDialog({ open: false, activityId: null });
    } catch (err) {
      console.error("Error deleting activity:", err);
      setError("Failed to delete activity. Please try again.");
    }
  };

  const openDeleteDialog = (activityId) => {
    setDeleteDialog({ open: true, activityId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, activityId: null });
  };

  const handleViewDetails = (activityId) => {
    navigate(`/activities/${activityId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityColor = (type) => {
    const colors = {
      RUNNING: "error",
      CYCLING: "success",
      SWIMMING: "info",
      WALKING: "secondary",
      YOGA: "primary",
      STRENGTH_TRAINING: "default",
      HIIT: "warning",
      DANCE: "secondary",
      PILATES: "info",
      ROWING: "primary",
    };
    return colors[type] || "default";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (activities.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <DirectionsRun sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No activities yet
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Start logging your fitness activities above!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Recent Activities
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {activities.length}{" "}
          {activities.length === 1 ? "activity" : "activities"} logged
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {activities.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card
              elevation={2}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={2}
                >
                  <Chip
                    label={activity.type.replace(/_/g, " ")}
                    color={getActivityColor(activity.type)}
                    size="small"
                  />
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(activity.id)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => openDeleteDialog(activity.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {formatDate(activity.startTime)}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <AccessTime
                      sx={{ fontSize: 18, mr: 1, color: "primary.main" }}
                    />
                    <Typography variant="body2">
                      <strong>{activity.duration}</strong> minutes
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <LocalFireDepartment
                      sx={{ fontSize: 18, mr: 1, color: "error.main" }}
                    />
                    <Typography variant="body2">
                      <strong>{activity.caloriesBurned}</strong> calories
                    </Typography>
                  </Box>
                </Box>

                {activity.additionalMatrics &&
                  Object.keys(activity.additionalMatrics).length > 0 && (
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        gutterBottom
                      >
                        Additional Metrics
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {Object.entries(activity.additionalMatrics).map(
                          ([key, value]) => (
                            <Chip
                              key={key}
                              label={`${key}: ${value}`}
                              size="small"
                              variant="outlined"
                            />
                          )
                        )}
                      </Box>
                    </Box>
                  )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Activity</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this activity? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActivityList;
