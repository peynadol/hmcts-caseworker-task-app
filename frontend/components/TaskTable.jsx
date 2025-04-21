import { useState } from "react";
import EditButton from "./EditButton";
import Modal from "./Modal";
import "../styles/DeleteMode.css";

export default function TaskTable({
  tasks,
  onDelete,
  isDeleteMode,
  setIsDeleteMode,
  onEdit,
}) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleTaskClick = (task) => {
    if (isDeleteMode) {
      setSelectedTask(task);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedTask) {
      onDelete(selectedTask.id);
      setSelectedTask(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setSelectedTask(null);
    setIsDeleteModalOpen(false);
    // Reset the delete mode here
    setIsDeleteMode(false);
  };

  return (
    <>
      {isDeleteMode && tasks.length === 0 && (
        <p className="govuk-body govuk-body--warning">
          There are no tasks to delete. Click 'Delete Task' to exit delete mode.
        </p>
      )}

      {isDeleteMode && tasks.length > 0 && (
        <p className="govuk-body">In delete mode - Select a task to delete.</p>
      )}

      <table className="govuk-table govuk-table--small-text-until-tablet">
        <caption className="govuk-table__caption govuk-table__caption--m">
          Tasks
        </caption>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" className="govuk-table__header">
              Title
            </th>
            <th scope="col" className="govuk-table__header">
              Description
            </th>
            <th scope="col" className="govuk-table__header">
              Status
            </th>
            <th scope="col" className="govuk-table__header">
              Due date
            </th>
            <th scope="col" className="govuk-table__header">
              Edit
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {tasks.map((task) => (
            <tr
              key={task.id}
              className={`govuk-table__row ${
                isDeleteMode ? "delete-mode" : ""
              } ${selectedTask?.id === task.id ? "selected" : ""}`}
              onClick={() => handleTaskClick(task)}
            >
              <th scope="row" className="govuk-table__header">
                {task.title}
              </th>
              <td className="govuk-table__cell">{task.description}</td>
              <td className="govuk-table__cell">
                {task.status === 0
                  ? "Not Started"
                  : task.status === 1
                  ? "Completed"
                  : "In Progress"}
              </td>
              <td className="govuk-table__cell">
                {new Date(task.due_date).toLocaleDateString()}
              </td>
              <td className="govuk-table__cell">
                <EditButton onClick={() => onEdit(task)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteCancel}>
          <h2 className="govuk-heading-m">Confirm Deletion</h2>
          <p className="govuk-body">
            You are about to delete: {selectedTask?.title}
          </p>
          <div className="govuk-button-group">
            <button
              className="govuk-button govuk-button--warning"
              onClick={handleDeleteConfirm}
              disabled={tasks.length === 0}
            >
              Confirm Delete
            </button>
            <button
              className="govuk-button govuk-button--secondary"
              onClick={handleDeleteCancel}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
