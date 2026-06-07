const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

/* REGISTER */
if (registerBtn) {

    registerBtn.addEventListener("click", () => {

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        if (!name || !email || !password) {
            alert("Fill all fields");
            return;
        }

        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const exists =
            users.find(user => user.email === email);

        if (exists) {
            alert("User already exists");
            return;
        }

        users.push({
            name,
            email,
            password
        });

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        alert("Registration Successful");

        window.location.href = "login.html";
    });
}

/* LOGIN */
if (loginBtn) {

    loginBtn.addEventListener("click", () => {

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const users =
            JSON.parse(localStorage.getItem("users")) || [];

        const validUser =
            users.find(user =>
                user.email === email &&
                user.password === password
            );

        if (!validUser) {
            alert("Invalid Credentials");
            return;
        }

        localStorage.setItem(
            "currentUser",
            JSON.stringify(validUser)
        );

        window.location.href = "dashboard.html";
    });
}