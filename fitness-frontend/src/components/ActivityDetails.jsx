// src/components/ActivityDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getActivityById } from "../service/activity-service";
import { getRecommendationsByActivityId } from "../service/recommendation-service";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  AccessTime,
  LocalFireDepartment,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  Warning,
  DirectionsRun,
} from "@mui/icons-material";

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivityDetails();
  }, [id]);

  const fetchActivityDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const activityData = await getActivityById(id);
      setActivity(activityData);

      // Fetch recommendations for this activity
      try {
        const recommendationData = await getRecommendationsByActivityId(id);
        setRecommendation(recommendationData);
      } catch (recError) {
        console.log("No recommendations available for this activity");
      }
    } catch (err) {
      console.error("Error fetching activity details:", err);
      setError("Failed to load activity details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !activity) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/activities")}
          sx={{ mb: 2 }}
        >
          Back to Activities
        </Button>
        <Alert severity="error">{error || "Activity not found"}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/activities")}
        sx={{ mb: 3 }}
      >
        Back to Activities
      </Button>

      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <DirectionsRun sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
          <Box flexGrow={1}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              {activity.type.replace(/_/g, " ")}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {formatDate(activity.startTime)}
            </Typography>
          </Box>
          <Chip
            label={activity.type.replace(/_/g, " ")}
            color={getActivityColor(activity.type)}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <AccessTime color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Duration
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  {activity.duration} min
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocalFireDepartment color="error" sx={{ mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Calories
                  </Typography>
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  {activity.caloriesBurned}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {activity.additionalMatrics &&
            Object.entries(activity.additionalMatrics).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <TrendingUp color="success" sx={{ mr: 1 }} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {key}
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold">
                      {value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Created: {formatDate(activity.createdAt)}
          </Typography>
          {activity.updatedAt !== activity.createdAt && (
            <Typography variant="body2" color="text.secondary">
              Updated: {formatDate(activity.updatedAt)}
            </Typography>
          )}
        </Box>
      </Paper>

      {recommendation && (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            gutterBottom
          >
            AI Recommendations
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              {recommendation.recommendation}
            </Typography>
          </Box>

          {recommendation.improvements &&
            recommendation.improvements.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <TrendingUp sx={{ mr: 1, color: "success.main" }} />
                  Areas for Improvement
                </Typography>
                <List>
                  {recommendation.improvements.map((improvement, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={improvement} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

          {recommendation.suggestions &&
            recommendation.suggestions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Lightbulb sx={{ mr: 1, color: "warning.main" }} />
                  Suggestions
                </Typography>
                <List>
                  {recommendation.suggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Lightbulb color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

          {recommendation.safety && recommendation.safety.length > 0 && (
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Warning sx={{ mr: 1, color: "error.main" }} />
                Safety Tips
              </Typography>
              <List>
                {recommendation.safety.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Warning color="error" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            sx={{ mt: 2 }}
          >
            Recommendation generated on: {formatDate(recommendation.createdAt)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default ActivityDetails;
