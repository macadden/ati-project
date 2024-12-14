import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../redux/actions/blog/blog';

const CreatePost = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const user_loading = useSelector((state) => state.auth.user_loading);
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [status, setStatus] = useState('draft');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (user_loading) {
        return <div>Loading user...</div>;
    }

    if (!user || !user.id) {
        return <div>Error: User not found.</div>;
    }

    const handleFileChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!thumbnail || !content || !status) {
            setError("Please complete all fields.");
            return;
        }

        const postData = {
            content,
            thumbnail,
            status,
            author: user.id
        };

        setLoading(true);
        setError('');

        try {
            dispatch(createPost(postData));
            navigate(`/profile/${user.id}?created=true`);
        } catch (error) {
            setError('There was an error creating the post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-semibold mb-4">Create a new post</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows="6"
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Write the content of your post..."
                        />
                    </div>

                    <div>
                        <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                            Image
                        </label>
                        <input
                            type="file"
                            id="thumbnail"
                            name="thumbnail"
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                            className="mt-2 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm file:border-gray-300 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div> */}

                    {error && (
                        <div className="text-red-500 text-sm mt-2">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none ${loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'}`}
                        >
                            {loading ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
