﻿document.addEventListener("DOMContentLoaded", () => {
    const authButton = document.getElementById("auth-button");
    if (authButton) {
        authButton.addEventListener('click', authButtonClick);
    }
    else {
        console.error("Element not found: auth-button");
    }
    // все "карандаши" - кнопки редактирования
    for (let pencil of document.querySelectorAll("[data-edit]")) {
        pencil.addEventListener('click', editProfileClick);
    }
    const emailConfirmButton = document.getElementById("email-confirm-btn");
    if (emailConfirmButton) {
        emailConfirmButton.addEventListener('click', confirmEmailClick);
    }
});

function editProfileClick(e) {
    const p = e.target.closest('p');
    const span = p.querySelector('span');
    span.setAttribute('contenteditable', 'true');
    span.dataset.innerText = span.innerText;
    span.onblur = editableBlur;
    span.onkeydown = editableKeydown;
    span.focus();
}
function editableBlur(e) {
    e.target.removeAttribute('contenteditable');
    console.log(e.target.innerText);
    if (e.target.dataset.innerText === e.target.innerText) return
    // TODO: если почта не изменилась, то не отсылать данные
    fetch("/User/UpdateEmail?email=" + e.target.innerText, {
        method: "POST"
    }).then(r => r.json()).then(j => {
        console.log(j);
    });
}
function editableKeydown(e) {
    if (e.keyCode == 13) {  // Enter
        e.preventDefault();
        e.target.blur();
    }
    // console.log(e);
}


function authButtonClick() {
    const authLogin = document.getElementById("auth-login");
    if (!authLogin) throw "Element not found: auth-login";
    const authPassword = document.getElementById("auth-password");
    if (!authPassword) throw "Element not found: auth-password";
    if (authLogin.value.length === 0) {
        alert("Необхідно ввести логін");
        return;
    }
    if (authPassword.value.length === 0) {
        alert("Необхідно ввести пароль");
        return;
    }
    // передаем данные на сервер асинхронно
    window
        .fetch(                // отсылка запроса
            "/User/Auth", {    // URL - адрес запроса
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    login: authLogin.value,
                    password: authPassword.value
                })
            }
        )
        .then(r => r.json())   // ответ => извлечение тела как JSON Объекта
        .then(j => {           // результат извлечения тела
            // console.log(j);
            if (j.success == true) {
                location = location;
            }
        });
}

function confirmEmailClick(e) {
    const codeInput = document.getElementById("email-confirm");

    fetch("/User/ConfirmEmail?code=" + codeInput.value, {
        method: "POST"
    }).then(r => r.json()).then(j => {
        console.log(j);
        if (j.success == true) {
            location = location;
            return;
        }
         
        const messageSpan = document.getElementById("email-confirm-message");
        messageSpan.style.display = '';
        messageSpan.innerText = j.message;

    });
}