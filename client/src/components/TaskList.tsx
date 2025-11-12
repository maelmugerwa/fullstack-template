import { Task } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (task: { id: string; title: string; description?: string }) => void;
}

const TaskList = ({ tasks, loading, onToggle, onDelete, onEdit }: TaskListProps) => {
  if (loading) {
    return (
      <div className="task-list-loading">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>📝 No tasks yet. Create your first task above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TaskList;