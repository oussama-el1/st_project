$(document).ready(function () {
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

    $('.edit-button').on('click', function () {
        const mealRow = $(this).closest('tr');
        const mealId = mealRow.attr('id');

        $.ajax({
            url: `http://127.0.0.1:5000/api/v1/meals/${mealId}/preferences`,
            type: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa('john:password123')
            },
            success: function (response) {
                $('#drawer-update-product input[name="sellingType"]').prop('checked', false);

                response.forEach(preferenceName => {
                    const checkbox = $(`#drawer-update-product input[name="sellingType"][data-name="${preferenceName}"]`);
                    checkbox.prop('checked', true);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('There was a problem with the fetch operation:', textStatus, errorThrown);
                showNotification('There was a problem with the fetch operation', 'red');
            }
        });

        $.ajax({
            url: `http://127.0.0.1:5000/api/v1/meals/${mealId}/ingredients`,
            type: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa('john:password123')
            },
            success: function (response) {
                const ingredientsContainer = $('#ingredient-checkboxes');
                ingredientsContainer.empty();

                $.each(response, function (ingredientId, ingredientName) {
                    const checkbox = `
                        <div class="flex items-center mr-4">
                            <input id="${ingredientId}" type="checkbox" value="" name="ingredientType" data-name="${ingredientName}" checked
                                class="w-4 h-4 bg-gray-100 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                            <label for="${ingredientId}" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">${ingredientName}</label>
                        </div>`;
                    ingredientsContainer.append(checkbox);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('There was a problem with the fetch operation:', textStatus, errorThrown);
                showNotification('There was a problem with the fetch operation', 'red');
            }
        });
    });
});
