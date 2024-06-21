import { title } from "process";

export interface Forum {
    id: string;
    title: string;
    description: string;
    createdBy: string;
}

export async function createForum(title: string, description: string): 
    Promise<boolean | { status: number; message: string }> {
    if (!title || title.length === 0) {
        return { status: 400, message: 'Fórum cím megadása kötelező.' };
    }

    if (title.length > 100) {
        return { status: 400, message: 'Fórum címe maximum 100 karakter lehet.' };
    }

    if (!description || description.length === 0) {
        return { status: 400, message: 'Fórum leírása megadása kötelező.' };
    }

    if (description.length > 250) {
        return { status: 400, message: 'Fórum leírása maximum 250 karakter lehet.' };
    }

    try {
        const response = await fetch('http://localhost:5000/forum', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ title, })
        });

        if (response.ok) {
            return true;
        } else {
            const errorData = await response.json();
            return { status: response.status, message: errorData.message };
        }
    } catch (error) {
        return { status: 500, message: 'Internal Server Error'}
    }
}

export async function updateForum (forumId: string, title: string, description: string): 
    Promise<boolean | { status: number; message: string }> {

    if (!title || title.length === 0) {
        return { status: 400, message: 'Fórum cím megadása kötelező.' };
    }

    if (title.length > 100) {
        return { status: 400, message: 'Fórum címe maximum 100 karakter lehet.' };
    }

    if (!description || description.length === 0) {
        return { status: 400, message: 'Fórum leírása megadása kötelező.' };
    }

    if (description.length > 250) {
        return { status: 400, message: 'Fórum leírása maximum 250 karakter lehet.' };
    }

    try {
        const response = await fetch('http://localhost:5000/forum/${forumId}', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify({ title, description })
        });

        if (response.ok) {
            return true;
        } else {
            const errorData = await response.json();
            return { status: response.status, message: errorData.message };
        }
    } catch (error) {
        return { status: 500, message: 'Internal Server Error' };
    }
}
