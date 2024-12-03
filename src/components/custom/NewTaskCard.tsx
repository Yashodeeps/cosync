import { Calendar, AlertCircle, X, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface newTaskForm {
  newTaskForm: {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleAddTask: (columnIndex: number) => void;
  resetForm: () => void;
  columnIndex: number;
  isLoading?: boolean;
}

const NewTaskCard = ({
  newTaskForm,
  isLoading,
  handleInputChange,
  handleAddTask,
  resetForm,
  columnIndex,
}: newTaskForm) => {
  return (
    <div className="relative bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-700/50 transition-all duration-200 hover:shadow-xl">
      <div className="absolute top-1 right-1">
        <button
          onClick={resetForm}
          className="p-1 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Title Section */}
      <div className="mb-1">
        <input
          type="text"
          name="title"
          value={newTaskForm.title}
          onChange={handleInputChange}
          placeholder="Task title"
          className="w-full bg-gray-900/50 text-white rounded-md px-3 py-2 text-sm font-medium 
                   border border-gray-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 
                   placeholder-gray-400 transition-all duration-200
                   focus:outline-none"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask(columnIndex);
            } else if (e.key === "Escape") {
              resetForm();
            }
          }}
        />
      </div>

      <div className="mb-1">
        <textarea
          name="description"
          value={newTaskForm.description}
          onChange={handleInputChange}
          placeholder="Any Description?"
          rows={2}
          className="w-full bg-gray-900/50 text-white rounded-md px-3 py-2 text-sm
                   border border-gray-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50
                   placeholder-gray-400 transition-all duration-200 resize-none
                   focus:outline-none"
        />
      </div>

      <div className="hidden">
        <div className="mb-1 ">
          <div className="flex items-center gap-2 text-gray-400 mb-1.5 text-xs">
            <Calendar size={14} />
            <span className="text-gray-400 text-xs">Due</span>
          </div>
          <input
            type="date"
            name="dueDate"
            value={newTaskForm.dueDate}
            onChange={handleInputChange}
            className="w-full bg-gray-900/50 text-white rounded-md px-3 py-2 text-xs
                   border border-gray-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50
                   transition-all duration-200
                   focus:outline-none"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-400 mb-1.5 text-xs">
            <AlertCircle size={14} />
            <span>Priority</span>
          </div>
          <select
            name="priority"
            value={newTaskForm.priority}
            onChange={handleInputChange}
            className="w-full bg-gray-900/50 text-white rounded-md px-3 py-2 text-xs
                   border border-gray-700/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50
                   transition-all duration-200
                   focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={resetForm}
          className="px-3 py-1.5 rounded-md text-sm font-medium
                   text-gray-400 hover:text-white
                   hover:bg-gray-700/50
                   transition-all duration-200"
        >
          Cancel
        </button>
        <button
          onClick={() => handleAddTask(columnIndex)}
          className="px-3 py-1.5 rounded-md text-sm font-medium
                   bg-blue-600/80 hover:bg-blue-500
                   text-white
                   transition-all duration-200 flex gap-3"
        >
          Add{" "}
        </button>
      </div>
    </div>
  );
};

export default NewTaskCard;
