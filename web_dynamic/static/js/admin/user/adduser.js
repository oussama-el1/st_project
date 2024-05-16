document.addEventListener('DOMContentLoaded', function () {
  const createUserForm = document.querySelector('#createUserForm');
  const closebutton = document.querySelector('#createuserclose');

  createUserForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(createUserForm);
    const userData = {
      FirstName: formData.get('firstname'),
      LastName: formData.get('lastname'),
      email: formData.get('email'),
      tel: formData.get('tel'),
      password: formData.get('pwd')
    };

    createUser(userData);
  });

  function createUser(userData) {
    // API endpoint URL
    const url = 'http://127.0.0.1:5000/api/v1/users';

    const username = 'john';
    const password = 'password123';
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    fetch(url, {
      method: 'POST',
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
      console.log('User created successfully:', data);
      createUserForm.reset();
      closebutton.click()
      showNotification('User created successfully', 'green');
    })
    .catch(error => {
      console.error('Error creating user:', error);
      // Handle error
      closebutton.click()
      showNotification('Error creating user', 'red');
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
