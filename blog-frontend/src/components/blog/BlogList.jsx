import React from 'react';
import { Link } from 'react-router-dom';
import BlogCardHorizontal from './BlogCardHorizontal';

const BlogList = ({ posts, next, loading, handleScroll, loadingMore }) => {
  return (
    <div 
      onScroll={handleScroll} 
      className="post-list-container overflow-y-scroll max-h-[80vh] scrollbar-hidden"
    >
      {posts && posts.length > 0 ? (
        <div>
          <ul className="post-list">
            {posts.map((blog) => (
              <li key={blog.id} className="relative mb-8">
                <div className="flex flex-col">
                  <div className="flex items-center p-0 mb-0">
                    <img
                      src={blog.author?.profile_image ? `http://localhost:8000${blog.author.profile_image}` : ""}
                      alt={blog.author.username}
                      className="rounded-full w-14 h-14 border-4 border-white shadow-md m-0 mr-3"
                    />
                    <Link
                      to={`/profile/${blog.author.id}`}
                      className="text-lg font-semibold text-black hover:text-blue-500 transition duration-200"
                    >
                      {blog.author.username}
                    </Link>
                  </div>
                  <div className="relative flex flex-col mt-2">
                    <BlogCardHorizontal data={blog} />
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {next && loadingMore && (
            <div className="flex justify-center mt-4">
              <div className="w-12 h-12 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
};

export default BlogList;
