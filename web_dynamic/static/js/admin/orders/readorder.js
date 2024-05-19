const previewButtons = document.querySelectorAll('.Preview-button');


previewButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        const tableRow = button.closest('tr');

        const orderId = tableRow.querySelector('.order_id .id').textContent.trim();
        const deliveryAddress = tableRow.querySelector('.delivery_address').textContent.trim();
        const city = deliveryAddress.split(',')[1].trim();
        const status = tableRow.querySelector('.order_status').textContent.trim();
        const orderDate = tableRow.querySelector('.order_date').textContent.trim();
        const deliveryDate = tableRow.querySelector('.delivery_date').textContent.trim();
        const orderTotal = tableRow.querySelector('.order_totale').textContent.trim();
        const userId = tableRow.querySelector('.user_id .user_id').textContent.trim();
        const userEmail = tableRow.querySelector('.email').textContent.trim();
        const userTel = tableRow.querySelector('.tel').textContent.trim();
        const color = tableRow.querySelector('.order_color').textContent.trim();

        document.querySelector('#drawer-read-product-advanced #drawer-label').innerHTML = `Preview Order &nbsp;[${orderId}]`;
        document.querySelector('#drawer-read-product-advanced #city').textContent = city;
        document.querySelector('#drawer-read-product-advanced #status').textContent = status;
        document.querySelector('#drawer-read-product-advanced #orderdate').textContent = orderDate;
        document.querySelector('#drawer-read-product-advanced #deliverydate').textContent = deliveryDate;
        document.querySelector('#drawer-read-product-advanced #ordertotale').textContent = orderTotal;
        document.querySelector('#drawer-read-product-advanced #userid').textContent = userId;
        document.querySelector('#drawer-read-product-advanced #useremail').textContent = userEmail;
        document.querySelector('#drawer-read-product-advanced #usertel').textContent = userTel;
        document.querySelector('#drawer-read-product-advanced #orderstatuscolor').classList.add('bg-'+color+'-600')

        const mealsDiv = tableRow.querySelector('#meals');
        const mealIDs = mealsDiv.querySelectorAll('.mealid');
        const mealNames = mealsDiv.querySelectorAll('.mealname');
        const mealsContainer = document.querySelector('.mealsreadcontainer');
        mealsContainer.innerHTML = '';

        mealIDs.forEach((mealID, index) => {
            const mealDiv = document.createElement('div');
            mealDiv.classList.add('onemealread', 'p-2', 'w-auto', 'h-[200px]', 'bg-gray-100', 'rounded-lg', 'dark:bg-gray-700', 'relative');

            const mealImage = document.createElement('img');
            mealImage.classList.add('rounded-lg', 'h-[150px]', 'w-full');
            mealImage.src = `../../../static/images/meals/${mealID.textContent}.jpg`
            mealImage.alt = 'Meal Image';

            const containerDiv = document.createElement('div');
            containerDiv.style.display = 'flex';
            containerDiv.style.flexDirection = 'row';
            containerDiv.style.alignItems = 'center';
            containerDiv.style.justifyContent = 'space-between';

            const mealNameSpan = document.createElement('span');
            mealNameSpan.classList.add('mealname', 'block', 'text-sm', 'font-medium', 'text-gray-900', 'absolute', 'bottom-1', 'left-1', 'dark:text-white', 'ml-2');
            mealNameSpan.textContent = mealNames[index].textContent;

            mealDiv.appendChild(mealImage);
            mealDiv.appendChild(containerDiv);
            mealDiv.appendChild(mealNameSpan);

            mealsContainer.appendChild(mealDiv);
        });
    });
});
