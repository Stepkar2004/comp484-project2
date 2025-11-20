# GigaPet Project

**Author:** Stepan Karapetyan

**Live Demo:** [https://stepkar2004.github.io/comp484-project2/](https://stepkar2004.github.io/comp484-project2/)

## jQuery Method Usage

1. **.val()**
   - Used in `clickedCreatePet()` to retrieve the user input for the new pet's name and type.
   - Used in `clickedRenameButton()` to retrieve the new name from the input field.
   - Used in `updatePetSelector()` and `switchPet()` to get or set the value of the pet selector dropdown.
   - Used to clear input fields after submission (like `$('#new-pet-name').val('')`).

2. **.append()**
   - Used in `updatePetSelector()` to dynamically add `<option>` elements to the pet selector dropdown for each pet in the pets array.
   - Used in `logAction()` to add new `<li>` elements to the notification log `<ul>`, displaying a history of actions.

## Additional Features

I added animations + animations for the pet actions and the ability to create and manage more than one pet!
