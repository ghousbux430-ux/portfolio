const name = "Full-Stack Developer";
const nameElement = document.getElementById("user-name");

const colors = [
    "#FF6B00",
    "#38bdf8",
    "#a855f7",
    "#22c55e"
];

let index = 0;
let deleting = false;
let colorIndex = 0;

function typeName() {

    nameElement.style.color = colors[colorIndex];

    if (!deleting) {
        nameElement.textContent = name.substring(0, index + 1);
        index++;

        if (index === name.length) {
            deleting = true;

            setTimeout(typeName, 1500);
            return;
        }

    } else {
        nameElement.textContent = name.substring(0, index - 1);
        index--;

        if (index === 0) {
            deleting = false;
            colorIndex++;
            if (colorIndex === colors.length) {
                colorIndex = 0;
            }
        }
    }
    setTimeout(typeName, deleting ? 70 : 120);
}
typeName();

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const formData = new FormData(contactForm);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/contact",
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.json();

            alert(result.message);

            contactForm.reset();

        } catch (error) {

            alert("Failed to send message.");

        }

    });

}
