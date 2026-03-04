//ajout des projets à l'écran
export function addGallery(projects) {
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