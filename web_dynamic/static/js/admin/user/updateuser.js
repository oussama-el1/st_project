document.addEventListener('DOMContentLoaded', function () {
  const updateUserForm = document.querySelector('#drawer-update-product');
  const closebutton = document.querySelector('#drawer-update-product-close');

  updateUserForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(updateUserForm);
    const userId = updateUserForm.querySelector('#drawer-update-product .userid').innerHTML

    const userData = {
      FirstName: formData.get('firstname'),
      LastName: formData.get('lastname'),
      email: formData.get('email'),
      tel: formData.get('tel'),
      password: formData.get('pwd'),
    };

    updateUser(userId, userData);
  });

  function updateUser(userId, userData) {

    const url = `http://127.0.0.1:5000/api/v1/users/${userId}`;

    // Basic Authentication credentials
    const username = 'john';
    const password = 'password123';
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('User updated successfully:', data);
      // Handle success response
      closebutton.click()
      showNotification('User updated successfully', 'green');
    })
    .catch(error => {
      console.error('Error updating user:', error);
      // Handle error
      showNotification('Error updating user', 'red');
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
