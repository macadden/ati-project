import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../redux/actions/user/user';
import { Link, useNavigate } from 'react-router-dom';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users = [], isLoading = false, error = null } = useSelector(state => state.user || {});

  useEffect(() => {
    if (query.length === 0) {
      return;
    }

    const debounceTimeout = setTimeout(() => {
      dispatch(searchUsers(query));
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [query, dispatch]);

  const handleUserClick = (userId) => {
    setQuery('');
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search user..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {query && (
        <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg z-10">
          {isLoading ? (
            <div className="p-2">Loading...</div>
          ) : error ? (
            <div className="p-2 text-red-500">Error: {error}</div>
          ) : users.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {users.map((user) => (
                <li key={user.id} className="px-4 py-2 hover:bg-gray-100">
                  <span
                    onClick={() => handleUserClick(user.id)}
                    className="block text-gray-700 cursor-pointer"
                  >
                    {user.username}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-gray-500">No users found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
