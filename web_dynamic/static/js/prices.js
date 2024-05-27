$(document).ready(function () {

    function calculatePrice() {
        const numPeopleInput = document.querySelector('input[name="numPeople"]:checked');
        const numPeople = numPeopleInput ? parseInt(numPeopleInput.value) : 0;

        const mealsPerWeekInput = document.querySelector('input[name="mealsPerWeek"]:checked');
        const numMeals = mealsPerWeekInput ? parseInt(mealsPerWeekInput.value) : 0;

        const boxPrice = numPeople * numMeals * 9.99;

        const totalServings = numPeople * numMeals;

        const discount = 0.3 * boxPrice;

        const finalPrice = boxPrice + 4.78 - discount;

        document.querySelector('.plan-details #st1').textContent = + numMeals + " meals" + " for " + numPeople + " people per week";
        document.querySelector('.plan-details #st2').textContent = totalServings + " total servings";
        document.querySelector('.plan-details .price').textContent = `$${boxPrice.toFixed(2)}`;
        document.querySelector('.plan-details .off').textContent = `$${discount.toFixed(2)}`;
        document.querySelector('.plan-details .final-price').textContent = `$${finalPrice.toFixed(2)}`;
    }

    document.querySelectorAll('.op').forEach(function (radio) {
        radio.addEventListener('change', calculatePrice);
    });

    document.getElementById('numPeople2').click();
    document.getElementById('mealsPerWeek3').click();

    calculatePrice();
});
