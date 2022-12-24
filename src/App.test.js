import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter } from "react-router-dom";

test('test app',() => {
    render(<Provider store={store}><BrowserRouter><App/></BrowserRouter></Provider>);
    const linkElement = screen.getAllByText(/Авторизация/i);
    expect(linkElement).toBeInTheDocument();
})