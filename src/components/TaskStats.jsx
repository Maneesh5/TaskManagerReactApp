import React, { lazy, useMemo } from 'react';


// Lazy loaded component for task statistics
  const TaskStats = lazy(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: React.memo(({ tasks }) => {
          const stats = useMemo(() => {
            const total = tasks.length;
            const completed = tasks.filter(task => task.completed).length;
            const pending = total - completed;
            const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

            return { total, completed, pending, completionRate };
          }, [tasks]);

            return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-400 via-blue-200 to-blue-100 p-4 rounded-xl text-center shadow-none border border-blue-100">
              <div className="text-2xl font-bold text-blue-800">{stats.total}</div>
              <div className="text-sm text-blue-900">Total Tasks</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 via-green-200 to-green-100 p-4 rounded-xl text-center shadow-none border border-green-100">
              <div className="text-2xl font-bold text-green-800">{stats.completed}</div>
              <div className="text-sm text-green-900">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-50 p-4 rounded-xl text-center shadow-none border border-yellow-100">
              <div className="text-2xl font-bold text-yellow-700">{stats.pending}</div>
              <div className="text-sm text-yellow-800">Pending</div>
              </div>
              <div className="bg-gradient-to-br from-purple-400 via-purple-200 to-purple-100 p-4 rounded-xl text-center shadow-none border border-purple-100">
              <div className="text-2xl font-bold text-purple-800">{stats.completionRate}%</div>
              <div className="text-sm text-purple-900">Completion</div>
              </div>
            </div>
            );
        })
      });
    }, 1000); // Simulate loading delay
  });
});

export default TaskStats;