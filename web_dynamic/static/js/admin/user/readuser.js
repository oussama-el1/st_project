const Previewbutton = document.querySelectorAll('.Preview-button');
Previewbutton.forEach(button => {
    button.addEventListener('click', function(event) {

        const row = event.target.closest('tr');

        const usersid = row.querySelector('.id').innerText
        const firstName = row.querySelector('.first-name').innerText;
        const lastName = row.querySelector('.last-name').innerText;
        const email = row.querySelector('.email').innerText;
        const tel = row.querySelector('.tel').innerText;
        const createdDate = row.querySelector('.created-date').innerText;
        const uptadeDate = row.querySelector('.updated-date').innerText;

        document.querySelector('#drawer-read-product-advanced .userid').innerHTML = usersid
        document.querySelector('#drawer-read-product-advanced .firstname').innerHTML = firstName;
        document.querySelector('#drawer-read-product-advanced .lastname').innerHTML = lastName;
        document.querySelector('#drawer-read-product-advanced .email').innerHTML = email;
        document.querySelector('#drawer-read-product-advanced .tel').innerHTML = tel;
        document.querySelector('#drawer-read-product-advanced .createdate').innerHTML = createdDate;
        document.querySelector('#drawer-read-product-advanced .updatedate').innerHTML = uptadeDate;
  });
});
