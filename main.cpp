#include <iostream>
#include <string>
#include <vector>
#include <cctype>
#include "httplib.h"

using namespace std;

struct Card {
    string pokemon;
    int quantity;
    string setName;
    string cardNumber;
    string version;
};

int main() {
    vector<Card> cards = {
        {"Pikachu", 0, "151 Set", "58/102", "Standard"},
        {"Charizard", 0, "Phantasmal Flames", "4/102", "Standard"},
        {"Bulbasaur", 0, "30th Anniversary", "44/102", "Standard"},
        {"Slowbro", 0, "Pitch Black", "63/102", "Reverse Holo"},
        {"Jigglypuff", 0, "Hidden Fates", "39/102", "Holo"}
    };
    
    httplib::Server server;

    // Serve the index.html file when the root URL is accessed
    server.Get("/", [](const httplib::Request&, httplib::Response& response) {
        response.set_file_content("index.html", "text/html");
    });

    server.Get("/style.css", [](const httplib::Request&, httplib::Response& response) {
        response.set_file_content("style.css", "text/css");
    });

    server.set_mount_point("/images", "./images"); // Serve image files from the local images folder.

    // Respond when the browser requests the card inventory.
    server.Get("/api/cards", [&cards](const httplib::Request&, httplib::Response& response) {
        string cardDetails = "["; // Start the JSON array.

        // Loop through the cards and build a JSON object for each one.
        for (int i = 0; i < cards.size(); i++) {
            cardDetails += "{"; // Start a JSON object for this card.
            cardDetails += "\"pokemon\":\""; // Add the field label and open the name's quotation marks.
            cardDetails += cards[i].pokemon; // Add the current card's name.
            cardDetails += "\""; // Close the name's quotation marks.
            cardDetails += ",\"quantity\":"; // Separate the fields and add the quantity label.
            cardDetails += to_string(cards[i].quantity); // Add this cards quantity.  
            cardDetails += " "; // Add a space for formatting.
            cardDetails += "}"; // Close this cards JSON object.

            if (i + 1 < cards.size()) {
                cardDetails += ","; // Add a comma to separate this card from the next one.
            }

            cardDetails += "\n"; // Add a newline for formatting. 
        }
        cardDetails += "]"; // Close the JSON array.

        response.set_content(cardDetails, "application/json"); // Send the accumulated card details.
    });    

    // Serve the JavaScript file when the browser requests it.
    server.Get("/script.js", [](const httplib::Request&, httplib::Response& response) {
        response.set_file_content("script.js", "text/javascript");
    });

    // Handle the form submission to add a new card to the inventory.
    server.Post("/api/cards", [&cards](const httplib::Request& request, httplib::Response& response) {
        string pokemonName = request.body; // Get the name of the Pokémon from the request body.
        Card newCard{}; // Create a new Card object.
        newCard.pokemon = pokemonName; // Set the Pokémon name.
        newCard.quantity = 1; // Default quantity to 1.
        cards.push_back(newCard); // Add the new card to the inventory.
        response.set_content("Card added", "text/plain"); // Respond with a confirmation message.
    });
    
    server.Put("/api/cards", [&cards](const httplib::Request& request, httplib::Response& response) {
        string ownershipData = request.body; // Get the ownership data from the request body.
        size_t separator = ownershipData.find('\n'); // Find the separator between the Pokémon name and the ownership status.

        if (separator == string::npos) { // If the separator is not found, return a bad request response.
            response.status = 400; // Bad Request
            return;
        }

        string pokemonName = ownershipData.substr(0, separator); // Extract the Pokémon name before the newline.
        
        string quantityText = ownershipData.substr(separator + 1); // Extract the ownership status after the newline.
        
        if (quantityText.empty()) { // If the ownership status is empty, return a bad request response.
            response.status = 400; // Bad Request
            return;
        }

        for (char character : quantityText) { // Check if the ownership status contains only digits.
            if (!isdigit(static_cast<unsigned char>(character))) { // If a non-digit character is found, return a bad request response.
                response.status = 400; // Bad Request
                return;
            }
        }

        if (quantityText.length() > 3) { // If the ownership status is too long (more than 3 digits), return a bad request response.
            response.status = 400; // Bad Request
            return;
        }

        int quantity = stoi(quantityText); // Convert the ownership status to an integer.

        for (int i = 0; i < cards.size(); i++) {
            if (cards[i].pokemon == pokemonName) {
                cards[i].quantity = quantity; // Update the card's quantity based on the ownership status.
                response.set_content("Ownership updated", "text/plain"); // Respond with a confirmation message.
                return;
            }
        }

        response.status = 404; // Not Found if the Pokémon name is not in the inventory.

    });

    server.Delete("/api/cards", [&cards](const httplib::Request& request, httplib::Response& response) {
        string pokemonName = request.body; // Get the name of the Pokémon to remove from the request body.

        for (int i = 0; i < cards.size(); i++) {
            if (cards[i].pokemon == pokemonName) {
                cards.erase(cards.begin() + i); // Remove the card from the inventory.
                response.set_content("Card removed", "text/plain"); // Respond with a confirmation message.
                return;
            }
        }

        response.status = 404; // Not Found if the Pokémon name is not in the inventory.

    });

    server.listen("127.0.0.1", 8080); // Start the server on localhost:8080


    return 0;
    
}