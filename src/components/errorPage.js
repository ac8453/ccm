import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
function ErrorPage() {
    const message = 'Page not found!';
    const navigate = useNavigate();
    return <><h1>{message}</h1>
        <Button onClick={() => { navigate('/') }}>Take me home</Button>
    </>;
}

export default ErrorPage;