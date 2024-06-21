import { createForum, Forum } from './forum-service';

export function showPopup(existingForums: Forum[]): void {
    const formElement = document.createElement("div");
    formElement.innerHTML = `
        <form id="createForumForm">
            <label for="title">Fórum címe:</label><br>
            <input type="text" id="title" name="title" required><br><br>
            <label for="description">Fórum leírása:</label><br>
            <textarea id="description" name="description" rows="4" required></textarea><br><br>
            <button type="submit">Fórum létrehozása</button>
        </form>    
    `;

    formElement.querySelector("#createForumForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const titleInput = (event.target as HTMLFormElement).elements.namedItem("title") as HTMLInputElement;
        const descriptionInput = (event.target as HTMLFormElement).elements.namedItem("description") as HTMLTextAreaElement;

        const exists = existingForums.some(forum => forum.title.toLowerCase() === titleInput.value.toLocaleLowerCase());
        if (exists) {
            alert("Ez a cím már létezik");
            return;
        }

        try {
            const result = await createForum(titleInput.value, descriptionInput.value);
            if (result === true) {
                alert("Fórum létrehozva sikeresen!");
                window.location.reload();
            } else if (result && result.status === 400) {
                alert('Bevitt adatok érvénytelenek.')
            } else if (result && result.status === 401) {
                alert('Ismeretlen felhasználó, hiányzó vagy érvénytelen token.')
            } else if (result && result.status === 409) {
                alert('Megadott fórum már létezik ilyen címmel.')
            } else {
                throw new Error("Ismeretlen visszajelző tipus.")
            }
        } catch (error) {
            console.error(error);
            alert("Hiba történt a fórum létrehozása közben.");
        }
    });

    formElement.querySelector("#closeButton")?.addEventListener("click", () => {
        const popup = window.open("", "createForumPopup");
        if (popup) {
            popup.close();
        }
    });
    
    const popup = window.open("", "createForumPopup", "width=600,height=400");
    if (popup) {
        popup.document.body.appendChild(formElement);
    } else {
        alert("A felugró ablak megnyitása nem sikerült. Kérjük, engedélyezze a felugró ablakokat.");
    }
}