import {useRef} from "react";
import {LoginFormRef} from "@pages/login/index.type.ts";
import LoginForm from "@components/form/login";


const Login = ()=>{

    const formRef = useRef<LoginFormRef>(null);

    const handleLoginSuccess = (token: string) => {
        alert(`Login successful! Token: ${token}`);
    };

    return (
        <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
            <LoginForm ref={formRef} onLoginSuccess={handleLoginSuccess}/>
        </div>
    );
}


export default Login;
