import { render } from 'solid-js/web';
import './index.css';
import { Router } from '@solidjs/router'
import App from './App';

render(() => (
        <Router>
            <App />
        </Router>
    ),
    document.getElementById('app')
);