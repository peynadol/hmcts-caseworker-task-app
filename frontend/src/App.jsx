import Header from "../components/Header"
import Title from "../components/Title"
import AddTaskButton from "../components/AddTaskButton"
import DeleteButton from "../components/DeleteButton"
import TaskTable from "../components/TaskTable"
import Modal from "../components/Modal"
import CreateTaskForm from "../components/CreateTaskForm"
import { useState, useEffect } from "react"
import axios from "axios"

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tasks, setTasks] = useState([])
  const [isDeleteMode, setIsDeleteMode] = useState(false)

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tasks")
        setTasks(response.data)
      } catch (err) {
        console.error("Unable to fetch tasks", err)
      }
    }
    getTasks()
  }, [])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleCreateTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task])
    closeModal()
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/tasks/${taskId}`)
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (err) {
      console.error("Unable to delete task", err)
    }
  }

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode)
  }


  return (
    <>
      <Header />
      <Title />
      <AddTaskButton onClick={openModal} />
      <DeleteButton onClick={toggleDeleteMode} isActive={isDeleteMode} />
      <TaskTable tasks={tasks}
        onDelete={handleDeleteTask}
        isDeleteMode={isDeleteMode}
        setIsDeleteMode={setIsDeleteMode}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <CreateTaskForm onSubmit={handleCreateTask} />
      </Modal>

    </>
  )
}

export default App
