import { useEffect, useState } from "react";
import { ShapaCard } from "../../components/common/shapeCard";
import { main_url } from "../../service";
import Loading from "../../components/common/loading";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/common/buttonComp";
import { SuccessToast } from "../../components/common/toastComp";
import { BASE_PATH } from "../../constant/constant";
import CreateTask from "../../components/createTask";
import { TaskInterface } from "../../interface/interface";
import EiditTask from "../../components/eiditTask";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskInterface[]>([]);
  const [filters, setFilters] = useState({
    date: "",
    completed: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await main_url.get(`/signle-user-task/${user?.id}`);
      console.log(resp.data.data);
      setTasks(resp.data.data);
      setFilteredTasks(resp.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    let updatedTasks = tasks;

    // Filter by due date
    if (filters.date) {
      updatedTasks = updatedTasks.filter((task) => {
        const taskDueDate = task.due_date;
        return taskDueDate === filters.date;
      });
    }

    // Filter by completion status
    if (filters.completed) {
      updatedTasks = updatedTasks.filter(
        (task) => task.status === filters.completed
      );
    }

    setFilteredTasks(updatedTasks);
  }, [filters, tasks]);

  const deleteTask = async (id: number) => {
    console.log("id", id);
    try {
      const resp = await main_url.delete(`/delete-post/${id}`);
      SuccessToast({
        message: resp.data?.message,
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
    SuccessToast({
      message: "Logged out successfully",
    });
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full md:max-w-5xl p-4">
        <div className="flex flex-col gap-2 sticky top-0 z-50 bg-white">
          <h1 className="text-3xl font-bold underline pt-2 sticky top-0 z-50">
            Tasks
          </h1>
          <div className="flex gap-4 md:flex-nowrap flex-wrap bg-white pt-4 items-center w-full justify-between">
            {/* Date filter */}
            <div className="flex gap-4 md:flex-nowrap flex-wrap bg-white pt-4 items-center">
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="border rounded-lg p-2 outline-none text-sm"
              />
              {/* Completion status filter */}
              <select
                name="completed"
                value={filters.completed}
                onChange={handleFilterChange}
                className="border rounded-lg p-2 text-sm outline-none"
              >
                <option value="">All Completion</option>
                <option value="true">Completed</option>
                <option value="false">Not Completed</option>
              </select>
            </div>
            <div className="flex gap-2">
              <CreateTask fetchData={fetchData} />
              <Button
                className="border rounded-lg p-2 outline-none text-sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <Loading />
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 pt-4">
            {filteredTasks.map((task: TaskInterface, idx: number) => (
              <ShapaCard
                className={`bg-white rounded-lg shadow-md overflow-hidden md:max-w-sm w-full border ${
                  task?.status === "true"
                    ? "border-green-500"
                    : "border-red-500"
                }`}
                key={idx}
              >
                <img
                  src={`${BASE_PATH}/uploads/${task?.file}`}
                  alt="Card image"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {task?.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Created: <span>{task?.created_at}</span>
                  </p>
                  <p className="text-gray-700 mb-4">{task?.description}</p>
                  <p className="text-sm text-gray-600 mb-4">
                    Due: <span>{task?.due_date}</span>
                  </p>
                  <div className="flex justify-end space-x-2 ">
                    <EiditTask task={task} fetchData={fetchData} />
                    <Dialog>
                      <DialogTrigger>
                        <span className="bg-red-500 rounded-md text-xs text-white h-fit px-4 py-2">
                          Delete
                        </span>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your task from the servers.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose className="flex gap-2">
                            <span className="bg-gray-500 rounded-md text-xs text-white h-fit p-1">
                              Cancel
                            </span>
                            <Button
                              className="bg-red-500 rounded-md text-xs text-white h-fit p-1 "
                              onClick={() => deleteTask(task?.task_id)}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    {/* logout button */}
                  </div>
                </div>
              </ShapaCard>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <h1 className="md:text-3xl text-gray-400 font-bold">
              No tasks found
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
