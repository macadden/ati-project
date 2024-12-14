import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs';
import { FaComments } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { getPostComments, deleteComment } from "../../redux/actions/blog/blog";

function BlogCardHorizontal({ data, index }) {
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const dispatch = useDispatch();

    const comments = useSelector(state => state.blog.commentsByPost[data?.id] || []);
    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        if (data?.id && !comments.length) {
            dispatch(getPostComments(data.id));
        }
    }, [dispatch, data?.id, comments.length]);

    const description = data?.content || "No description available";
    const formattedDate = data?.created_at ? dayjs(data.created_at).format('DD [de] MMMM [de] YYYY') : "Date not available";
    const thumbnail = data?.thumbnail || "/default-thumbnail.jpg";

    const truncatedDescription = description.length > 50 ? description.slice(0, 50) + '...' : description;

    const openDeleteModal = (comment) => {
        setCommentToDelete(comment);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setCommentToDelete(null);
    };

    const handleDeleteComment = (commentId) => {
        if (commentId) {
            dispatch(deleteComment(data.id, commentId));
            closeDeleteModal();
        }
    };

    return (
        <li className="mb-6">
            <Link
                to={`/posts/${data?.id}`}
                className="block relative hover:shadow-card rounded-md transition duration-300 ease-in-out"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex items-center my-4">
                    <div className="lg:flex min-w-0 lg:flex-1 items-start">
                        <figure className="lg:flex-shrink-0">
                            <img
                                className="h-64 lg:w-96 w-full object-cover rounded"
                                src={`http://localhost:8000${thumbnail}`}
                                alt="Imagen de post"
                                onError={(e) => e.target.src = '/default-thumbnail.jpg'}
                            />
                        </figure>
                        <div className="min-w-0 flex-1 px-8 p-4">
                            <div className="lg:absolute lg:top-28">
                                <span className="text-gray-300">&middot;</span>
                                <span className="mt-2 ml-2 mr-1 font-medium text-gray-800 text-sm">
                                    {formattedDate}
                                </span>
                                <p className="mt-4 text-lg font-regular text-gray-800 leading-8">
                                    {truncatedDescription}
                                </p>

                                {isHovered && description.length > 30 && (
                                    <Link
                                        to={`/posts/${data?.id}`}
                                        className="text-blue-500 mt-2 inline-block"
                                    >
                                        Read full post
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="flex items-center mt-4 cursor-pointer" onClick={() => setShowCommentsModal(true)}>
                <FaComments className="text-gray-500 mr-2" />
                <span>{comments?.length || 0} Comments</span>
            </div>

            {showCommentsModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Comments</h3>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setShowCommentsModal(false)}
                            >
                                X
                            </button>
                        </div>

                        {comments?.length === 0 ? (
                            <p>There are no comments yet.</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="mb-4 p-4 bg-gray-100 rounded-md">
                                    <div className="flex items-start">
                                        <img
                                            className="inline-block h-10 w-10 rounded-full mr-3"
                                            src={comment.author.profile_image ? `http://localhost:8000${comment.author.profile_image}` : ""}
                                            alt="Foto de perfil"
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                <Link to={`/profile/${comment.author.id}`} className="text-blue-500 hover:underline">
                                                    {comment.author.username}
                                                </Link>
                                            </p>
                                            <p>{comment.content}</p>
                                            <span className="text-gray-400 text-sm">
                                                {dayjs(comment.created_at).format('DD [de] MMMM [de] YYYY')}
                                            </span>
                                        </div>

                                        {user && user.id === comment.author.id && (
                                            <button
                                                onClick={() => openDeleteModal(comment)}
                                                className="ml-2 text-gray-500 hover:text-red-500 transition-colors duration-300"
                                            >
                                                <IoClose className="text-xl" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}

                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                            onClick={() => setShowCommentsModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-sm w-full">
                        <h3 className="text-xl font-semibold mb-4">Are you sure you want to delete this comment?</h3>
                        <div className="flex justify-between">
                            <button
                                onClick={() => handleDeleteComment(commentToDelete.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
}

export default BlogCardHorizontal;
