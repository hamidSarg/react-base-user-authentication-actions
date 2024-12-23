export interface LoginFormProps {
    onLoginSuccess: (token: string) => void;
}

export interface LoginFormRef {
    resetForm: () => void;
}
