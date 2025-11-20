/*
 * Project GigaPet
 * 
 * jQuery Method Usage:
 * 
 * 1. .val()
 *    - Used in clickedCreatePet() to retrieve the user input for the new pet's name and type.
 *    - Used in clickedRenameButton() to retrieve the new name from the input field.
 *    - Used in updatePetSelector() and switchPet() to get or set the value of the pet selector dropdown.
 *    - Used to clear input fields after submission (like $('#new-pet-name').val('')).
 * 
 * 2. .append()
 *    - Used in updatePetSelector() to dynamically add <option> elements to the pet selector dropdown for each pet in the pets array.
 *    - Used in logAction() to add new <li> elements to the notification log <ul>, displaying a history of actions.
 */

$(function () {
  // Pet Constructor
  function Pet(name, type, image) {
    this.name = name;
    this.type = type;
    this.image = image;
    this.weight = 10;
    this.happiness = 10;
  }

  // State
  var pets = [];
  var currentPetIndex = -1;

  // Audio Objects
  // Note: Browsers might block autoplay until user interaction.
  // We assume files exist at assets/sounds/
  var sounds = {
    treat: new Audio('assets/sounds/treat.mp3'),
    play: new Audio('assets/sounds/play.mp3'),
    exercise: new Audio('assets/sounds/exercise.mp3'),
    sleep: new Audio('assets/sounds/sleep.mp3')
  };

  // Initialize with a default pet if none exist
  // (Optional, but good for testing. We'll let user create one mostly)
  createNewPet("Fluffy", "cat");

  // Event Listeners
  $('#create-pet-btn').click(clickedCreatePet);
  $('#pet-selector').change(changedPetSelector);

  $('.treat-button').click(clickedTreatButton);
  $('.play-button').click(clickedPlayButton);
  $('.exercise-button').click(clickedExerciseButton);
  $('.sleep-button').click(clickedSleepButton);
  $('#rename-btn').click(clickedRenameButton);

  // Helper to play sound safely
  function playSound(name) {
    try {
      sounds[name].currentTime = 0;
      sounds[name].play().catch(e => console.log("Audio play failed (likely no interaction yet):", e));
    } catch (e) {
      console.log("Audio file not found or error:", e);
    }
  }

  // Helper to trigger animation
  function triggerAnimation(animClass) {
    var $img = $('.pet-image');
    $img.removeClass('anim-bounce anim-shake anim-pulse anim-sleep');
    // Trigger reflow to restart animation if it was already playing
    void $img[0].offsetWidth;
    $img.addClass(animClass);

    // Remove class after animation ends (optional, but good for repeated clicks)
    // setTimeout(() => $img.removeClass(animClass), 1000); 
  }

  function clickedCreatePet() {
    var name = $('#new-pet-name').val();
    var type = $('#new-pet-type').val();

    if (!name) {
      alert("Please enter a name!");
      return;
    }

    createNewPet(name, type);
    $('#new-pet-name').val(''); // Clear input
  }

  function createNewPet(name, type) {
    var image = "assets/images/" + type + ".png";
    var newPet = new Pet(name, type, image);
    pets.push(newPet);

    // Update selector
    updatePetSelector();

    // Switch to new pet
    switchPet(pets.length - 1);

    logAction("Created new pet: " + name + " the " + type + "!");
  }

  function updatePetSelector() {
    var $selector = $('#pet-selector');
    $selector.empty();
    pets.forEach(function (pet, index) {
      $selector.append($('<option>', {
        value: index,
        text: pet.name + " (" + pet.type + ")"
      }));
    });
    $selector.val(currentPetIndex);
  }

  function changedPetSelector() {
    var index = parseInt($(this).val());
    switchPet(index);
  }

  function switchPet(index) {
    if (index >= 0 && index < pets.length) {
      currentPetIndex = index;
      // Clear any active animations
      $('.pet-image').removeClass('anim-bounce anim-shake anim-pulse anim-sleep');
      updatePetInfoInHtml();
      $('#pet-selector').val(index);
    }
  }

  function getCurrentPet() {
    if (currentPetIndex >= 0 && currentPetIndex < pets.length) {
      return pets[currentPetIndex];
    }
    return null;
  }

  function clickedTreatButton() {
    var pet = getCurrentPet();
    if (!pet) return;

    pet.happiness += 1;
    pet.weight += 2;

    playSound('treat');
    triggerAnimation('anim-pulse');
    logAction("You gave " + pet.name + " a treat! Yummy!");
    checkAndUpdatePetInfoInHtml();
  }

  function clickedPlayButton() {
    var pet = getCurrentPet();
    if (!pet) return;

    pet.happiness += 2;
    pet.weight -= 1;

    playSound('play');
    triggerAnimation('anim-bounce');
    logAction("You played with " + pet.name + "! So fun!");
    checkAndUpdatePetInfoInHtml();
  }

  function clickedExerciseButton() {
    var pet = getCurrentPet();
    if (!pet) return;

    pet.happiness -= 1;
    pet.weight -= 1;

    playSound('exercise');
    triggerAnimation('anim-shake');
    logAction(pet.name + " exercised. Phew!");
    checkAndUpdatePetInfoInHtml();
  }

  function clickedSleepButton() {
    var pet = getCurrentPet();
    if (!pet) return;

    pet.happiness += 1;

    playSound('sleep');
    triggerAnimation('anim-sleep');
    logAction(pet.name + " took a nap. Zzz...");
    checkAndUpdatePetInfoInHtml();
  }

  function clickedRenameButton() {
    var pet = getCurrentPet();
    if (!pet) return;

    var newName = $('#pet-name-input').val();
    if (newName) {
      var oldName = pet.name;
      pet.name = newName;
      logAction("Renamed " + oldName + " to " + newName + ".");
      updatePetSelector(); // Update selector text
      checkAndUpdatePetInfoInHtml();
      $('#pet-name-input').val('');
    }
  }

  function logAction(message) {
    $('#notification-log').append('<li>' + message + '</li>');
    // Scroll to bottom
    var log = $('#notification-log');
    log.scrollTop(log[0].scrollHeight);
  }

  function checkAndUpdatePetInfoInHtml() {
    var pet = getCurrentPet();
    if (!pet) return;

    checkWeightAndHappinessBeforeUpdating(pet);
    updatePetInfoInHtml();
  }

  function checkWeightAndHappinessBeforeUpdating(pet) {
    if (pet.weight < 0) {
      pet.weight = 0;
    }
    if (pet.happiness < 0) {
      pet.happiness = 0;
    }
  }

  function updatePetInfoInHtml() {
    var pet = getCurrentPet();
    if (!pet) {
      // Clear or hide info if no pet
      $('.name').text("No Pet Selected");
      $('.weight').text("-");
      $('.happiness').text("-");
      $('.pet-image').attr('src', '');
      return;
    }

    $('.name').text(pet.name);
    $('.weight').text(pet.weight);
    $('.happiness').text(pet.happiness);
    $('.pet-image').attr('src', pet.image);
  }
});