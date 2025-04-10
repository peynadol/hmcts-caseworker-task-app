import React, { useState } from 'react';
import axios from "axios";

function CreateTaskForm({ onSubmit }) {
	const [taskTitle, setTaskTitle] = useState('');
	const [taskDate, setTaskDate] = useState({ day: '', month: '', year: '' });
	const [taskStatus, setTaskStatus] = useState('');
	const [taskDescription, setTaskDescription] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formattedDate = new Date(
			`${taskDate.year}-${taskDate.month}-${taskDate.day}`
		).toISOString();

		const statusMapping = {
			"Not Started": 0,
			"Completed": 1,
			"In Progress": 2,
		}

		const task = {
			title: taskTitle,
			description: taskDescription,
			status: statusMapping[taskStatus],
			due_date: formattedDate,
		};
		console.log(task)
		try {
			const response = await axios.post('http://localhost:3000/tasks', task, {
				headers: {
					"Content-Type": "application/json"
				}
			})
			onSubmit(response.data)
		} catch (error) {
			console.error('Error submitting task:', error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			{/* Task Title */}
			<div className="govuk-form-group">
				<h1 className="govuk-label-wrapper">
					<label className="govuk-label govuk-label--l" htmlFor="task-title">
						Task Title
					</label>
				</h1>
				<input
					className="govuk-input"
					id="task-title"
					name="taskTitle"
					type="text"
					value={taskTitle}
					onChange={(e) => setTaskTitle(e.target.value)}
				/>
			</div>

			{/* Task Date */}
			<div className="govuk-form-group">
				<h1 className="govuk-label-wrapper">
					<label className="govuk-label govuk-label--l" htmlFor="task-date">
						Task Date
					</label>
				</h1>
				<div className="govuk-date-input" id="task-date">
					<div className="govuk-date-input__item">
						<div className="govuk-form-group">
							<label className="govuk-label govuk-date-input__label" htmlFor="task-day">
								Day
							</label>
							<input
								className="govuk-input govuk-date-input__input govuk-input--width-2"
								id="task-day"
								name="task-day"
								type="text"
								inputMode="numeric"
								value={taskDate.day}
								onChange={(e) => setTaskDate({ ...taskDate, day: e.target.value })}
							/>
						</div>
					</div>
					<div className="govuk-date-input__item">
						<div className="govuk-form-group">
							<label className="govuk-label govuk-date-input__label" htmlFor="task-month">
								Month
							</label>
							<input
								className="govuk-input govuk-date-input__input govuk-input--width-2"
								id="task-month"
								name="task-month"
								type="text"
								inputMode="numeric"
								value={taskDate.month}
								onChange={(e) => setTaskDate({ ...taskDate, month: e.target.value })}
							/>
						</div>
					</div>
					<div className="govuk-date-input__item">
						<div className="govuk-form-group">
							<label className="govuk-label govuk-date-input__label" htmlFor="task-year">
								Year
							</label>
							<input
								className="govuk-input govuk-date-input__input govuk-input--width-4"
								id="task-year"
								name="task-year"
								type="text"
								inputMode="numeric"
								value={taskDate.year}
								onChange={(e) => setTaskDate({ ...taskDate, year: e.target.value })}
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
								checked={taskStatus === 'Not Started'}
								onChange={() => setTaskStatus('Not Started')}
							/>
							<label className="govuk-label govuk-radios__label" htmlFor="status-not-started">
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
								checked={taskStatus === 'In Progress'}
								onChange={() => setTaskStatus('In Progress')}
							/>
							<label className="govuk-label govuk-radios__label" htmlFor="status-in-progress">
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
								checked={taskStatus === 'Completed'}
								onChange={() => setTaskStatus('Completed')}
							/>
							<label className="govuk-label govuk-radios__label" htmlFor="status-completed">
								Completed
							</label>
						</div>
					</div>
				</fieldset>
			</div>

			{/* Task Description (Optional) */}
			<div className="govuk-form-group">
				<h1 className="govuk-label-wrapper">
					<label className="govuk-label govuk-label--l" htmlFor="task-description">
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
