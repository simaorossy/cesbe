import React from 'react'
import { useParams, useHistory } from "react-router-dom";

export default function ReadDocument() {
    const history = useHistory();
    const { id } = useParams();
    localStorage.setItem('SendID', id);
    history.push({
        pathname: '/'
    });
    //http://localhost:3000/readdocument/2
    return (
        <>  
        </>
    )
}
