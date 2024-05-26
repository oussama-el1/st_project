document.addEventListener('DOMContentLoaded', function () {
  const deleteButton = document.querySelector('#deltemeal');
  deleteButton.addEventListener('click', function () {

      const mealId = document.querySelector('#delete-modal .deletemealid').innerHTML;

      const username = 'john';
      const password = 'password123';
      const basicAuth = 'Basic ' + btoa(username + ':' + password);
      fetch(`http://127.0.0.1:5000/api/v1/meals/${mealId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': basicAuth
          },
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          showNotification('Meal Deleted successfully', 'green');
      })
      .catch(error => {
          console.error('Error deleting Meal:', error);
          showNotification('Error deleting Meal', 'green');
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