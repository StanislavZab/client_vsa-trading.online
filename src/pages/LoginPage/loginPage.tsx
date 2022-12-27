
import Login from 'components/Login/login';
import Registration from 'components/Registration/registration';
import { useState } from 'react';
import { setAuth, setUser, useAppDispatch } from 'store';
import style from './style.module.css';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const [registration, setRegistration] = useState<boolean>(false);
    
    const login = async (response: any) => {
        if(response.data){
            localStorage.setItem('token', response.data.accessToken);
            dispatch(setAuth(true));
            dispatch(setUser({email: response.data.user.email, id: response.data.user.id, role: response.data.user.role.split(' '), isActivated: response.data.user.isActivated}));
        }
    }

    return (
        <div className={style.pageWrapper}>
            {registration ? 
                <Registration login={login} setRegistration={setRegistration}/>:
                <Login login={login} setRegistration={setRegistration}/>
            }
        </div>
    )
}

export default LoginPage;