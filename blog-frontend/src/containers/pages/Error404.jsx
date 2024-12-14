function Error404() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 text-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
                <p className="text-xl text-gray-700 mb-6">Oops! The page you are looking for does not exist.</p>
                <a
                    href="/dashboard"
                    className="text-blue-500 hover:text-blue-700 text-lg font-medium"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
}

export default Error404;