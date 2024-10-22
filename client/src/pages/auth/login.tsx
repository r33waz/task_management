import { ShapaCard } from "../../components/common/shapeCard";
import { Button } from "../../components/common/buttonComp";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { main_url } from "../../service";
import { ErrorToast, SuccessToast } from "../../components/common/toastComp";
import { AxiosError } from "axios";
import { useState } from "react";
import Loading from "../../components/common/loading";

interface LoginInterface {
  email: string;
  password: string;
}

const LoginSchema = yup.object({
  email: yup
    .string()
    .required("Email is a required field")
    .email("Enter a valid email"),
  password: yup.string().required("Password is a required field"),
});

function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInterface>({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginInterface) => {
    console.log(data);
    try {
      setLoading(true);
      const resp = await main_url.post("/login", data);
      console.log("response", resp.data?.message);
      if (resp.data?.status) {
        localStorage.setItem("token", resp.data?.token);
        SuccessToast({
          message: resp.data?.message,
        });
        navigate("/home");
      }
      setLoading(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        ErrorToast({
          message: errorMessage,
        });
        console.error("Login failed:", errorMessage);
      } else {
        ErrorToast({
          message: "An unexpected error occurred.",
        });
        console.error("Unexpected error:", error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ShapaCard className="border rounded-lg shadow-md p-4 md:w-96 w-96 h-fit">
        <h1 className="text-3xl font-bold underline">Login</h1>
        <form
          className="flex flex-col gap-4 mt-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            id="email"
            placeholder="Enter your email"
            className="w-full h-10 border pl-2 text-sm rounded-md"
            {...register("email")}
          />
          {errors.email && (
            <small className="text-xs text-red-500">
              {errors.email.message}
            </small>
          )}

          <div className="relative">
            <input
              id="password"
              placeholder="Enter your password"
              className="w-full h-10 border pl-2 text-sm rounded-md"
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            {errors.password && (
              <small className="text-xs text-red-500">
                {errors.password.message}
              </small>
            )}
            <div
              className="absolute cursor-pointer top-2.5 right-4"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M226 171.47a3.9 3.9 0 0 1-2 .53a4 4 0 0 1-3.47-2l-21.15-37a120 120 0 0 1-41.91 19.53l6.53 38.81a4 4 0 0 1-3.29 4.6a4 4 0 0 1-.67.06a4 4 0 0 1-3.94-3.34l-6.41-38.5a128.2 128.2 0 0 1-43.28 0l-6.41 38.5a4 4 0 0 1-4 3.34a4 4 0 0 1-.67-.06a4 4 0 0 1-3.29-4.6l6.48-38.83A120 120 0 0 1 56.62 133l-21.15 37a4 4 0 0 1-3.47 2a3.9 3.9 0 0 1-2-.53a4 4 0 0 1-1.47-5.47l21.68-37.94a148.2 148.2 0 0 1-21.32-21.56a4 4 0 1 1 6.22-5C52.25 122.71 82.29 148 128 148s75.75-25.29 92.89-46.51a4 4 0 1 1 6.22 5a148.2 148.2 0 0 1-21.32 21.56L227.47 166a4 4 0 0 1-1.47 5.47"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M243.66 126.38c-.34-.76-8.52-18.89-26.83-37.2C199.87 72.22 170.7 52 128 52S56.13 72.22 39.17 89.18c-18.31 18.31-26.49 36.44-26.83 37.2a4.08 4.08 0 0 0 0 3.25c.34.77 8.52 18.89 26.83 37.2c17 17 46.14 37.17 88.83 37.17s71.87-20.21 88.83-37.17c18.31-18.31 26.49-36.43 26.83-37.2a4.08 4.08 0 0 0 0-3.25m-32.7 35c-23.07 23-51 34.62-83 34.62s-59.89-11.65-83-34.62A135.7 135.7 0 0 1 20.44 128A135.7 135.7 0 0 1 45 94.62C68.11 71.65 96 60 128 60s59.89 11.65 83 34.62A135.8 135.8 0 0 1 235.56 128A135.7 135.7 0 0 1 211 161.38ZM128 84a44 44 0 1 0 44 44a44.05 44.05 0 0 0-44-44m0 80a36 36 0 1 1 36-36a36 36 0 0 1-36 36"
                  />
                </svg>
              )}
            </div>
          </div>

          <div className="mt-2 bg-black h-12 rounded-md text-white hover:bg-black/75 duration-300 tracking-wider flex justify-center items-center">
            {" "}
            {loading ? (
              <Loading width="25" height="25" />
            ) : (
              <Button type="submit">Login</Button>
            )}
          </div>

          <div className="flex w-full justify-between pt-4">
            <p className="text-sm">Don't have an account?</p>

            <Link className="text-sm underline" to="/signup">
              Signup
            </Link>
          </div>
        </form>
      </ShapaCard>
    </div>
  );
}

export default Login;
