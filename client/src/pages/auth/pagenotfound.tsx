import { useNavigate } from "react-router";
import { Button } from "../../components/common/buttonComp";
import { ShapaCard } from "../../components/common/shapeCard";

function Pagenotfound() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center h-screen">
      <ShapaCard className="border rounded-lg shadow-md p-4 md:w-96 w-full h-fit flex flex-col gap-2">
        <h1 className="text-3xl font-bold underline">Page Not Found</h1>
        <p className="text-sm">The page you are looking for does not exist</p>
        <Button
          className="text-center w-full rounded-md bg-black h-10 text-white"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </ShapaCard>
    </div>
  );
}

export default Pagenotfound;
