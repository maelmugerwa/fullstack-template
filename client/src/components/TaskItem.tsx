import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: { id: string; title: string; description?: string }) => void;
}

const TaskItem = ({ task, onToggle, onDelete, onEdit }: TaskItemProps) => {
  const handleToggle = async () => {
    try {
      await onToggle(task.id);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleEdit = () => {
    onEdit({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
    });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
      </div>

      <div className="task-content">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
        <div className="task-timestamp">
          Created: {formatDate(task.createdAt)}
          {task.createdAt !== task.updatedAt && (
            <> · Updated: {formatDate(task.updatedAt)}</>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          className="btn btn-small btn-secondary"
          onClick={handleEdit}
          aria-label={`Edit "${task.title}"`}
        >
          Edit
        </button>
        <button
          className="btn btn-small btn-danger"
          onClick={handleDelete}
          aria-label={`Delete "${task.title}"`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;