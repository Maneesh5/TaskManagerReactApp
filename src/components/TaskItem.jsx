import React, { useState, useContext, useCallback } from 'react';
import { ThemeContext } from '../context/Themecontext';
import { Edit, Check, X, Trash2 } from 'react-feather';



// Individual Task Item Component
const TaskItem = React.memo(({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const { isDark } = useContext(ThemeContext);

  const handleEdit = useCallback(() => {
    if (isEditing && editTitle.trim() !== task.title) {
      onUpdate(task.id, { title: editTitle.trim() });
    }
    setIsEditing(!isEditing);
  }, [isEditing, editTitle, task.title, task.id, onUpdate]);

  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500'
  };

  const categoryColors = {
    personal: 'bg-blue-100 text-blue-800',
    work: 'bg-purple-100 text-purple-800',
    shopping: 'bg-green-100 text-green-800',
    health: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`bg-white border-l-4 ${priorityColors[task.priority]} p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow ${isDark ? 'bg-gray-800 text-white' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => onToggle(task.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md border-2 ${
              task.completed
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-400 border-gray-300 hover:border-green-500'
            }`}
          >
            {task.completed && <Check size={20} />}
          </button>
          
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit();
                if (e.key === 'Escape') {
                  setEditTitle(task.title);
                  setIsEditing(false);
                }
              }}
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[task.category]}`}>
            {task.category}
          </span>
          
          <button
            onClick={handleEdit}
            className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
          >
            {isEditing ? <Check size={16} /> : <Edit size={16} />}
          </button>
          
          {isEditing && (
            <button
              onClick={() => {
                setEditTitle(task.title);
                setIsEditing(false);
              }}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-500 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
});


export default TaskItem;