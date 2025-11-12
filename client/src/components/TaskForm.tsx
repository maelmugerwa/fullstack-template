import { useState, useEffect, FormEvent } from 'react';
import { CreateTaskDto } from '../types';

interface TaskFormProps {
  onSubmit: (data: CreateTaskDto) => Promise<void>;
  initialData?: { title: string; description?: string };
  onCancel?: () => void;
}

const TaskForm = ({ onSubmit, initialData, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when initialData changes
  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
  }, [initialData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
      });

      // Clear form only if not in edit mode
      if (!initialData) {
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="task-title">
          Title <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)..."
          disabled={isSubmitting}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Task' : 'Add Task'}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;