document.addEventListener('DOMContentLoaded', function () {
  const createOrderForm = document.querySelector('#createOrderForm');
  const closebutton = document.querySelector('#createOrderclose');

  createOrderForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(createOrderForm);
    const OrderData = {
      plan_id: formData.get('planid'),
      user_id: formData.get('userid')
    };

    createOrder(OrderData);
  });

  function createOrder(OrderData) {
    // API endpoint URL
    const url = 'http://127.0.0.1:5000/api/v1/orders';

    const username = 'john';
    const password = 'password123';
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth
      },
      body: JSON.stringify(OrderData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Order created successfully:', data);
      createOrderForm.reset();
      closebutton.click()
      showNotification('Order created successfully', 'green');
    })
    .catch(error => {
      console.error('Error creating Order:', error);
      // Handle error
      closebutton.click()
      showNotification('Error creating Order', 'red');
    });
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
