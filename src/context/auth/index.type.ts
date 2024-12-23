

export interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    user: { id: number; avatar: string; name: string; email: string } | null;
    logout: () => void;
}
