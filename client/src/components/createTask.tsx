import { FormEvent, useState } from "react";
import { main_url } from "../service";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/common/buttonComp";
import { ErrorToast, SuccessToast } from "../components/common/toastComp";
import { AxiosError } from "axios";

interface CreateTaskProps {
  fetchData: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ fetchData }) => {
  const user = JSON.parse(localStorage.getItem("user") || "");
  console.log(user?.id)
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("false");
  const [due_date, setDueDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("userid", user?.id);
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);
    formData.append("status", status);
    formData.append("due_date", due_date);
   

    try {
      await main_url.post("/create-task", formData);
      SuccessToast({ message: "Task created successfully!" });
      fetchData(); 
      setIsDialogOpen(false);
    } catch (error: unknown) {
      setLoading(false);

      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        ErrorToast({
          message: errorMessage,
        });
      }
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="border rounded-lg p-2 outline-none text-sm">
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateTask}>
          <div className="mb-4 flex flex-col gap-1">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg p-2 outline-none text-sm w-full"
              required
            />
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <label htmlFor="description">Description:</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-lg p-2 outline-none text-sm w-full"
              required
            />
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <label htmlFor="file">File:</label>
            <input
              type="file"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
              className="border rounded-lg p-2 outline-none text-sm w-full"
            />
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <label htmlFor="status">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-lg p-2 outline-none text-sm w-full"
            >
              <option value="false">Select Status</option>
              <option value="false">Not Completed</option>
              <option value="true">Completed</option>
            </select>
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <label htmlFor="due_date">Due Date:</label>
            <input
              type="date"
              className="border rounded-lg p-2 outline-none text-sm w-full"
              defaultValue={new Date().toISOString().split("T")[0]}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-gray-500 text-white px-3 py-1 rounded-md">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded-md"
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
