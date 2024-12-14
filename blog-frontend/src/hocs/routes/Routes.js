import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import Layout from '../layout/Layout';
import Blog from '../../containers/pages/Blog';
import Login from '../../components/Login';
import Register from '../../components/Register';
import PostDetail from '../../components/PostDetail';
import Profile from '../../containers/pages/Profile';
import CreatePost from '../../components/CreatePost';
import Error404 from '../../containers/pages/Error404';

const AnimatedRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Blog />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/posts/:id"
        element={
          <PrivateRoute>
            <Layout>
              <PostDetail />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/create-post"
        element={
          <PrivateRoute>
            <Layout>
              <CreatePost />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Error404 />} />
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AnimatedRoutes;
