$(document).ready(function () {
    $('.button-50').click(function (event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/create_user_and_address',
            success: function (response) {
                console.log(response);
                if (response.order_id) {
                    window.location.href = '/order/' + response.order_id;
                } else {
                    console.error('No order_id found in response');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error creating user and address:', error);
            }
        });
    });
});
