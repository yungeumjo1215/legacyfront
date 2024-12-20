import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/authSlice";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    console.log("로그인 시도:", formData);

    try {
      const response = await axios.post(
        "http://localhost:8000/account/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // console.log("로그인 응답:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          })
        );
        navigate("/");
      }
    } catch (err) {
      console.error("로그인 에러:", err);
      const errorMessage =
        err.response?.data?.message || "로그인에 실패했습니다.";
      dispatch(loginFailure(errorMessage));

      if (err.response?.status === 401) {
        dispatch(loginFailure("이메일 또는 비밀번호가 올바르지 않습니다."));
      } else if (err.response?.status === 404) {
        dispatch(loginFailure("존재하지 않는 사용자입니다."));
      } else if (err.code === "ECONNREFUSED") {
        dispatch(
          loginFailure("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
        );
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-white">
      <div className="max-w-md w-full m-4 space-y-8 p-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        <div>
          <h2 className="mt-4 text-center text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 bg-clip-text text-transparent">
            로그인
          </h2>
          <p className="mt-2 text-center text-base text-gray-900 font-medium">
            계정에 로그인하세요
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-500 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-blue-200"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-1"
              >
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-100 placeholder-gray-500 text-gray-900 font-medium rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out hover:border-blue-200"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 hover:from-blue-800 hover:via-blue-500 hover:to-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <span className="text-base text-gray-900">
            아직 회원이 아니신가요?{" "}
          </span>
          <Link
            to="/signup"
            className="text-base bg-gradient-to-r from-blue-900 via-blue-600 to-blue-500 bg-clip-text text-transparent font-medium hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
