import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, Flame, TrendingUp, Plus, X } from 'lucide-react';

// Activity Service
const activityService = {
  baseURL: 'http://localhost:8084/api/activites',

  async getAll() {
    const response = await fetch(this.baseURL);
    if (!response.ok) throw new Error('Failed to fetch activities');
    return response.json();
  },

  async create(activity) {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    });
    if (!response.ok) throw new Error('Failed to create activity');
    return response.json();
  },

  async update(id, activity) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity)
    });
    if (!response.ok) throw new Error('Failed to update activity');
    return response.json();
  },

  async delete(id) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete activity');
  }
};

// ActivityForm Component
const ActivityForm = ({ onActivityAdded }) => {
  const [formData, setFormData] = useState({
    userId: 'ca81e18b-be79-401e-84e4-bd71ac545286',
    type: 'WALKING',
    duration: '',
    caloriesBurned: '',
    startTime: '',
    additionalMatrics: {
      distance: '',
      heartRate: ''
    }
  });

  const [showMetrics, setShowMetrics] = useState(false);

  const activityTypes = [
    'RUNNING', 'CYCLING', 'SWIMMING', 'WALKING', 'YOGA',
    'STRENGTH_TRAINING', 'HIIT', 'DANCE', 'PILATES', 'ROWING'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMetricChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      additionalMatrics: {
        ...prev.additionalMatrics,
        [name]: value
      }
    }));
  };

  const handleSubmit = async () => {
    const requestBody = {
      userId: formData.userId,
      type: formData.type,
      duration: parseInt(formData.duration),
      caloriesBurned: parseInt(formData.caloriesBurned),
      startTime: formData.startTime,
      additionalMatrics: {
        ...(formData.additionalMatrics.distance && { distance: formData.additionalMatrics.distance }),
        ...(formData.additionalMatrics.heartRate && { heartRate: parseInt(formData.additionalMatrics.heartRate) })
      }
    };

    console.log('Request Body:', JSON.stringify(requestBody, null, 2));

    try {
      await activityService.create(requestBody);
      onActivityAdded();
      setFormData({
        userId: 'ca81e18b-be79-401e-84e4-bd71ac545286',
        type: 'WALKING',
        duration: '',
        caloriesBurned: '',
        startTime: '',
        additionalMatrics: { distance: '', heartRate: '' }
      });
      setShowMetrics(false);
    } catch (error) {
      console.error('Error creating activity:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
          <Plus className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Log New Activity</h2>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {activityTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="60"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Calories Burned</label>
            <div className="relative">
              <Flame className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" size={20} />
              <input
                type="number"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleChange}
                placeholder="200"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowMetrics(!showMetrics)}
            className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors flex items-center gap-2"
          >
            <TrendingUp size={16} />
            {showMetrics ? 'Hide' : 'Add'} Additional Metrics
          </button>
        </div>

        {showMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Distance</label>
              <input
                type="text"
                name="distance"
                value={formData.additionalMatrics.distance}
                onChange={handleMetricChange}
                placeholder="5km"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Heart Rate (bpm)</label>
              <input
                type="number"
                name="heartRate"
                value={formData.additionalMatrics.heartRate}
                onChange={handleMetricChange}
                placeholder="120"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 mt-6"
        >
          Log Activity
        </button>
      </div>
    </div>
  );
};

// Activity Component
const ActivityCard = ({ activity, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityColor = (type) => {
    const colors = {
      RUNNING: 'from-red-500 to-orange-500',
      CYCLING: 'from-green-500 to-teal-500',
      SWIMMING: 'from-blue-500 to-cyan-500',
      WALKING: 'from-purple-500 to-pink-500',
      YOGA: 'from-indigo-500 to-purple-500',
      STRENGTH_TRAINING: 'from-gray-600 to-gray-800',
      HIIT: 'from-yellow-500 to-red-500',
      DANCE: 'from-pink-500 to-rose-500',
      PILATES: 'from-teal-500 to-green-500',
      ROWING: 'from-blue-600 to-indigo-600'
    };
    return colors[type] || 'from-gray-500 to-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`bg-gradient-to-br ${getActivityColor(activity.type)} p-3 rounded-lg`}>
            <Activity className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{activity.type.replace(/_/g, ' ')}</h3>
            <p className="text-sm text-gray-500">{formatDate(activity.startTime)}</p>
          </div>
        </div>
        <button
          onClick={() => onDelete(activity.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Clock size={16} />
            <span className="text-xs font-semibold">Duration</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{activity.duration} min</p>
        </div>

        <div className="bg-orange-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <Flame size={16} />
            <span className="text-xs font-semibold">Calories</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{activity.caloriesBurned}</p>
        </div>
      </div>

      {activity.additionalMatrics && Object.keys(activity.additionalMatrics).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">Additional Metrics</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(activity.additionalMatrics).map(([key, value]) => (
              <span key={key} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                {key}: <span className="font-semibold">{value}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ActivityList Component
const ActivityList = ({ activities, onDelete }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <Activity className="mx-auto text-gray-300 mb-4" size={64} />
        <h3 className="text-xl font-bold text-gray-400 mb-2">No Activities Yet</h3>
        <p className="text-gray-500">Start logging your fitness activities above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

// Main App Component
export default function FitnessApp() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const data = await activityService.getAll();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    try {
      await activityService.delete(id);
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Fitness Tracker
          </h1>
          <p className="text-gray-600">Track your activities and reach your fitness goals</p>
        </div>

        <ActivityForm onActivityAdded={fetchActivities} />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <ActivityList activities={activities} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}