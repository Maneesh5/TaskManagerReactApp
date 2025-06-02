import React from 'react';

import { useState, useEffect } from 'react';
import { useRef, useCallback } from 'react';
import { Plus } from 'lucide-react'; // Importing Plus icon from lucide-react
// Task Form Component with controlled inputs
const TaskForm = React.memo(({ onAddTask }) => {
const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('personal');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus;
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask({
        title: title.trim(),
        priority,
        category,
        completed: false,
        createdAt: new Date().toISOString()
      });
      setTitle('');
      inputRef.current?.focus();
    }
  }, [title, priority, category, onAddTask]);

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6 rounded-2xl shadow-xl border border-blue-200/40 backdrop-blur-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
        </select>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>
    </div>
  );
});

export default TaskForm;