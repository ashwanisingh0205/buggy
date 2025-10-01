// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  apiCallTime: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        }
      });
      
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch {
        console.warn('Long task observer not supported');
      }

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as { hadRecentInput?: boolean; value?: number };
          if (layoutShiftEntry.hadRecentInput) continue;
          if (layoutShiftEntry.value && layoutShiftEntry.value > 0.1) {
            console.warn(`Layout shift detected: ${layoutShiftEntry.value}`);
          }
        }
      });

      try {
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch {
        console.warn('Layout shift observer not supported');
      }
    }
  }

  // Measure API call performance
  measureApiCall<T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> {
    const startTime = performance.now();
    
    return apiCall().then(
      (result) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.metrics.push({
          loadTime: 0,
          renderTime: 0,
          apiCallTime: duration
        });

        if (duration > 1000) {
          console.warn(`Slow API call: ${endpoint} took ${duration}ms`);
        }

        return result;
      },
      (error) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.error(`API call failed: ${endpoint} after ${duration}ms`, error);
        throw error;
      }
    );
  }

  // Measure component render time
  measureRender<T>(renderFn: () => T, componentName: string): T {
    const startTime = performance.now();
    const result = renderFn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    this.metrics.push({
      loadTime: 0,
      renderTime: duration,
      apiCallTime: 0
    });

    if (duration > 16) { // More than one frame at 60fps
      console.warn(`Slow render: ${componentName} took ${duration}ms`);
    }

    return result;
  }

  // Get performance summary
  getSummary() {
    const totalMetrics = this.metrics.length;
    if (totalMetrics === 0) return null;

    const avgApiTime = this.metrics.reduce((sum, m) => sum + m.apiCallTime, 0) / totalMetrics;
    const avgRenderTime = this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / totalMetrics;
    const slowApiCalls = this.metrics.filter(m => m.apiCallTime > 1000).length;
    const slowRenders = this.metrics.filter(m => m.renderTime > 16).length;

    return {
      totalMetrics,
      avgApiTime: Math.round(avgApiTime),
      avgRenderTime: Math.round(avgRenderTime * 100) / 100,
      slowApiCalls,
      slowRenders,
      performanceScore: this.calculatePerformanceScore()
    };
  }

  private calculatePerformanceScore(): number {
    const slowApiRatio = this.metrics.filter(m => m.apiCallTime > 1000).length / this.metrics.length;
    const slowRenderRatio = this.metrics.filter(m => m.renderTime > 16).length / this.metrics.length;
    
    return Math.max(0, 100 - (slowApiRatio * 50) - (slowRenderRatio * 30));
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const measureApiCall = <T>(apiCall: () => Promise<T>, endpoint: string) => 
  performanceMonitor.measureApiCall(apiCall, endpoint);

export const measureRender = <T>(renderFn: () => T, componentName: string) => 
  performanceMonitor.measureRender(renderFn, componentName);

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
    };
  }
  return null;
};

// Debounce utility for performance
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
