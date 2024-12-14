import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { connect } from "react-redux";
import { Bars3Icon, XMarkIcon, CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { check_authenticated, load_user, logout, refresh } from '../../redux/actions/auth/auth';
import UserSearch from '../../components/UserSearch';

function Layout({
    children,
    refresh,
    check_authenticated,
    load_user,
    user,
    logout
}) {
    useEffect(() => {
        refresh();
        check_authenticated();
        load_user();
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

    const navigate = useNavigate();

    const goToProfile = () => {
        navigate(`/profile/${user.id}`);
        setOpenLogoutModal(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setOpenLogoutModal(false);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar screen web */}
            <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0">
                <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
                    <div className="flex flex-shrink-0 items-center px-4 py-6">
                        <Link to="/">
                            <img
                                src=""
                                alt="Logo"
                                width={160}
                                height={160}
                            />
                        </Link>
                    </div>

                    {/* Sidebar Navigation */}
                    <nav className="flex-1 overflow-y-auto px-2">
                        {/* Home */}
                        <Link
                            to="/dashboard"
                            className="group flex items-center px-2 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-blue-500 hover:text-white"
                        >
                            <HomeIcon className="h-6 w-6 text-gray-500 group-hover:text-white" aria-hidden="true" />
                            <span className="ml-3">Home</span>
                        </Link>

                        {/* Create Post */}
                        <Link
                            to="/create-post"
                            className="group flex items-center px-2 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-blue-500 hover:text-white mt-4"
                        >
                            <PencilIcon className="h-6 w-6 text-gray-500 group-hover:text-white" aria-hidden="true" />
                            <span className="ml-3">Create Post</span>
                        </Link>

                        {/* Search users */}
                        <div className="mt-6">
                            <UserSearch />
                        </div>
                    </nav>

                    {/* Botón de logout */}
                    <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                        <button onClick={() => setOpenLogoutModal(true)} className="group block w-full flex-shrink-0">
                            <div className="flex items-center">
                                <div>
                                    <span className="inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                        <img
                                            className="inline-block h-10 w-10 rounded-full"
                                            src={user?.profile_image ? `http://localhost:8000${user.profile_image}` : ""}
                                            alt="Foto de perfil"
                                        />
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{user?.email}</p>
                                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Account</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar mobile */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                                    <div className="flex flex-shrink-0 items-center px-4">
                                        <Link to="/">
                                            <img
                                                src=""
                                                alt="Logo"
                                                width={160}
                                                height={160}
                                            />
                                        </Link>
                                    </div>
                                    <nav className="mt-5 space-y-1 px-2">
                                        {/* mobile */}
                                        <Link
                                            to="/create-post"
                                            className="group flex items-center px-2 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-blue-500 hover:text-white mt-4"
                                        >
                                            <PencilIcon className="h-6 w-6 text-gray-500 group-hover:text-white" aria-hidden="true" /> {/* Ícono de la pluma */}
                                            <span className="ml-3">Create Post</span>
                                        </Link>
                                    </nav>
                                </div>
                                <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                                    <button onClick={() => setOpenLogoutModal(true)} className="group block flex-shrink-0">
                                        <div className="flex items-center">
                                            <div>
                                                <img
                                                    className="inline-block h-10 w-10 rounded-full"
                                                    src={user?.profile_image ? `http://localhost:8000${user.profile_image}` : ""}
                                                    alt="Profile Pic"
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{user?.email}</p>
                                                <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Ver perfil</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Cont. Principal */}
            <div className="flex-1 flex flex-col md:pl-64">
                <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
                    <button
                        type="button"
                        className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <main className="flex-1 border-l border-gray-200">
                    <div className="py-6">
                        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal Logout */}
            <Transition.Root show={openLogoutModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpenLogoutModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                    <div className="absolute top-2 right-2">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            onClick={() => setOpenLogoutModal(false)}
                                        >
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    <div>
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                            <CheckIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                                What do you want to do next?
                                            </Dialog.Title>
                                        </div>
                                    </div>

                                    <div className="mt-5 sm:mt-6 flex space-x-4">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:text-sm"
                                            onClick={goToProfile}
                                        >
                                            Profile
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                                            onClick={handleLogout}
                                        >
                                            Log out
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}

const mapStateToProps = (state) => ({
    user_loading: state.auth.user_loading || false,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
});

export default connect(mapStateToProps, {
    refresh,
    check_authenticated,
    load_user,
    logout
})(Layout);
