import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NoAccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            navigate(-1);
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '36px',
            color: 'red'
        }}>
            <div>You are not authorized to access this page</div>
        </div>
    );
}

export default NoAccess;
