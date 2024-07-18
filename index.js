// Constants
const BASE_URL = 'http://localhost:3000';
const TOYS_URL = `${BASE_URL}/toys`;

// DOM Elements
const toyContainer = document.getElementById('toy-container');
const toyForm = document.getElementById('toy-form');

// Functions
function fetchToys() {
    fetch(TOYS_URL)
        .then(response => response.json())
        .then(toys => {
            toyContainer.innerHTML = '';
            toys.forEach(renderToyCard);
        })
        .catch(error => console.error('Error fetching toys:', error));
}

function renderToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" alt="${toy.name}" class="toy-avatar">
        <p>${toy.likes} Likes</p>
        <button class="like-btn" data-id="${toy.id}">Like</button>
    `;
    toyContainer.appendChild(card);
}

function handleNewToySubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;

    fetch(TOYS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, image, likes: 0 }),
    })
        .then(response => response.json())
        .then(newToy => {
            renderToyCard(newToy);
            event.target.reset();
        })
        .catch(error => console.error('Error adding new toy:', error));
}

function handleLikeClick(event) {
    if (event.target.matches('.like-btn')) {
        const toyId = event.target.dataset.id;
        const likeCount = event.target.previousElementSibling;
        
        fetch(`${TOYS_URL}/${toyId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ likes: parseInt(likeCount.textContent) + 1 }),
        })
            .then(response => response.json())
            .then(updatedToy => {
                likeCount.textContent = `${updatedToy.likes} Likes`;
            })
            .catch(error => console.error('Error updating likes:', error));
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchToys);
toyForm.addEventListener('submit', handleNewToySubmit);
toyContainer.addEventListener('click', handleLikeClick);