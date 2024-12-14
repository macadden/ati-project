import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/actions/auth/auth';
import { FaCheckCircle } from 'react-icons/fa';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !profileImage || !coverImage) {
      setError('Please complete all fields.');
      return;
    }

    const userData = {
      username,
      email,
      password,
      profile_image: profileImage,
      cover_image: coverImage
    };

    try {
      setLoading(true);
      await dispatch(registerUser(userData));
      
      setSuccessMessage(true);

      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      setError('There was an error creating the account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="relative max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* If the registration was successful, display the message */}
        {successMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
            <div className="text-center p-8 bg-white shadow-lg rounded-full flex flex-col items-center z-20">
              <FaCheckCircle className="text-green-500 text-6xl mb-4" />
              <p className="text-xl font-semibold">Account created successfully!</p>
              <p className="text-sm text-gray-500 mt-2">Welcome to the community. You will now be redirected to log in.</p>
            </div>
          </div>
        )}

        <div className={`max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md ${successMessage ? 'blur-sm' : ''}`}>
          <h1 className="text-2xl font-semibold mb-4">Create an account to make posts on the A.T.I. Blog</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">User name</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="profile_image" className="block text-sm font-medium text-gray-700">Profile picture</label>
              <input
                type="file"
                id="profile_image"
                onChange={handleProfileImageChange}
                accept="image/*"
                required
                className="mt-2 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm file:border-gray-300 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700">Imagen de portada</label>
              <input
                type="file"
                id="cover_image"
                onChange={handleCoverImageChange}
                accept="image/*"
                required
                className="mt-2 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm file:border-gray-300 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
