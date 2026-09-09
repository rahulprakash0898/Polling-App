import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthInput from '../../components/input/AuthInput';
import AuthLayout from '../../components/layout/AuthLayout';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate();

  //handle Login Form Submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter a password');
      return;
    }
    setError('');

    //Login API
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if(token){
        localStorage.setItem("token",token)
        updateUser(user)
        navigate("/dashboard",{ replace: true });
      }
    } catch (error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      } else{
        setError("Something went wrong. Please try again")
      }
    }
  }
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center ">
        <h3 className="text-xl font-semibold text-black mt-0">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please Enter your details to Login
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <AuthInput
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email"
              type="email"
              placeholder="john@gmail.com"
            />
          </div>

          <div className="mb-4">
            <AuthInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
            />
          </div>

          {error && <p className="text-red-500 text-xs pd-2.5">{error}</p>}

          <button
            type="submit"
            className="btn-primary hover:bg-blue-700 hover:text-white transition-all"
          >
            Login
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{' '}
            <Link className="font-medium text-primary underline" to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;