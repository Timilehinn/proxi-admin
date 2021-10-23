import React from 'react'
import { Helmet } from 'react-helmet';


function Four() {
    return (
        <div style={{height: '100vh', backgroundColor: '#f1f1f1', width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
            <Helmet>
                <title>404 page not found</title>
            </Helmet>
            <div style={{width: '300px', textAlign: 'center'}}>
                <h1 style={{ fontSize: '5rem', margin: 0, color: 'blue'}}>404</h1>
                <span style={{fontSize: '.9rem', color: 'blue'}}>Page Not Found</span>
                <p style={{fontSize: '.9rem', color: 'grey'}}>The page you are looking for doesn't exist or has been moved. Go back to previous page</p>
            </div>
        </div>
    )
}

export default Four;
