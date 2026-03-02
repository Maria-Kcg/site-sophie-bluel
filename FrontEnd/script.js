//fonction pour récupérer le token et le header 
function getToken() {
    return localStorage.getItem("token");
}

function authentToApi() {
    return {
        "Content-type": "application/json",
        "Authorization": `Bearer ${getToken()}`
    }
}

//bsae de l'url de l'api
const url = "http://localhost:5678/api";

//récupération des projets
async function getProjects() {
    try {
        const response = await fetch(`${url}/works`);

        if (!response.ok) {
            throw new Error("Impossible de chager les projets")
        }
        const projects = await response.json();

        const categories = await getCategories();

        addGallery(projects);
        categoriesFilter(categories, projects)
    } catch (error) {
        console.error(error)
    }
}

getProjects();


//ajout des projets à l'écran
function addGallery(projects) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i]

        const figure = document.createElement("figure");
        const img = document.createElement("img")

        img.src = project.imageUrl;
        img.alt = project.title;

        const figcaption = document.createElement("figcaption")
        figcaption.innerHTML = project.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

//récupération des catégories
async function getCategories() {
    try {
        const response = await fetch(`${url}/categories`);

        if (!response.ok) {
            throw new Error("Impossible de charger les catégories")
        }

        const categories = await response.json();
        return categories;
    } catch (rerro) {
        console.error(error)
    }
}

//getCategories();


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

//modale: modification de la gallerie
const modal = document.getElementById("modal");
const editBtn = document.querySelector(".edit-btn");
const closeModal = document.querySelector(".close-modal")

editBtn.addEventListener("click", async function () {
    const projects = await fetchProjects();
    addModalGallery(projects);

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

})

closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");

    addView.style.display = "none";
    galleryView.style.display = "block";
})

//suppression dans la modale
async function deleteProject(id) {
    try {
        const response = await fetch(`${url}/works/${id}`, {
            method: "DELETE",
            headers: authentToApi()
        });

        if (response.ok) {
            const updatedProjects = await fetchProjects();
            addGallery(updatedProjects);
            addModalGallery(updatedProjects);
            alert("Projet supprimé!!")
        } else {
            throw new Error("Echec de la suppression")
        }
    } catch (error) {
        console.error(error)
    }
}

function addModalGallery(projects) {
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = ""

    projects.forEach(project => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = project.imageUrl;
        img.alt = project.title;

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.addEventListener("click", async () => {
            await deleteProject(project.id);
        });

        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        modalGallery.appendChild(figure);
    });
}

async function fetchProjects() {
    try {
        const response = await fetch(`${url}/works`);
        if (!response.ok) {
            throw new Error("imposible de recharder les projets")
        }
        return await response.json();
    } catch (error) {
        console.error(error)
    }
}

//ajout de photo
const galleryView = document.getElementById("modal-gallery-view");
const addView = document.getElementById("modal-add-view");

const addPhotoBtn = document.querySelector(".btn-add-photo");
const backBtn = document.querySelector(".btn-back");

addPhotoBtn.addEventListener("click", function () {
    galleryView.style.display = "none";
    addView.style.display = "block";
});

backBtn.addEventListener("click", function () {
    addView.style.display = "none";
    galleryView.style.display = "block";
});

const titleInput = document.getElementById("form-title");
const validateBtn = document.querySelector(".btn-validate");
const addWorkForm = document.getElementById("add-work");

//pour afficher l'image sélectionnée
const fileInput = document.getElementById("file-upload");
const imagePreview = document.getElementById("image-preview");

fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";


            document.querySelector("#drop-zone label").style.display = "none";
            document.querySelector("#drop-zone p").style.display = "none";
        };
        reader.readAsDataURL(file);
    }
    checkFormValidity();
});

const categorySelect = document.getElementById("form-category");

function checkFormValidity() {
    if (fileInput.files.length > 0 && titleInput.value && categorySelect.value) {
        validateBtn.disabled = false;
    } else {
        validateBtn.disabled = true;
    }
}

titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);


async function selectCategories() {
    try {
        const response = await fetch(`${url}/categories`);

        if (!response.ok) {
            throw new Error("Impossible de charger les catégories");
        }

        const categories = await response.json();

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }

}

selectCategories();

addWorkForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
        const response = await fetch(`${url}/works`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${getToken()}` },
            body: formData

        });

        if (response.ok) {
            addWorkForm.reset();
            imagePreview.style.display = "none";
            validateBtn.disabled = true;

            addView.style.display = "none";
            galleryView.style.display = "block";

            const projects = await fetchProjects();

            addGallery(projects);
            addModalGallery(projects);
        } else {
            alert("Erreur lors de l'ajout du projet !");
        }
    } catch (error) {
        console.error(error)
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