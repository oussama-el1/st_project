// Add click event listener to the edit button
const editButtons = document.querySelectorAll('.edit-button');
const deleteButtons = document.querySelectorAll('.delete-button');
editButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        // Get the row containing the user data
        const row = event.target.closest('tr');

        // Extract user data from the row
        const usersid = row.querySelector('.id').innerText
        const firstName = row.querySelector('.first-name').innerText;
        const lastName = row.querySelector('.last-name').innerText;
        const email = row.querySelector('.email').innerText;
        const tel = row.querySelector('.tel').innerText;
        let createdDate = row.querySelector('.created-date').innerText;
        const pwd = row.querySelector('.userkey').innerText;

        createdDate = createdDate.split(' ')[0];

        // Populate input fields in the update form with user data
        document.querySelector('#drawer-update-product .userid').innerHTML = usersid
        document.getElementById('firstname2').value = firstName;
        document.getElementById('lastname2').value = lastName;
        document.getElementById('email2').value = email;
        document.getElementById('tel2').value = tel;
        document.getElementById('datepicker').value = createdDate;
        document.getElementById('pwd2').value = pwd;
    });
});

deleteButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        // closest row 
        const row = event.target.closest('tr');

        const usersid = row.querySelector('.id').innerText

        document.querySelector('#delete-modal .userid').innerHTML = usersid
    });
});

