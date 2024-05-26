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

const closebutton = document.querySelector('#drawer-update-product-close');

$('#drawer-update-product').on('submit', function (event) {
    event.preventDefault();

    const mealId = $('#updatemealid').text().toLowerCase();
    console.log(mealId)
    const mealName = $('#newmealname').val();
    const carbs = $('#newcarbs').val();
    const fat = $('#newfat').val();
    const calories = $('#newCalories').val();
    const protein = $('#newProteain').val();

    const preferences = [];
    $('#drawer-update-product input[name="sellingType"]:checked').each(function () {
        preferences.push($(this).attr('id'));
    });

    const ingredients = [];
    $('#drawer-update-product input[name="ingredientType"]:checked').each(function () {
        ingredients.push($(this).attr('id'));
    });

    const mealData = {
        name: mealName,
        Carbs: carbs,
        Fat: fat,
        calories: calories,
        protein: protein,
        preferences: preferences,
        ingredients: ingredients
    };

    console.log(mealData);

    $.ajax({
        url: `http://127.0.0.1:5000/api/v1/meals/${mealId}`,
        type: 'PUT',
        headers: {
            'Authorization': 'Basic ' + btoa('john:password123'),
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(mealData),
        success: function (response) {
            closebutton.click()
            showNotification('Meal updated successfully', 'green');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('There was a problem with the update operation:', textStatus, errorThrown);
            showNotification('There was a problem with the update operation', 'red');
        }
    });
});