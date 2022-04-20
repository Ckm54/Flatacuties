document.addEventListener("DOMContentLoaded", () => {
    const charactercontainer = document.getElementById("character-bar");
    const characterInfoContainer = document.querySelector("div.characterInfo")

    fetch("http://localhost:3000/characters")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            displayCharacter(element)
            displayCharacterDetails(1)
        });
    })

    function displayCharacter(character) {
        const spanContainer = document.createElement("span")
        spanContainer.innerText = character.name
        charactercontainer.append(spanContainer)

        spanContainer.addEventListener("click", function(){
            displayCharacterDetails(character.id)
        })
    }

    function displayCharacterDetails(id) {
        fetch(`http://localhost:3000/characters/${id}`)
        .then(response => response.json())
        .then(character => {
            const itemContainer = `
            <div id="detailed-info">
                <p id="name">${character.name}</p>
                <img
                id="image"
                src="${character.image}"
                alt="${character.name}"
                /><!-- display character image here -->
                <h4>Total Votes: <span id="vote-count">${character.votes}</span></h4>
                <form id="votes-form">
                <input type="text" placeholder="Enter Votes" id="votes" name="votes" />
                <input type="submit" value="Add Votes" />
                </form>
                <button id="reset-btn">Reset Votes</button>
            </div>
            <h4>Add New Character</h4>
            <form id="character-form">
            <div>
                <label for="name">Name</label>
                <input type="text" id="name" name="name" />
            </div>
            <div>
                <label for="image-url">Image URL</label>
                <input type="text" id="image-url" name="image-url" />
            </div>
            <input type="submit" value="Add Character" />
            </form> 
            `
            characterInfoContainer.innerHTML = ''
            characterInfoContainer.innerHTML = itemContainer
            const votesContainer = characterInfoContainer.querySelector("#vote-count")
            const resetButton = characterInfoContainer.querySelector("#reset-btn")
            const addCharacterForm = characterInfoContainer.querySelector("#character-form")

            const updateVoteForm = characterInfoContainer.querySelector("#votes-form")
            updateVoteForm.addEventListener("submit", function(e) {
                e.preventDefault();
                const inputVotes = parseInt(updateVoteForm["votes"].value)
                if(inputVotes){
                    updateCharacterVotes(character, inputVotes, votesContainer)
                }else {
                    alert("please insert a number")
                }
                updateVoteForm.reset()
            })

            resetButton.addEventListener("click", function() {
                updateCharacterVotes(character, 0, votesContainer)
            })

            addCharacterForm.addEventListener("submit", function(e) {
                e.preventDefault()
                const data = {
                    name: addCharacterForm["name"].value,
                    image: addCharacterForm["image-url"].value,
                    votes: 0
                }
                addNewCharacter(data)
                addCharacterForm.reset()
            })
        })
    }

    function updateCharacterVotes(character, voteInput, container) {

        fetch(`http://localhost:3000/characters/${character.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: character.id,
                name: character.name,
                image: character.image,
                votes: voteInput
            })
        })
        .then(response => response.json())
        .then(data => {
            container.innerText = data.votes
        })
    }

    function addNewCharacter(data) {
        fetch(`http://localhost:3000/characters/`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            displayCharacter(data)
        })
    }
})
