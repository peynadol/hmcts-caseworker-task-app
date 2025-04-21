import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { TaskSchema } from "../../schemas/task";
import { apiClient } from "../src/api";

function CreateTaskForm({ onSubmit }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDate, setTaskDate] = useState({ day: "", month: "", year: "" });
  const [taskStatus, setTaskStatus] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // Add validation state
  const [errors, setErrors] = useState({
    title: "",
    date: "",
  });

  // Form validation using Zod
  const validateForm = React.useCallback(() => {
    const newErrors = {
      title: "",
      date: "",
    };

    // Title validation
    const titleSchema = z.string().min(1, "Task title is required");
    const titleResult = titleSchema.safeParse(taskTitle);
    if (!titleResult.success) {
      newErrors.title = titleResult.error.errors[0].message;
    }

    // Date validation
    if (taskDate.day && taskDate.month && taskDate.year) {
      try {
        // Create date schema
        const dateSchema = z.date().refine(
          (date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
          },
          { message: "Task date cannot be in the past" }
        );

        // Parse and validate the date
        const dateStr = `${taskDate.year}-${taskDate.month}-${taskDate.day}`;
        const dateObj = new Date(dateStr);

        // First check if it's a valid date
        if (isNaN(dateObj.getTime())) {
          newErrors.date = "Please enter a valid date";
        } else {
          // Then use the schema to validate if it's not in the past
          const dateResult = dateSchema.safeParse(dateObj);
          if (!dateResult.success) {
            newErrors.date = dateResult.error.errors[0].message;
          }
        }
      } catch {
        newErrors.date = "Please enter a valid date";
      }
    }

    setErrors(newErrors);

    // Return whether the form is valid
    return !newErrors.title && !newErrors.date;
  }, [taskTitle, taskDate]);

  // Validate form on any field change
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    const isValid = validateForm();

    // Check if form is valid and all required fields are filled
    if (
      !isValid ||
      !taskStatus ||
      !taskDate.day ||
      !taskDate.month ||
      !taskDate.year
    ) {
      return;
    }

    // convert to db friendly string
    const formattedDate = new Date(
      `${taskDate.year}-${taskDate.month}-${taskDate.day}`
    ).toISOString();

    const statusMapping = {
      "Not Started": 0,
      Completed: 1,
      "In Progress": 2,
    };

    const task = {
      title: taskTitle,
      description: taskDescription || null,
      status: statusMapping[taskStatus],
      due_date: formattedDate,
    };

    const result = TaskSchema.safeParse(task);

    if (!result.success) {
      alert(result.error.errors[0].message);
      return;
    }

    console.log(task);
    try {
      const response = await apiClient.post("/tasks", result.data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      onSubmit(response.data);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Task Title */}
      <div
        className={`govuk-form-group ${
          errors.title ? "govuk-form-group--error" : ""
        }`}
      >
        <h1 className="govuk-label-wrapper">
          <label className="govuk-label govuk-label--l" htmlFor="task-title">
            Task Title
          </label>
        </h1>
        {errors.title && (
          <span id="task-title-error" className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.title}
          </span>
        )}
        <input
          className={`govuk-input ${errors.title ? "govuk-input--error" : ""}`}
          id="task-title"
          name="taskTitle"
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          aria-describedby={errors.title ? "task-title-error" : ""}
        />
      </div>

      {/* Task Date */}
      <div
        className={`govuk-form-group ${
          errors.date ? "govuk-form-group--error" : ""
        }`}
      >
        <h1 className="govuk-label-wrapper">
          <label className="govuk-label govuk-label--l" htmlFor="task-date">
            Task Date
          </label>
        </h1>
        {errors.date && (
          <span id="task-date-error" className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {errors.date}
          </span>
        )}
        <div className="govuk-date-input" id="task-date">
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label
                className="govuk-label govuk-date-input__label"
                htmlFor="task-day"
              >
                Day
              </label>
              <input
                className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                  errors.date ? "govuk-input--error" : ""
                }`}
                id="task-day"
                name="task-day"
                type="text"
                inputMode="numeric"
                value={taskDate.day}
                onChange={(e) =>
                  setTaskDate({ ...taskDate, day: e.target.value })
                }
                aria-describedby={errors.date ? "task-date-error" : ""}
              />
            </div>
          </div>
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label
                className="govuk-label govuk-date-input__label"
                htmlFor="task-month"
              >
                Month
              </label>
              <input
                className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                  errors.date ? "govuk-input--error" : ""
                }`}
                id="task-month"
                name="task-month"
                type="text"
                inputMode="numeric"
                value={taskDate.month}
                onChange={(e) =>
                  setTaskDate({ ...taskDate, month: e.target.value })
                }
                aria-describedby={errors.date ? "task-date-error" : ""}
              />
            </div>
          </div>
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              <label
                className="govuk-label govuk-date-input__label"
                htmlFor="task-year"
              >
                Year
              </label>
              <input
                className={`govuk-input govuk-date-input__input govuk-input--width-4 ${
                  errors.date ? "govuk-input--error" : ""
                }`}
                id="task-year"
                name="task-year"
                type="text"
                inputMode="numeric"
                value={taskDate.year}
                onChange={(e) =>
                  setTaskDate({ ...taskDate, year: e.target.value })
                }
                aria-describedby={errors.date ? "task-date-error" : ""}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Task Status */}
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
            <h1 className="govuk-fieldset__heading">Task Status</h1>
          </legend>
          <div className="govuk-radios" data-module="govuk-radios">
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="status-not-started"
                name="status"
                type="radio"
                value="Not Started"
                checked={taskStatus === "Not Started"}
                onChange={() => setTaskStatus("Not Started")}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor="status-not-started"
              >
                Not Started
              </label>
            </div>
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="status-in-progress"
                name="status"
                type="radio"
                value="In Progress"
                checked={taskStatus === "In Progress"}
                onChange={() => setTaskStatus("In Progress")}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor="status-in-progress"
              >
                In Progress
              </label>
            </div>
            <div className="govuk-radios__item">
              <input
                className="govuk-radios__input"
                id="status-completed"
                name="status"
                type="radio"
                value="Completed"
                checked={taskStatus === "Completed"}
                onChange={() => setTaskStatus("Completed")}
              />
              <label
                className="govuk-label govuk-radios__label"
                htmlFor="status-completed"
              >
                Completed
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      {/* Task Description (Optional) */}
      <div className="govuk-form-group">
        <h1 className="govuk-label-wrapper">
          <label
            className="govuk-label govuk-label--l"
            htmlFor="task-description"
          >
            Task Description (Optional)
          </label>
        </h1>
        <textarea
          className="govuk-textarea"
          id="task-description"
          name="taskDescription"
          rows="5"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="govuk-form-group">
        <button className="govuk-button" type="submit">
          Create Task
        </button>
      </div>
    </form>
  );
}

export default CreateTaskForm;
