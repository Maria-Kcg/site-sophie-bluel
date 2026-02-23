function addListenerSubmitForm() {
    const loginForm = document.querySelector(".login-form");
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const infos = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        };

        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(infos)
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            window.localStorage.setItem("token", data.token);
            window.location.href = "index.html";
        } else {
            alert("Erreur dans l’identifiant ou le mot de passe");
        }
    })
}
addListenerSubmitForm();