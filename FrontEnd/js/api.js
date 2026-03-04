//fonction pour récupérer le token et le header 
export function getToken() {
    return localStorage.getItem("token");
}

export function authentToApi() {
    return {
        "Content-type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }
}

//base de l'url de l'api
const url = "http://localhost:5678/api";


//récupération des catégories
export async function getCategories() {
    try {
        const response = await fetch(`${url}/categories`);

        if (!response.ok) {
            throw new Error("Impossible de charger les catégories")
        }

        const categories = await response.json();
        return categories;

    } catch (error) {
        console.error(error)
        alert("Impossible de charger les catégories");
    }
}

//pour rappeler les projets
export async function fetchProjects() {
    try {
        const response = await fetch(`${url}/works`);
        if (!response.ok) {
            throw new Error("imposible de recharder les projets");
        }

        return await response.json();
        
    } catch (error) {
        console.error(error);
        alert("imposible de recharder les projets")
    }
}

