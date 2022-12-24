import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthService from "service/auth-service";

import './login.css'

type Inputs = {
    email: string,
    password: string,
    confirmPassword: string,
};

type propsType = {
    login: (response: any) => Promise<void>,
    setRegistration: React.Dispatch<React.SetStateAction<boolean>>
}

const Login: React.FC<propsType> = ({login, setRegistration}) => {
    const [responseError, setResponseError] = useState<{error: boolean, message: string}>({error: false, message: ''});
    
    const { register, 
        handleSubmit, 
        setError,
        watch, 
        formState: { errors } 
    } = useForm<Inputs>({
        criteriaMode: "all",
        mode: 'onSubmit'
    });
    
    const onSubmit: SubmitHandler<Inputs> = async(data) => {
        try {
            const response = await AuthService.login(data.email, data.password);
            login(response);
        } catch (error: any) {
            console.log(error.response?.data?.message);
            setResponseError({error: true, message: error.response?.data?.message});
        }
    };

    if(responseError.error){
        return(
            <>
                <form className='form' onSubmit={handleSubmit(onSubmit)}>
                    <h1>Авторизация</h1>
                    <div>
                        <p>{responseError.message}</p>
                        <button onClick={() => setResponseError({error: false, message: ''})}>назад</button>
                    </div> 
                </form>
            </>
        )
    }


    return(
        <div className='mainWrapper'>
            <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <h1>Авторизация</h1>

                {errors.email ? 
                    <div style={{marginBottom: '5px', fontSize: '12px'}}>
                        <p>{errors.email?.message}</p>
                    </div> : 
                    <div style={{marginBottom: '5px', height: '20px'}}></div>
                }
                <input className='input' {...register("email", { required: 'Укажите свой Email'})} placeholder='Email'/>

                <div style={{height: '20px', marginTop: '5px', fontSize: '12px'}}>
                    {errors.password && <p>{errors.password?.message}</p>}
                </div>
                <input className='input' {...register("password", { required: 'Вы не ввели пароль'})} placeholder='Password' type='password'/>

                <input className='input' type="submit" value='ВОЙТИ'/>
                <div style={{display:'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                    <div onClick={() => setRegistration(true)} style={{color:'white', cursor: 'pointer'}}>Регистрация</div>
                    <div style={{color:'white', cursor: 'pointer'}}>Забыли пароль?</div>
                </div>
            </form>
        </div>
    )
}

export default Login;