'use client';

import React, { useState, useEffect } from 'react';
import { performanceMonitor, getMemoryUsage } from '@/lib/performance';
import { cacheUtils } from '@/lib/apiClient';

export const PerformanceDebugger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState<{
    totalMetrics: number;
    avgApiTime: number;
    avgRenderTime: number;
    slowApiCalls: number;
    slowRenders: number;
    performanceScore: number;
  } | null>(null);
  const [memory, setMemory] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    const updateStats = () => {
      setStats(performanceMonitor.getSummary());
      setMemory(getMemoryUsage());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Performance Debugger"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Performance Debugger</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {stats && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Performance Score:</span>
            <span className={`font-medium ${
              stats.performanceScore > 80 ? 'text-green-600' :
              stats.performanceScore > 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {stats.performanceScore}%
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Avg API Time:</span>
            <span>{stats.avgApiTime}ms</span>
          </div>
          
          <div className="flex justify-between">
            <span>Avg Render Time:</span>
            <span>{stats.avgRenderTime}ms</span>
          </div>
          
          <div className="flex justify-between">
            <span>Slow API Calls:</span>
            <span className={stats.slowApiCalls > 0 ? 'text-red-600' : 'text-green-600'}>
              {stats.slowApiCalls}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Slow Renders:</span>
            <span className={stats.slowRenders > 0 ? 'text-red-600' : 'text-green-600'}>
              {stats.slowRenders}
            </span>
          </div>
        </div>
      )}

      {memory && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="font-medium text-gray-700 mb-2">Memory Usage</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Used:</span>
              <span>{memory.used}MB</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{memory.total}MB</span>
            </div>
            <div className="flex justify-between">
              <span>Limit:</span>
              <span>{memory.limit}MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(memory.used / memory.limit) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200">
        <h4 className="font-medium text-gray-700 mb-2">Cache Stats</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Cache Entries:</span>
            <span>{cacheUtils.getStats().size}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => cacheUtils.clearAll()}
              className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
            >
              Clear Cache
            </button>
            <button
              onClick={() => {
                setStats(performanceMonitor.getSummary());
                setMemory(getMemoryUsage());
              }}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
