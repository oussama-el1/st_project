// Add click event listener to the edit button
const editButtons = document.querySelectorAll('.edit-button');
editButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        // Get the row containing the user data
        const row = event.target.closest('tr');
        
        // Extract user data from the row
        const firstName = row.querySelector('.first-name').innerText;
        const lastName = row.querySelector('.last-name').innerText;
        const email = row.querySelector('.email').innerText;
        const tel = row.querySelector('.tel').innerText;
        const createdDate = row.querySelector('.created-date').innerText;
        const pwd = row.querySelector('.userkey').innerText;
        
        // Populate input fields in the update form with user data
        document.getElementById('firstname2').value = firstName;
        document.getElementById('lastname2').value = lastName;
        document.getElementById('email2').value = email;
        document.getElementById('tel2').value = tel;
        document.getElementById('datepicker').value = createdDate;
        document.getElementById('pwd2').value = pwd;
    });
});
