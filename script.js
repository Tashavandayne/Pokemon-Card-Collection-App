console.log("JavaScript is connected"); // tester

const addCardForm = document.getElementById("add-card-form");

// Add an event listener to the form submission to handle adding a new card.
addCardForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Keep the form submission from reloading the page.
    const pokemonNameInput = document.getElementById("pokemon-name"); // Get the input field for the Pokémon name.
    const pokemonName = pokemonNameInput.value.trim(); // Get the value entered by the user and delete any leading/trailing whitespace.
    
    if (pokemonName === "") {
        alert("Please enter a Pokémon name."); // Alert the user if they didn't enter a name.
        return; // Stop the function from continuing if no name was entered.
    }

    // Send the entered Pokémon name to the server using a POST request.
    fetch("/api/cards", {
        method: "POST", // Use the POST method to send data to the server.
        body: pokemonName // Send the Pokémon name as the body of the request.
    }).then(function(response) {
        if (!response.ok) {
            throw new Error("The card could not be added."); // Throw an error if the server response is not OK.    
        }

        window.location.reload(); // Reload the page to show the updated card list after adding a new card.
    }).catch(function(error) {
        alert(error.message); // Alert the user if there was an error adding the card.
    });

    console.log("pokemonName", pokemonName); // Display the entered Pokémon name in the console.

});

// Request the card inventory from our C++ server.
fetch("/api/cards").then(function(response) {
    console.log("The response arrived!"); // tester
    return response.json(); // Parse the response as JSON.
}).then(function(cards) {
    console.log(cards); // Display the parsed card array in the console.

    const cardList = document.getElementById("card-list"); // Get the HTML element where we want to display the card elements.

    const cardSearch = document.getElementById("card-search"); // Get the search input element.

    cardSearch.addEventListener("input", function() {
        const searchText = cardSearch.value.toLowerCase(); // Get the search text and convert it to lowercase for case-insensitive matching.
        const cardSlots = cardList.querySelectorAll(".card-slot"); // Get all the card slot elements.

        for (let j = 0; j < cardSlots.length; j++) {
            const matches = cardSlots[j].dataset.pokemon.includes(searchText); // Check if the card's name includes the search text.

            if (matches) {
                cardSlots[j].style.display = "block"; // Show the card slot if it matches the search text.
            } else {
                cardSlots[j].style.display = "none"; // Hide the card slot if it doesn't match the search text.
            }
        }
    });

    // Create the card elements for each card in the inventory.
    for (let i = 0; i < cards.length; i++) {
        console.log(cards[i].pokemon); // Print each card name in the console.    
        
        const cardImage = document.createElement("img"); // Create a new image element to hold the card's image.
        cardImage.addEventListener("error", function() {
            cardImage.classList.add("missing-image"); // Add a class to the image element if the image file is missing.
        });

        cardImage.src = "images/" + cards[i].pokemon + ".png"; // Set the image file to display.
        cardImage.alt = cards[i].pokemon; // Set the alt text for the image to the card's name.
        cardImage.className = "card-image"; // Apply the card image styling.

        const cardSlot = document.createElement("div"); //Create a container for this cards image and checkbox.
        cardSlot.className = "card-slot"; // Apply the card slot styling.
        cardSlot.dataset.pokemon = cards[i].pokemon.toLowerCase(); // Store the card's name in lowercase in the card slot's dataset for search filtering.
        cardList.appendChild(cardSlot); // Add the completed slot to the pages card list.
         
        const cardCheckbox = document.createElement("input"); // Create a new input element to hold the ownership checkbox.
        cardCheckbox.className = "ownership-checkbox"; // Apply the ownership checkbox styling.
        cardCheckbox.type = "checkbox"; // Set the input type to checkbox.
        cardCheckbox.checked = cards[i].quantity > 0; // Set the checkbox to checked if the card quantity is greater than 0, otherwise set it to unchecked.


        // Add an event listener to the checkbox to handle changes in ownership status.
        cardCheckbox.addEventListener("change", function() {
            const quantity = cardCheckbox.checked ? 1: 0; // Set the quantity to 1 if the checkbox is checked, otherwise set it to 0.

            fetch("/api/cards", {
                method: "PUT", // Use the PUT method to send data to the server.
                body: cards[i].pokemon + "\n" + quantity // Send the Pokémon name and quantity as the body of the request.
            }).then(function(response) {
                if (!response.ok) {
                    throw new Error("The card could not be updated."); // Throw an error if the server response is not OK.
                }

                quantityInput.value = quantity; // Update the quantity input value to match the checkbox state.
                
        }).catch(function(error) {
            alert(error.message); // Alert the user if there was an error updating the card.
        });
            console.log(cards[i].pokemon, cardCheckbox.checked) // Display the card name and whether the checkbox is checked in the console.

        });

        cardSlot.appendChild(cardCheckbox); // Place the checkbox inside this cards slot.

        cardSlot.appendChild(cardImage); // Place the image inside this cards slot.

        const quantityInput = document.createElement("input"); // Create a new input element to hold the quantity input.
        quantityInput.type = "number"; // Set the input type to quantity.
        quantityInput.min = 0; // Set the minimum value for the quantity input to 0.
        quantityInput.max = 999; // Set the maximum value for the quantity input to 999.
        quantityInput.required = true; // Make the quantity input a required field.
        quantityInput.value = cards[i].quantity; // Set the initial value of the quantity input to the card's current quantity.
        cardSlot.appendChild(quantityInput); // Place the quantity input inside this cards slot.
        
        const removeButton = document.createElement("button"); // Create a new button element to hold the remove button.
        removeButton.textContent = "Remove from binder"; // Set the text content of the remove button.
        cardSlot.appendChild(removeButton); // Place the remove button inside this cards slot.

        removeButton.addEventListener("click", function() { // Handle clicks on the remove button
            console.log(cards[i].pokemon); // Display the card name in the console when the remove button is clicked.

            fetch("/api/cards", {
                method: "DELETE", // Use the DELETE method to send data to the server.
                body: cards[i].pokemon
            }).then(function(response) {
                if (!response.ok) {
                    throw new Error("The card could not be removed."); // Throw an error if the server response is not OK.
                }

                cardSlot.remove(); // Remove the card slot from the page after successful deletion.
            }).catch(function(error) {
                alert(error.message); // Alert the user if there was an error removing the card.
            });
        });


        quantityInput.addEventListener("change", function() {
            if (!quantityInput.checkValidity()) { // Check if the input value is valid invalid.
                quantityInput.reportValidity(); // Show the validation message if the input value is invalid.
                return; // Stop the function from continuing if the input value is not valid.
            }

            console.log(quantityInput.value); // Display the new quantity value in the console.

            fetch("/api/cards", {
                method: "PUT", // Use the PUT method to send data to the server.
                body: cards[i].pokemon + "\n" + quantityInput.value
            }).then(function(response) {
                if (!response.ok) {
                    throw new Error("The quantity could not be updated."); // Throw an error if the server response is not OK.
                }

                cardCheckbox.checked = quantityInput.value > 0; // Update the checkbox state based on the new quantity value.

            }).catch(function(error) {
                alert(error.message); // Alert the user if there was an error updating the quantity.
            });
        });

    }

   
});