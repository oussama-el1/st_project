document.addEventListener('DOMContentLoaded', function() {
const numPeopleCards = document.querySelectorAll('.plan-options-p .option-card');

numPeopleCards.forEach(card => {
    card.addEventListener('click', () => {
        numPeopleCards.forEach(card => {
            card.classList.remove('selected');
        });

        card.classList.toggle('selected');
    });
});

const mealsPerWeekCards = document.querySelectorAll('.plan-options-m .option-card');

mealsPerWeekCards.forEach(card => {
    card.addEventListener('click', () => {
        mealsPerWeekCards.forEach(card => {
            card.classList.remove('selected');
        });

        card.classList.toggle('selected');
    });
});

const preferenceCards = document.querySelectorAll('.preference-card');

preferenceCards.forEach(card => {
    const checkbox = card.querySelector('.prefcheckbox');
    card.addEventListener('click', (event) => {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));

        if (checkbox.checked) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
});

});



