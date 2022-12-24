import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './store';
import { selectUserState, setAuth, setUser, setLoad, setErrorSocket } from 'store';
import axios from 'axios';
import jwt from 'jwt-decode'
import { API_URL } from './api/index';

import ChartPage from 'pages/ChartPage/ChartPage';
import LoginPage from 'pages/LoginPage/loginPage';





type tokenType = {
	exp: number,
	iat: number,
	email: string,
	id: number,
	role: string,
	isActivated: boolean
}

function App() {
	const { isAuth, isLoad, user, errorSocket } = useAppSelector(selectUserState);
	const dispatch = useAppDispatch();
    const [rect, setRect] = useState({width: document.documentElement.clientWidth, height: document.documentElement.clientHeight});
  
	const resizeHandler = () => {
		setRect({width: document.documentElement.clientWidth, height: document.documentElement.clientHeight});
	}

	useEffect(() => {
		window.addEventListener('resize', resizeHandler);
		const token = localStorage.getItem('token');
		if(token){
			const decodedToken: tokenType = jwt(token);
			const currentDate = new Date();

			// JWT exp is in seconds
			if (decodedToken.exp * 1000 < currentDate.getTime()) {
				axios.get(`${API_URL}/refresh`, {withCredentials: true,})
					.then((response) => {
						localStorage.setItem('token', response.data.accessToken);
						dispatch(setUser({email: response.data.user.email, id: response.data.user.id, role: response.data.user.role.split(' '), isActivated: response.data.user.isActivated}));
						dispatch(setAuth(true));
						
					}).catch((error) => {
						dispatch(setErrorSocket(error));
					})
			} else {
				dispatch(setUser({email: decodedToken.email, id: decodedToken.id, role: decodedToken.role.split(' '), isActivated: decodedToken.isActivated}));
				dispatch(setAuth(true));
			}
		}else{
			dispatch(setLoad(true));
		}
		
		//dispatch({type: 'CONNECT'});
		return () => {
			window.removeEventListener('resize', resizeHandler);
		}
	}, [])

	if(!isLoad) return  <h1>{errorSocket === '' ? 'Загрузка...' : errorSocket}</h1>;
	
	return (
		<Routes>
			<Route path='/' element={isAuth ? <ChartPage width={rect.width} height={rect.height}/> : <LoginPage/>} />
		</Routes>
	);
}

export default App;
