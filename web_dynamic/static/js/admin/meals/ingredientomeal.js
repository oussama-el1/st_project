$(document).ready(function () {
    const ingredientForm = $('#createIngredientForm');
    const closeIngredientButton = document.querySelector('#closeingredient');

    let triggeredButton;

    $('.addingredientbutton').on('click', function () {
        triggeredButton = this;
        console.log("clicked")
    });

    ingredientForm.on('submit', function (event) {
        event.preventDefault();

        const ingredientName = $('#ingredientname').val();
        if (!ingredientName) {
            showNotification('Ingredient name is required', 'red');
            return;
        }

        const mealId = $(triggeredButton).closest('tr').attr('id');
        console.log(mealId)

        if (!mealId) {
            showNotification('Meal ID not found', 'red');
            return;
        }

        const ingredientData = {
            meal_id: mealId,
            ingredient_name: ingredientName
        };

        $.ajax({
            url: 'http://127.0.0.1:5000/api/v1/ingredients/meal',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Authorization': 'Basic ' + btoa('john:password123')
            },
            data: JSON.stringify(ingredientData),
            success: function (response) {
                console.log('Ingredient added:', response);
                ingredientForm[0].reset();
                showNotification('Ingredient added successfully', 'green');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('There was a problem with the fetch operation:', textStatus, errorThrown);
                closeIngredientButton.click();
                showNotification('There was a problem with the fetch operation', 'red');
            }
        });
    });

    function showNotification(message, color) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.classList.add('fixed', 'top-4', 'right-4', 'p-4', 'text-white', 'rounded-md', 'shadow-md');

        if (color === 'green') {
            notification.classList.add('bg-green-500');
        } else if (color === 'red') {
            notification.classList.add('bg-red-500');
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});
