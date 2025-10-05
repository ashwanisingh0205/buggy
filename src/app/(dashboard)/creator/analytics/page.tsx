// pages/analytics.tsx
'use client'
import React, { useState } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Menu } from 'lucide-react';
import CreatorLayout from '@/Components/Creater/CreatorLayout';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color, icon }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  // Sample data for charts
  const engagementData = {
    labels: [
      'Jan 02', 'Jan 06', 'Jan 07', 'Jan 09', 'Jan 11', 'Jan 15', 'Jan 17',
      'Jan 19', 'Jan 21', 'Jan 23', 'Jan 25', 'Jan 27', 'Jan 30'
    ],
    datasets: [
      {
        label: 'Likes',
        data: [180, 190, 185, 200, 210, 195, 205, 220, 230, 240, 235, 250, 260],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Comments',
        data: [45, 50, 48, 52, 55, 50, 58, 60, 62, 65, 63, 68, 70],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const platformData = {
    labels: ['Instagram', 'Facebook', 'TikTok', 'Twitter'],
    datasets: [
      {
        data: [45, 27, 16, 12],
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green  
          '#EF4444', // Red
          '#F59E0B', // Yellow
        ],
        borderWidth: 0,
      }
    ]
  };

  const postTypeData = {
    labels: ['Image', 'Video', 'Carousel', 'Story'],
    datasets: [
      {
        data: [520, 680, 540, 420],
        backgroundColor: '#3B82F6',
        borderRadius: 4,
      }
    ]
  };


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
// chart options with correct typing
const chartOptions: import("chart.js").ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 20,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#333",
      },
    },
    y: {
      grid: {
        display: true,
      },
      ticks: {
        color: "#333",
      },
    },
  },
};
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        grid: {
          color: '#F3F4F6',
        },
        beginAtZero: true,
      }
    }
  };

  return (
    <CreatorLayout 
      title="Analytics Dashboard" 
      subtitle="Track your content performance and engagement metrics"
    >
      {/* Page Title */}
      <h2 className="hidden md:block text-2xl font-bold mb-6">Analytics Overview</h2>

      {/* Date Range Selection */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border">
        <h3 className="text-sm font-medium mb-2">Data Range Selection</h3>
        <p className="text-xs text-gray-500 mb-3">Select the period for your analytics data</p>
        <button className="px-4 py-2 bg-gray-100 text-sm rounded-md border">
          📅 Last 30 Days
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <MetricCard
          title="Total Engagements"
          value="9,450"
          subtitle="+15% from last month"
          color="bg-green-100"
          icon={<span className="text-green-600">💬</span>}
        />
        <MetricCard
          title="Audience Growth"
          value="8,120"
          subtitle="+8% from last month"
          color="bg-blue-100"
          icon={<span className="text-blue-600">👥</span>}
        />
        <MetricCard
          title="Top Performing Post"
          value='"New Feature Launch"'
          subtitle="2.5K Likes, 840 Comments"
          color="bg-yellow-100"
          icon={<span className="text-yellow-600">⭐</span>}
        />
        <MetricCard
          title="Avg. Engagement Rate"
          value="4.2%"
          subtitle="+0.3% from last month"
          color="bg-purple-100"
          icon={<span className="text-purple-600">📊</span>}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6">
        {/* Engagement Trends */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Engagement Trends</h3>
            <p className="text-sm text-gray-500">Likes and comments over the last 30 days</p>
          </div>
          <div style={{ height: "250px" }} className="w-full">
            <Line data={engagementData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Platform Breakdown */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Platform Breakdown</h3>
            <p className="text-sm text-gray-500">Engagement distribution across social media platforms</p>
          </div>
          <div style={{ height: '200px' }} className="w-full">
            <Pie data={platformData} options={pieOptions} />
          </div>
        </div>

        {/* Post Type Performance */}
        <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm border">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Post Type Performance</h3>
            <p className="text-sm text-gray-500">Engagement by post content type</p>
          </div>
          <div style={{ height: '200px' }} className="w-full">
            <Bar data={postTypeData} options={barOptions} />
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
};

export default AnalyticsDashboard;