document.addEventListener("DOMContentLoaded", () => {
    const charactercontainer = document.getElementById("character-bar");

    fetch("http://localhost:3000/characters")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            console.log(element)
            displayCharacter(element)
        });
    })

    function displayCharacter(character) {
        const spanContainer = document.createElement("span")
        spanContainer.innerText = character.name
        charactercontainer.append(spanContainer)
    }
})
