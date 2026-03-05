import { getCategories, fetchProjects, getToken, authentToApi } from "./api.js";
import { addGallery } from "./gallery.js";

const url = "http://localhost:5678/api";

//modale: modification de la gallerie
const modal = document.getElementById("modal");
const editBtn = document.querySelector(".edit-btn");
const closeModal = document.querySelector(".close-modal")

editBtn.addEventListener("click", async function () {
    try {
        const projects = await fetchProjects();
        addModalGallery(projects);

        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
    } catch (error) {
        console.error(error);
        alert("Impossible de charger la modale");
    }
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
            headers: { "Authorization": `Bearer ${getToken()}` }
        });

        if (!response.ok) {
            console.log("Statut HTTP :", response.status, localStorage.getItem("token"));
            throw new Error(`Suppression échouée`);
        }

        const updatedProjects = await fetchProjects();
        addGallery(updatedProjects);
        addModalGallery(updatedProjects);

    } catch (error) {
        console.error(error)
        alert("Echec de la suppression")
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
        const categories = await getCategories();

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
