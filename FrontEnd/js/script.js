import { getCategories, fetchProjects, getToken } from "./api.js";
import { addGallery } from "./gallery.js";
import "./modal.js";

const url = "http://localhost:5678/api";

//récupération des projets
async function getProjects() {
    try {
        const projects = await fetchProjects();

        const categories = await getCategories();

        addGallery(projects);
        categoriesFilter(categories, projects)

    } catch (error) {
        console.error(error);
        alert("Impossible de chager les projets");
    }
}

getProjects();


//filtre des projets par catégories
function categoriesFilter(categories, projects) {
    const portfolio = document.querySelector("#portfolio");
    const gallery = document.querySelector(".gallery");

    const filter = document.createElement("div");
    filter.classList.add("filter");
    portfolio.insertBefore(filter, gallery);

    const allCategories = [{ id: 0, name: "Tous" }, ...categories];

    allCategories.forEach(category => {
        const button = document.createElement("button");
        button.innerText = category.name;
        button.addEventListener("click", () => {
            let filteredCategory;
            if (category.id === 0) {
                projects
                filteredCategory = projects
            } else {
                filteredCategory = projects.filter(project => project.categoryId === category.id)
            }

            addGallery(filteredCategory);
        });


        filter.appendChild(button);
    });

    if (getToken()) {
        filter.style.display = "none";
    }

    const title = document.querySelector(".portfolio-title");
    if (title) {
        title.classList.add("mb-portfolio");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (getToken()) {
        document.querySelector(".edit-btn").style.display = "flex";
    }
})


//gestion connexion et deconnexion au niveau de la nav
function handleLoginStatus() {
    const loginLink = document.querySelector('nav ul li a[href="connexion.html"]');

    if (getToken() && loginLink) {
        loginLink.textContent = "logout";
        loginLink.href = "#";

        loginLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.reload();
        });
    }
}

handleLoginStatus();