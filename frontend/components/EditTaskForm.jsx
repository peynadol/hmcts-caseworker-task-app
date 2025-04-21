import { useState, useEffect } from "react";
import axios from "axios";
import { apiClient } from "../src/api";

export default function EditTaskForm({ task, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: 0,
    due_date: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status ?? 0,
        due_date: task.due_date?.split("T")[0] || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.patch(`/tasks/${task.id}`, formData);
      onSubmit(response.data);
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="govuk-form-group">
      <h2 className="govuk-heading-m">Edit Task</h2>
      <label className="govuk-label">Title</label>
      <input
        id="edit-title-input"
        className="govuk-input"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label className="govuk-label">Description</label>
      <textarea
        id="edit-desc-input"
        className="govuk-textarea"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <label className="govuk-label">Status</label>
      <select
        id="edit-select"
        className="govuk-select"
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value={0}>Not Started</option>
        <option value={2}>In Progress</option>
        <option value={1}>Completed</option>
      </select>

      <label className="govuk-label">Due Date</label>
      <input
        id="edit-date"
        className="govuk-input"
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
      />

      <div className="govuk-button-group">
        <button type="submit" className="govuk-button">
          Save
        </button>
        <button
          type="button"
          className="govuk-button govuk-button--secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
