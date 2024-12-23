import { useEffect, useState, useMemo, useCallback, useLayoutEffect, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpService } from "@context/http";
import { useAuth } from "@context/auth";
import LogoutModal from "@components/modal/logoutConfirmation";
import { User } from "@pages/dashboard/index.type.ts";

const Dashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition(); // Manage non-urgent updates
    const httpService = useHttpService();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const fetchUsers = useCallback(async (pageNumber: number) => {
        try {
            const response = await httpService.get<{ data: User[]; total_pages: number }>(
                `/users?page=${pageNumber}`
            );
            setUsers(response.data);
            setTotalPages(response.total_pages);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }, [httpService]);

    const pageNumbers = useMemo(() => {
        return Array.from({ length: 3 }, (_, i) => i + page - 1).filter(
            (p) => p > 0 && p <= totalPages
        );
    }, [page, totalPages]);

    const handleUserClick = useCallback(
        (userId: number) => {
            navigate(`/users/${userId}`);
        },
        [navigate]
    );

    const handlePageChange = useCallback(
        (newPage: number) => {
            if (newPage > 0 && newPage <= totalPages) {
                startTransition(() => {
                    setPage(newPage);
                });
            }
        },
        [totalPages]
    );

    const handleLogout = useCallback(() => {
        logout();
        navigate("/login");
    }, [logout, navigate]);

    useEffect(() => {
        fetchUsers(page);
    }, [fetchUsers, page]);

    useLayoutEffect(() => {
        console.log("Dashboard layout rendered!");
    }, [users, page]);

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                {user && (
                    <div className="flex items-center gap-4">
                        <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full"
                        />
                        <div>
                            <p className="text-lg font-semibold">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                )}
                <LogoutModal
                    isOpen={isLogoutModalOpen}
                    onClose={() => setIsLogoutModalOpen(false)}
                    onConfirm={handleLogout}
                />
                <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </header>

            <h1 className="text-2xl font-bold mb-4">User List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
                        onClick={() => handleUserClick(user.id)}
                    >
                        <img
                            src={user.avatar}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="w-16 h-16 rounded-full mb-2"
                        />
                        <h2 className="text-lg font-semibold">{`${user.first_name} ${user.last_name}`}</h2>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="mt-2">
                            <button
                                className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => handleUserClick(user.id)}
                            >
                                Go to User Detail Page
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center mt-6">
                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>

                {pageNumbers.map((p) => (
                    <button
                        key={p}
                        className={`px-4 py-2 rounded mx-1 ${
                            p === page ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                        }`}
                        onClick={() => handlePageChange(p)}
                    >
                        {p}
                    </button>
                ))}

                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 ml-2"
                    disabled={page === totalPages}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
            </div>

            {isPending && <div className="text-center mt-4">Loading...</div>}
        </div>
    );
};

export default Dashboard;
