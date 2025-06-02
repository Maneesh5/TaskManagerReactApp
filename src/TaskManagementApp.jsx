import React, { useReducer, useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import TaskForm from './components/TaskForm';
import TaskStats from './components/TaskStats';
import TaskItem from './components/TaskItem';
import SearchFilter from './components/SearchFilter';
import TaskErrorBoundary from './components/Errorboundary';
import { ThemeContext } from './context/ThemeContext';
import { taskReducer } from './reducers/taskReducer';

// Main App Component
export default function TaskManagementApp() {
  // Using useReducer for complex state management
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    filter: 'all'
  });

  // Theme state using custom hook
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
          dispatch({ type: 'ADD_TASK', payload: task });
        });
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  // Filtered and searched tasks with useMemo for performance
  const filteredTasks = useMemo(() => {
    let filtered = state.tasks;

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        task.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply status/priority filter
    switch (state.filter) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'high':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      default:
        break;
    }

    // Sort by priority and creation date
    return filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [state.tasks, state.filter, debouncedSearch]);

  // Callback functions to prevent unnecessary re-renders
  const handleAddTask = useCallback((task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  }, []);

  const handleToggleTask = useCallback((id) => {
    dispatch({ type: 'TOGGLE_TASK', payload: id });
  }, []);

  const handleDeleteTask = useCallback((id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const handleUpdateTask = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id, updates } });
  }, []);

  const handleFilterChange = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <div
        className={`min-h-screen transition-colors bg-gradient-to-br from-blue-950 via-blue-800 via-60% to-cyan-700 bg-fixed`}
        style={{
          width: '100vw',
          boxShadow: '0 0 80px 10px #164e63 inset',
          backgroundImage: `url('${isDark ? '/dark_bg.jpg' : '/bg.jpg'}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="w-full px-4 py-8 max-w-full">
          {/* Header */}

          <div className="grid grid-cols-3 grid-rows-1 gap-4 mb-8">
            <div></div>
            <h1 className={`text-4xl font-bold text-center bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent ${isDark ? '' : ''}`}>
              Task Management
            </h1>
            <div className="flex justify-end">
              <button
                onClick={() => setIsDark(!isDark)}
                className="px-2 py-1 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {isDark ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>

          <TaskErrorBoundary>
            {/* Task Statistics with Suspense */}
            <Suspense fallback={
              <div className="bg-gradient-to-br from-blue-950 via-blue-800 via-60% to-cyan-700 p-8 rounded-2xl shadow-xl border border-blue-700/60 mb-6 animate-pulse">
                <div className="text-center text-blue-200">
                  Loading statistics...
                </div>
              </div>
            }>
              <TaskStats tasks={state.tasks} />
            </Suspense>

            {/* Task Form */}
            <TaskForm onAddTask={handleAddTask} />

            {/* Search and Filter */}
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filter={state.filter}
              onFilterChange={handleFilterChange}
            />

            {/* Task List */}
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {state.tasks.length === 0
                    ? "No tasks yet. Add your first task above!"
                    : "No tasks match your current filter."
                  }
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                  />
                ))
              )}
            </div>
          </TaskErrorBoundary>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
