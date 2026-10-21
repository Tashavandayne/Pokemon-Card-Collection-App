Pokémon Card Collection App

This is my Computer Science capstone project at SUNY Polytechnic Institute. I am building an app to help Pokémon collectors organize their cards into digital binders and keep track of what they have and what they still need.

As a Pokémon card collector, I wanted a way to see my collection in a binder layout, including the cards I am missing. My goal is to eventually have the app available online through AWS.

Current progress

I am working on Cycle 1 / Demo 1, which focuses on getting the app running on my computer. The code includes:

A binder layout with three cards across.

Card images that appear gray when the card is not owned and in color when it is owned.

Checkboxes for marking cards as owned.

A form for adding a card by Pokémon name.

A quantity box for tracking how many copies are owned, from 0 to 999.

A button for removing a card from the binder.

A search box that filters cards by Pokémon name.

A C++ server that connects the webpage to the card list.

The project is still in development. These features are in the source code, and I am continuing to check and improve how they work together.

Tools I am using

Tool

What I use it for

C++

Keeping track of the card list and handling requests from the webpage

cpp-httplib

Running the local web server

HTML

Building the page

CSS

Styling the binder and changing card images from gray to color

JavaScript

Connecting the page controls to the server

Visual Studio Code

Writing and editing the project

Project files

File or folder

Purpose

main.cpp

The C++ server and sample card list

httplib.h

The cpp-httplib header needed to build the server

index.html

The main webpage

style.css

The page layout and styling

script.js

The code for displaying cards and handling user actions

images/

Local card images

The setup below assumes the C++ source is named main.cpp. If your copy has a different name, use that filename in the build command.

Running the app locally

You will need a C++ compiler, a compatible copy of httplib.h, and a web browser. My development setup uses Windows, MinGW-w64, and Visual Studio Code.

Download or clone this repository and open the project folder in Visual Studio Code.

Make sure httplib.h is available beside main.cpp and the HTML, CSS, and JavaScript files are in the same folder.

Put the card images in the images folder. The current code looks for names such as Pikachu.png and Charizard.png. Image filenames must match the Pokémon names in the card list, including capitalization.

Open a terminal in the project folder and build the C++ server. A starting command for MinGW-w64 is:

g++ -std=c++17 main.cpp -o server.exe -pthread -lws2_32

Compiler options can vary with the version of MinGW-w64 and cpp-httplib. This command has not been verified against a complete checkout of the project.

Start the server from that same folder. In PowerShell, use:

.\server.exe

Keep the server running and open http://localhost:8080 in your browser.

Use the C++ server to open the app. Opening index.html directly or using Live Server alone will not provide the card requests handled by C++.

To stop the server, press Ctrl+C in its terminal.

Using the binder

Check a card to mark it as owned. Uncheck it to set its quantity to zero.

Change the quantity box to record more than one copy. Checking a previously unchecked card sets its quantity to one.

Type a Pokémon name in the search box to narrow down the displayed cards.

Enter a name in the add-card form to add another entry. Adding a name does not download a card image; its image must already be in the images folder.

Choose Remove from binder to remove an entry from the current card list.

Current limitations

The collection is not saved permanently yet. Changes remain while the server is running, but restarting it brings back the sample card list.

The app currently runs on my computer and has not been deployed to AWS.

New cards added through the form start with a quantity of one. The sample cards start at zero. I am still working on the starting behavior for new cards.

Cards are currently found by Pokémon name, so different cards with the same name are not handled separately yet.

The sample records are for development, not a verified card catalog.

The navigation buttons for additional pages, including My Binders, Login, and Sign Up, are placeholders.

Set information and card versions are included in the C++ card structure, but are not yet fully connected to the page.

Development plan

Cycle

Goal

Cycle 1 / Demo 1

Build the local app, binder layout, and basic collection controls

Cycle 2 / Demo 2

Add a database so collections stay saved and expand the card information

Cycle 3 / Demo 3

Put the app online with AWS and make final improvements

Other planned features include separate binders for sets or custom collections, standard/reverse holo/holo versions, card condition, and a wishlist.

Author

Tasha Van Dayne
Computer Science capstone project — SUNY Polytechnic Institute

This is a student project and is not affiliated with or endorsed by The Pokémon Company. Pokémon names and card artwork belong to their respective owners.