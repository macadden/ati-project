import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { load_user } from '../../redux/actions/auth/auth';
import { getUserPosts, getUserProfile, followUser, unfollowUser, updateUserProfile, getMoreUserPosts } from '../../redux/actions/blog/blog';
import BlogCardHorizontal from '../../components/blog/BlogCardHorizontal';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [isProfileImageHovered, setIsProfileImageHovered] = useState(false);
  const [isCoverImageHovered, setIsCoverImageHovered] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { user, user_loading, isAuthenticated } = useSelector((state) => state.auth);
  const { userPosts, userProfile, userProfileLoading, next, loading } = useSelector((state) => state.blog);

  const toggleMenu = () => setShowMenu(!showMenu);
  const toggleFollowersModal = () => setShowFollowersModal(!showFollowersModal);
  const toggleFollowingModal = () => setShowFollowingModal(!showFollowingModal);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(load_user());
      if (id) {
        dispatch(getUserProfile(id));
      }
    }
  }, [dispatch, isAuthenticated, id]);

  useEffect(() => {
    if (userProfile?.id && !loadingPosts) {
      dispatch(getUserPosts(userProfile.id, currentPage));
      setLoadingPosts(false);
    }
  }, [userProfile, dispatch, loadingPosts, currentPage]);

  useEffect(() => {
    if (userProfile) {
      setIsFollowing(userProfile.followers.some(follower => follower.id === user.id));
    }
  }, [userProfile, user]);

  useEffect(() => {
    if (userPosts.length > 0 || !next) {
      setLoadingPosts(false);
    }
  }, [userPosts, next]);

  const handleFollow = () => {
    if (isFollowing) {
      dispatch(unfollowUser(user.id, userProfile.id));
      userProfile.followers = userProfile.followers.filter(follower => follower.id !== user.id);
    } else {
      dispatch(followUser(user.id, userProfile.id));
      userProfile.followers.push(user);
    }
    setIsFollowing(!isFollowing);
  };

  const handleEditProfile = () => {
    const data = {
      username: userProfile.username,
      bio: userProfile.bio,
      profileImage: newProfileImage,
      coverImage: newCoverImage
    };

    dispatch(updateUserProfile(user.id, data));

    setIsEditMode(false);
    setShowMenu(false);
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'profile') {
      setNewProfileImage(file);
    } else if (type === 'cover') {
      setNewCoverImage(file);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    dispatch(getUserPosts(userProfile.id, pageNumber));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
      dispatch(getUserPosts(userProfile.id, currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (next) {
      setCurrentPage(prevPage => prevPage + 1);
      dispatch(getUserPosts(userProfile.id, currentPage + 1));
    }
  };

  const totalPages = Math.ceil(userProfile?.total_posts / 5);
  const pageRange = (current) => {
    const range = [];
    const left = Math.max(current - 2, 1);
    const right = Math.min(current + 2, totalPages);
    for (let i = left; i <= right; i++) {
      range.push(i);
    }
    return range;
  };

  if (user_loading || userProfileLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>You are not authenticated. Please log in.</div>;
  }

  if (!userProfile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <section className="w-full py-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center px-4">
          <div className="flex flex-col items-center">
            {/* Cover and Profile Image */}
            <div
              className="relative"
              onMouseEnter={() => setIsCoverImageHovered(true)}
              onMouseLeave={() => setIsCoverImageHovered(false)}
            >
              <img
                src={newCoverImage ? URL.createObjectURL(newCoverImage) : (userProfile?.cover_image ? `http://localhost:8000${userProfile.cover_image}` : "")}
                alt="Cover"
                className={`w-screen h-48 object-cover rounded-lg shadow-lg ${isEditMode && isCoverImageHovered ? 'blur-sm' : ''}`}
              />
              {isEditMode && isCoverImageHovered && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                  <span className="text-white text-3xl">+</span>
                </div>
              )}
              {isEditMode && (
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, 'cover')}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            </div>

            <div
              className="relative mt-[-4rem]"
              onMouseEnter={() => setIsProfileImageHovered(true)}
              onMouseLeave={() => setIsProfileImageHovered(false)}
            >
              <img
                src={newProfileImage ? URL.createObjectURL(newProfileImage) : (userProfile?.profile_image ? `http://localhost:8000${userProfile.profile_image}` : "")}
                alt="Profile"
                className={`rounded-full w-32 h-32 object-cover border-4 border-white ${isEditMode && isProfileImageHovered ? 'blur-sm' : ''}`}
              />
              {isEditMode && isProfileImageHovered && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 rounded-full">
                  <span className="text-white text-3xl">+</span>
                </div>
              )}
              {isEditMode && (
                <input
                  type="file"
                  onChange={(e) => handleImageChange(e, 'profile')}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
            </div>

            <h1 className="text-2xl font-semibold text-black mt-4">{userProfile?.username}</h1>
            <p className="text-gray-600 dark:text-gray-400">{userProfile?.email}</p>
            <div className="flex gap-6 mt-4">
              {/* Followers */}
              <div className="text-center cursor-pointer">
                <span className="text-lg font-semibold text-blue-500" onClick={toggleFollowersModal}>
                  {userProfile?.followers?.length || 0}
                </span>
                <span className="text-gray-600 dark:text-gray-400 block">Followers</span>
              </div>
              {/* Following */}
              <div className="text-center cursor-pointer">
                <span className="text-lg font-semibold text-blue-500" onClick={toggleFollowingModal}>
                  {userProfile?.following?.length || 0}
                </span>
                <span className="text-gray-600 dark:text-gray-400 block">Followed</span>
              </div>
              {/* Posts */}
              <div className="text-center">
                <span className="text-lg font-semibold text-blue-500 cursor-pointer">
                  {userProfile?.total_posts || 0}
                </span>
                <span className="text-gray-600 dark:text-gray-400 block">Posts</span>
              </div>
              {/* Menu */}
              {user.id === userProfile?.id && (
                <div className="ml-auto relative">
                  <button
                    onClick={toggleMenu}
                    className="text-2xl text-gray-600 focus:outline-none"
                  >
                    ...
                  </button>
                  {showMenu && !isEditMode && (
                    <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-md">
                      <ul className="py-1">
                        <li
                          onClick={() => { setIsEditMode(true); setShowMenu(false); }}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          Edit Profile
                        </li>
                        <li
                          onClick={() => setShowMenu(false)}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        >
                          Cancel
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {user.id !== userProfile?.id && (
              <button
                onClick={handleFollow}
                className={`mt-6 py-2 px-6 rounded-md text-white ${isFollowing ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} focus:outline-none`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}

            {isEditMode && (
              <div className="flex gap-6 mt-4">
                <button
                  onClick={handleEditProfile}
                  className="py-2 px-4 bg-blue-600 text-white rounded-lg"
                >
                  Save changes
                </button>
                <button
                  onClick={() => setIsEditMode(false)}
                  className="py-2 px-4 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal de followers */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold">Followers</h2>
            <ul className="mt-4 space-y-2">
              {userProfile.followers.map((follower) => (
                <li key={follower.id} className="flex items-center space-x-3">
                  <img
                    src={follower.profile_image ? `http://localhost:8000${follower.profile_image}` : ""}
                    alt={follower.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <Link to={`/profile/${follower.id}`} className="text-blue-600 hover:text-blue-800">
                    {follower.username}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={toggleFollowersModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg block ml-auto text-right"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal Following */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold">Followed</h2>
            <ul className="mt-4 space-y-2">
              {userProfile.following.map((followedUser) => (
                <li key={followedUser.id} className="flex items-center space-x-3">
                  <img
                    src={followedUser.profile_image ? `http://localhost:8000${followedUser.profile_image}` : ""}
                    alt={followedUser.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <Link to={`/profile/${followedUser.id}`} className="text-blue-600 hover:text-blue-800">
                    {followedUser.username}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              onClick={toggleFollowingModal}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg block ml-auto text-right"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* User Posts */}
      <section className="max-w-4xl mx-auto py-12 px-4">
        <h2 className="text-lg font-medium text-gray-500 mb-4">
          All Posts ({userProfile?.total_posts || 0})
        </h2>
        {loadingPosts ? (
          <div>Loading Posts...</div>
        ) : userPosts.length > 0 ? (
          <div className="post-list space-y-6">
            {userPosts.map(post => (
              <BlogCardHorizontal key={post.id} data={post} />
            ))}
            {loadingMore && <div className="text-center text-gray-500">Loading...</div>}
          </div>
        ) : (
          <p>No posts found.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <nav>
            <ul className="flex space-x-2">
              {/* Flecha izquierda */}
              <li>
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200'}`}
                >
                  &lt;
                </button>
              </li>

              {/* Páginas numeradas */}
              {pageRange(currentPage).map((number) => (
                <li key={number}>
                  <button
                    onClick={() => handlePageChange(number)}
                    className={`px-4 py-2 rounded-lg ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    {number}
                  </button>
                </li>
              ))}

              {/* Flecha derecha */}
              <li>
                <button
                  onClick={handleNextPage}
                  disabled={!next}
                  className={`px-4 py-2 rounded-lg ${!next ? 'bg-gray-300' : 'bg-gray-200'}`}
                >
                  &gt;
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default Profile;
