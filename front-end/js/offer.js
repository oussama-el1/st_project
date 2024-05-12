document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript code here
    // JavaScript to handle card selection for number of people
const numPeopleCards = document.querySelectorAll('.plan-options-p .option-card');

numPeopleCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove 'selected' class from all number of people cards
        numPeopleCards.forEach(card => {
            card.classList.remove('selected');
        });

        // Toggle 'selected' class for the clicked card
        card.classList.toggle('selected');
    });
});

// JavaScript to handle card selection for number of meals
const mealsPerWeekCards = document.querySelectorAll('.plan-options-m .option-card');

mealsPerWeekCards.forEach(card => {
    card.addEventListener('click', () => {
        // Remove 'selected' class from all number of meals cards
        mealsPerWeekCards.forEach(card => {
            card.classList.remove('selected');
        });

        // Toggle 'selected' class for the clicked card
        card.classList.toggle('selected');
    });
});

// JavaScript to handle card selection and checkbox state
const preferenceCards = document.querySelectorAll('.preference-card');

preferenceCards.forEach(card => {
    const checkbox = card.querySelector('.prefcheckbox');
    card.addEventListener('click', (event) => {
        // Toggle the checkbox state
        checkbox.checked = !checkbox.checked;

        // Trigger the 'change' event for the checkbox
        checkbox.dispatchEvent(new Event('change'));

        // Toggle the 'selected' class for the card based on checkbox state
        if (checkbox.checked) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
});

});



