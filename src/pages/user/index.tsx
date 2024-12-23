import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpService } from "@context/http";
import {User} from "@pages/dashboard/index.type.ts";
import DeleteModal from "@components/modal/deleteUserConfirmation";


const UserDetail: React.FC = () => {
    const { userId } = useParams<{ userId: string }>(); // Get the userId from the URL
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const httpService = useHttpService();
    const navigate = useNavigate();

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await httpService.get<{ data: User }>(`/users/${userId}`);
            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching user:", err);
            setError("Failed to fetch user details");
        } finally {
            setLoading(false);
        }
    };

    const updateUser = () => {
        navigate(`/users/${userId}/edit`);
    };

    const deleteUser = async () => {
        try {
            await httpService.delete(`/users/${userId}`);
            alert("User deleted successfully");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user");
        }
    };


    useEffect(() => {
        fetchUser();
    }, [userId]);

    if (loading) {
        return <div className="p-6">Loading user details...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    if (!user) {
        return <div className="p-6 text-gray-500">User not found</div>;
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <button
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                    onClick={() => navigate(-1)} // Navigate to the previous page
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                    Back
                </button>
            </div>
            <h1 className="text-2xl font-bold mb-4">User Details</h1>
            <div className="border p-4 rounded shadow">
                <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-32 h-32 rounded-full mb-4"
                />
                <h2 className="text-lg font-semibold">{`${user.first_name} ${user.last_name}`}</h2>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-4 flex gap-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={updateUser}
                    >
                        Update
                    </button>
                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={deleteUser}
                    />
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
