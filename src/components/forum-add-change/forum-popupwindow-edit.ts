import { updateForum, Forum } from "./forum-service";

export function showEditPopup(forum: Forum, existingForums: Forum[]): void {
    const formElement = document.createElement("div");
    formElement.innerHTML = `
        <form id="editForumForm">
            <label for="title">Fórum címe:</label><br>
            <input type="text" id="title" name="title" value="${forum.title}" required><br><br>
            <label for="description">Fórum leírása:</label><br>
            <textarea id="description" name="description" rows="4" required>${forum.description}</textarea><br><br>
            <button type="submit">Fórum módosítása</button>
            <button type="button" id="closeButton">Bezárás</button>
        </form>
    `;

    formElement.querySelector("#editForumForm")?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const titleInput = (event.target as HTMLFormElement).elements.namedItem("title") as HTMLInputElement;
        const descriptionInput = (event.target as HTMLFormElement).elements.namedItem("description") as HTMLTextAreaElement;

        const exists = existingForums.some(existingForum =>
            existingForum.title.toLocaleLowerCase() === titleInput.value.toLocaleLowerCase() && existingForum.title !== forum.title);
        if (exists) {
            alert("Ez a cím már létezik.");
            return;
        }

        try {
            const result = await updateForum(forum.title, titleInput.value, descriptionInput.value);
            if (result === true) {
                alert("Forum edited successfully!");
                window.location.reload();
            } else if (result && result.status === 400) {
                alert(`Bevitt adatok érvénytelenek.`);
            } else if (result && result.status === 401) {
                alert(`Ismeretlen felhasználó, hiányzó vagy érvénytelen token.`);
            } else if (result && result.status === 403) {
                alert(`Hozzáférés megtagadva, nem a felhasználó a fórum tulajdonosa.`);
            } else if (result && result.status === 409) {
                alert(`A megadott fórum már létezik ilyen címmel.`);
            } else {
                throw new Error("Ismeretlen visszajelző tipus.");
            }
        } catch (error) {
            console.error(error);
            alert("Hiba történt a fórum módosítása közben.");
        }
    });

    formElement.querySelector("#closeButton")?.addEventListener("click", () => {
        const popup = window.open("", "editForumPopup");
        if (popup) {
            popup.close();
        }
    });

    const popup = window.open("", "editForumPopup","width=600,height=400");
    if (popup) {
        popup.document.body.appendChild(formElement);
    } else {
        alert("A felugró ablak megnyitása nem sikerült. Kérjük, engedélyezze a felugó ablakokat.");
    }
}