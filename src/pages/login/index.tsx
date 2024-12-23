import {useRef} from "react";
import {LoginFormRef} from "@pages/login/index.type.ts";
import LoginForm from "@components/form/login";
import {useAuth} from "@context/auth";
import {useNavigate} from "react-router-dom";


const Login = ()=>{

    const formRef = useRef<LoginFormRef>(null);
    const navigate = useNavigate(); // Initialize navigate
    const { login } = useAuth();

    const handleLoginSuccess = (token: string) => {
        login(token);
        navigate("/dashboard");
    };

    return (
        <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
            <LoginForm ref={formRef} onLoginSuccess={handleLoginSuccess}/>
        </div>
    );
}


export default Login;
