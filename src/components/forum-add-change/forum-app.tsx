import React, { useState, useEffect } from "react";
import { showPopup } from "./forum-popupwindow-add";
import { showEditPopup } from "./forum-popupwindow-edit";
import { Forum } from './forum-service';
import useUserData from "../../auth/auth";

const App: React.FC = () => {
    const [forums, setForums] = useState<Forum[]>([]);
    const { isLoggedIn } = useUserData();

    useEffect(() => {
        async function fetchForums() {
            const response = await fetch('http://localhost:5000/forums');
            const data = await response.json();
            setForums(data);
        }

        fetchForums();
    }, []);

    const handleCreateForumClick = () => {
        if (isLoggedIn) {
           showPopup(forums); 
        } else {
            alert("A fórum létrehozásához be kell jelentkezni.");
        }
    };

    const handleEditForumClick = (forum: Forum) => {
        if (isLoggedIn) {
            showEditPopup(forum, forums);
        } else {
            alert("A fórumok módosításához be kell jelentkezni.");
        }
    };

    return (
        <div>
            <h1>Fórum alkalmazás</h1>
            <button onClick={handleCreateForumClick}>Új fórum létrehozása</button>
            <ul>
                {forums.map(forum => (
                    <li key={forum.title}>
                        <h2>{forum.title}</h2>
                        <p>{forum.description}</p>
                        <button onClick={() => handleEditForumClick(forum)}>Fórum módosítása</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
