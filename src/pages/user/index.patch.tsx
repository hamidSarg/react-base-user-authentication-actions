import React, { FormEvent, useEffect, useState, useCallback, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpService } from "@context/http";
import { User } from "@pages/dashboard/index.type.ts";

const EditUser: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const httpService = useHttpService();
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
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
    }, [httpService, userId]);

    const updateUser = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();
            if (!user) return;

            setSaving(true);
            try {
                await httpService.put(`/users/${userId}`, {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                });
                alert("User updated successfully");
                navigate(`/users/${userId}`);
            } catch (err) {
                console.error("Error updating user:", err);
                alert("Failed to update user");
            } finally {
                setSaving(false);
            }
        },
        [httpService, navigate, user, userId]
    );

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useLayoutEffect(() => {
        if (user) {
            console.log(`Editing user: ${user.first_name} ${user.last_name}`);
        }
    }, [user]);

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
            <h1 className="text-2xl font-bold mb-4">Edit User</h1>
            <form className="border p-4 rounded shadow" onSubmit={updateUser}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={user.first_name}
                        onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                        className="mt-1 block w-full px-4 py-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={user.last_name}
                        onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                        className="mt-1 block w-full px-4 py-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="mt-1 block w-full px-4 py-2 border rounded-md"
                    />
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={() => navigate(`/users/${userId}`)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
