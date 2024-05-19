const form = document.getElementById('drawer-update-product');
const closebutton = document.querySelector('#drawer-update-product-close');

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const orderId = document.querySelector('#drawer-update-product .orderid').innerText.toLowerCase();
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const zipcode = document.getElementById('Zipcode').value;
    const street = document.getElementById('Street').value;
    const apt = document.getElementById('Appartement').value;
    const status = document.getElementById('orderstatus').value;
    const deliveredAt = document.getElementById('datepicker').value;

    const mealElements = document.querySelectorAll('.MealsInOrder .onemeal');
    const meals = Array.from(mealElements).map(mealElement => mealElement.getAttribute('data-meal-id'));

    const data = {
        "state": state,
        "city": city,
        "zipcode": zipcode,
        "street": street,
        "apt": apt,
        "status": status,
        "delevred_at": deliveredAt,
        "meals": meals
    };

    console.log(data)

    const username = 'john';
    const password = 'password123';
    const authHeader = 'Basic ' + btoa(username + ':' + password);

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/v1/admin/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            closebutton.click()
            showNotification('Order updated successfully', 'green');
        } else {
            const errorData = await response.json();
            console.error('Error updating Order:', errorData);
            // Handle error
            showNotification('Error updating Order', 'red');
        }
    } catch (error) {
        console.error('Network error:', error);
        showNotification('Network error', 'red');
    }

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