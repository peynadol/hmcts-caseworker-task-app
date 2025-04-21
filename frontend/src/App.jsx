import Header from "../components/Header";
import Title from "../components/Title";
import AddTaskButton from "../components/AddTaskButton";
import DeleteButton from "../components/DeleteButton";
import TaskTable from "../components/TaskTable";
import Modal from "../components/Modal";
import CreateTaskForm from "../components/CreateTaskForm";
import EditTaskForm from "../components/EditTaskForm";
import { useState, useEffect } from "react";
import { apiClient } from "./api";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await apiClient.get("/tasks");
        setTasks(response.data);
      } catch (err) {
        console.error("Unable to fetch tasks", err);
      }
    };
    getTasks();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleCreateTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
    closeModal();
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Unable to delete task", err);
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setTaskToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleTaskEdit = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    closeEditModal();
  };

  return (
    <>
      <Header />
      <Title />
      <AddTaskButton onClick={openModal} />
      <DeleteButton onClick={toggleDeleteMode} isActive={isDeleteMode} />
      <TaskTable
        tasks={tasks}
        onDelete={handleDeleteTask}
        isDeleteMode={isDeleteMode}
        setIsDeleteMode={setIsDeleteMode}
        onEdit={openEditModal}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateTaskForm onSubmit={handleCreateTask} />
      </Modal>

      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <EditTaskForm
            task={taskToEdit}
            onSubmit={handleTaskEdit}
            onCancel={closeEditModal}
          />
        </Modal>
      )}
    </>
  );
}

export default App;
