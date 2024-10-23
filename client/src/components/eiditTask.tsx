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
import { SuccessToast } from "../components/common/toastComp";
import { useState } from "react";
import { photo_url } from "../service";
import { TaskInterface } from "../interface/interface";

function EiditTask({
  task,
  fetchData,
}: {
  task: TaskInterface;
  fetchData: () => void;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<TaskInterface | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [editedFile, setEditedFile] = useState<File | null>(null);
  const [editedStatus, setEditedStatus] = useState<string>("");
  const [eiditedDueDate, setEiditedDueDate] = useState<string>("");
  const openEditDialog = (task: TaskInterface) => {
    setCurrentTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedStatus(task.status);
    setEditedFile(null);
    setIsEditDialogOpen(true);

    setEiditedDueDate(task.due_date);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask) return;

    const formData = new FormData();
    formData.append("title", editedTitle);
    formData.append("description", editedDescription);

    if (editedFile) {
      console.log("File being sent:", editedFile);
      formData.append("file", editedFile);
    } else {
      console.log("No file selected");
    }

    formData.append("status", editedStatus);
    formData.append("due_date", eiditedDueDate);

    try {
      await photo_url.patch(`/update-post/${currentTask.task_id}`, formData);
      SuccessToast({ message: "Task updated successfully!" });
      fetchData();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger>
        <span
          className="bg-blue-500 rounded-md text-xs text-white h-fit px-4 py-2"
          onClick={() => openEditDialog(task)} 
        >
          Edit
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEditSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="border rounded-lg p-2 outline-none"
              required
            />
            <label htmlFor="description" className="text-sm">
              Description
            </label>
            <textarea
              id="description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="border rounded-lg p-2 outline-none"
              required
            />
            <label htmlFor="file" className="text-sm">
              File
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => {
                if (e.target.files) {
                  setEditedFile(e.target.files[0]);
                }
              }}
              className="border rounded-lg p-2 outline-none"
            />
            <div className="mb-4 flex flex-col gap-1">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                value={editedStatus}
                onChange={(e) => setEditedStatus(e.target.value)}
                className="border rounded-lg p-2 text-sm outline-none"
              >
                <option value="true">Completed</option>
                <option value="false">Not Completed</option>
              </select>
            </div>
          </div>
          <div className="mb-4 flex flex-col gap-1">
            <label htmlFor="due_date">Due Date:</label>
            <input
              type="date"
              className="border rounded-lg p-2 outline-none text-sm w-full"
              defaultValue={eiditedDueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setEiditedDueDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose>
              <Button
                type="button"
                className="bg-gray-500 rounded-md text-xs text-white h-fit p-1"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-500 rounded-md text-xs text-white h-fit p-1"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EiditTask;
