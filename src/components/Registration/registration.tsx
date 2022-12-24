import { SubmitHandler, useForm } from "react-hook-form";
import AuthService from "service/auth-service";

type Inputs = {
    email: string,
    password: string,
    confirmPassword: string,
};

type propsType = {
    login: (response: any) => Promise<void>,
    setRegistration: React.Dispatch<React.SetStateAction<boolean>>
}

const Registration: React.FC<propsType> = ({login, setRegistration}) => {
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
            const response = await AuthService.registration(data.email, data.password);
            login(response);
        } catch (error: any) {
            console.log(error);
            setError('email',{type: 'custom', message: error.response.data.message});
        }
    };


    return(
        <div className='mainWrapper'>
            <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <h1>Регистрация</h1>

                {errors.email ? <div style={{marginBottom: '5px', fontSize: '12px'}}>
                                    <p>{errors.email?.message}</p>
                                </div> : 
                                <div style={{marginBottom: '5px', height: '20px'}}></div>}
                <input className='input'
                    {...register("email", { required: 'Укажите свой Email для регистрации', 
                            pattern:{
                                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: 'Введён не корректный Email'
                            }
                        })
                    } 
                    placeholder='Email'
                />

                <div style={{height: '20px', marginTop: '5px', fontSize: '12px'}}>{errors.password && <p>{errors.password?.message}</p>}</div>
                <input className='input'
                    {...register("password", 
                        { required: 'Вы не ввели пароль', 
                            minLength:{
                                value: 8,
                                message: 'Короткий пароль'
                            },
                            pattern:{
                                value:  /^(?=.*\d)(?=.*[!@#$%^&*.,])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                                message: 'Введён не валидный пароль'
                            }
                        })
                    } 
                    placeholder='Password' type='password'
                />
                
                <div style={{height: '20px', marginTop: '5px', fontSize: '12px'}}>{errors.confirmPassword && <p>{errors.confirmPassword?.message}</p>}</div>
                <input className='input'
                    {...register("confirmPassword", { 
                            required: 'Вы не ввели пароль повторно',
                            validate: (val: string) => {
                                if (watch('password') !== val) {
                                  return "Пароли не совпадают";
                                }
                            },
                        })
                    } 
                    placeholder='Confirm password' type='password'
                />

                <input className='input' type="submit" />

                <div style={{display:'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                    <div onClick={() => setRegistration(false)} style={{color:'white', cursor: 'pointer'}}>Есть аккаунт?</div>
                </div>
            </form>
        </div>
    )

}

export default Registration;