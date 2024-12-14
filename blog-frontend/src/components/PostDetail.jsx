import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPostDetails, getPostComments, addComment, deletePost, editPost, deleteComment } from '../redux/actions/blog/blog';
import { IoClose } from 'react-icons/io5';

const PostDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [newComment, setNewComment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [newThumbnail, setNewThumbnail] = useState(null);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [loading, setLoading] = useState(true);

    const post = useSelector((state) => state.blog.post);
    const comments = useSelector((state) => {
        return state.blog.commentsByPost[id] || [];
    });
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getPostDetails(id));
        dispatch(getPostComments(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (post) {
            setLoading(false);
        }
    }, [post]);

    useEffect(() => {
        if (post && isEditMode) {
            setContent(post.content);
            setThumbnail(post.thumbnail);
        }
    }, [post, isEditMode]);

    useEffect(() => {
    }, [comments]);

    const handleAddComment = () => {
        if (newComment.trim()) {
            dispatch(addComment(id, newComment));
            setNewComment('');
        }
    };

    const handleDeletePost = () => {
        dispatch(deletePost(id));
        setIsDeletePostModalOpen(false);
        navigate(`/profile/${post.author.id}?deleted=true`);
    };

    const handleEditPost = () => {
        const data = {
            content,
            thumbnail: newThumbnail || thumbnail
        };

        dispatch(editPost(id, data));
        setIsEditMode(false);
        setIsModalOpen(false);
    };

    const handleCancelEdit = () => {
        setContent(post?.content || '');
        setNewThumbnail(null);
        setIsEditMode(false);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewThumbnail(file);
        }
    };

    const handleDeleteComment = (commentId) => {
        dispatch(deleteComment(id, commentId));
        setIsDeleteModalOpen(false);
        setCommentToDelete(null);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setCommentToDelete(null);
    };

    if (loading || !post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div
                className="mb-6 max-w-full h-auto overflow-hidden relative"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
            >
                <img
                    className={`w-full max-w-3xl mx-auto h-auto object-cover rounded-md ${isEditMode && isImageHovered ? 'blur-sm' : ''}`}
                    src={newThumbnail ? URL.createObjectURL(newThumbnail) : post.thumbnail.startsWith('http') ? post.thumbnail : `http://localhost:8000${post.thumbnail}`}
                    alt={post.title}
                />
                {isEditMode && isImageHovered && (
                    <div
                        className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 text-white text-3xl cursor-pointer"
                        onClick={() => document.querySelector('input[type="file"]').click()}
                    >
                        <span>+</span>
                    </div>
                )}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-2 max-w-4xl mx-auto flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                    By{' '}
                    <Link to={`/profile/${post.author.id}`} className="text-blue-500 hover:underline">
                        <strong>{post.author.username}</strong>
                    </Link> - {new Date(post.created_at).toLocaleDateString()}
                </p>

                {user && user.id === post.author.id && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <span className="text-xl font-bold">⋮</span>
                    </button>
                )}
            </div>

            {/* Contenido del post */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-4xl mx-auto">
                {isEditMode ? (
                    <div>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="mt-2 p-2 border border-gray-300 rounded-md hidden"
                        />
                        <div className="flex space-x-4 mt-2">
                            <button
                                onClick={handleEditPost}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="break-words whitespace-normal text-lg text-gray-800 leading-relaxed">
                        <p>{post.content}</p>
                    </div>
                )}
            </div>

            {!isEditMode && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-4xl mx-auto">
                    <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>

                    {/* Comentarios */}
                    <div key={comments.length}>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex items-start mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    <img
                                        className="w-10 h-10 rounded-full mr-4"
                                        src={comment.author.profile_image ? `http://localhost:8000${comment.author.profile_image}` : ""}
                                        alt={comment.author.username}
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            <Link to={`/profile/${comment.author.id}`} className="text-blue-500 hover:underline">
                                                {comment.author.username}
                                            </Link>
                                        </p>
                                        <p className="text-gray-600">{comment.content}</p>
                                        <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</p>
                                    </div>

                                    {user && user.id === comment.author.id && (
                                        <button
                                            onClick={() => {
                                                setCommentToDelete(comment);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="text-gray-500 text-xl ml-2 mt-1 hover:text-red-500 transition-colors duration-300"
                                        >
                                            <IoClose className="text-xl" />
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>There are no comments yet.</p>
                        )}
                    </div>

                    {/* Agregar un nuevo comentario */}
                    <div className="mt-4">
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows="3"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Comment here..."
                        />
                        <button
                            onClick={handleAddComment}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Add Comment
                        </button>
                    </div>
                </div>
            )}

            {/* Modal confirmacion de eliminacion de comentario */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this comment?</h3>
                        <div className="flex justify-between">
                            <button
                                onClick={() => handleDeleteComment(commentToDelete.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de opciones del post */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <button
                            onClick={() => {
                                setIsEditMode(true)
                                setIsModalOpen(false);
                            }}
                            className="block w-full text-blue-600 text-lg py-2 text-left hover:bg-gray-100"
                        >
                            Edit Post
                        </button>
                        <button
                            onClick={() => {
                                setIsDeletePostModalOpen(true)
                                setIsModalOpen(false);
                            }}
                            className="block w-full text-red-600 text-lg py-2 text-left hover:bg-gray-100"
                        >
                            Delete Post
                        </button>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="block w-full text-gray-600 text-lg py-2 text-left hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Modal para confirmar la eliminación del post */}
            {isDeletePostModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this post?</h3>
                        <div className="flex justify-between">
                            <button
                                onClick={handleDeletePost}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setIsDeletePostModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetail;
