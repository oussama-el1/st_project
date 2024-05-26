$(document).ready(function () {
    $('.error-msg').hide();

    $('.registration-btn').prop('disabled', true);

    function toggleSubmitButton() {
        var email = $('input[name="email"]').val();
        var password = $('input[name="password"]').val();

        if (isValidEmail(email)) {
            $('.error-msg').hide();
            if (password !== '') {
                $('.registration-btn').prop('disabled', false);
            } else {
                $('.registration-btn').prop('disabled', true);
            }
        } else {
            $('.error-msg').show();
            $('.registration-btn').prop('disabled', true);
        }
    }

    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showNotification() {
        var notification = $("<div class='notification'>This Email Is Already Used.</div>");
            $("body").append(notification);
            setTimeout(function () {
                notification.fadeOut();
            }, 3000);
    }

    $('input[name="email"], input[name="password"]').on('input', toggleSubmitButton);

    $('.registration-btn').click(function (event) {
        event.preventDefault();

        var email = $('input[name="email"]').val();
        var password = $('input[name="password"]').val();

        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000/api/v1/users/validemail',
            contentType: 'application/json',
            data: JSON.stringify({
                'email': email
            }),
            success: function (response) {
                $.ajax({
                    type: 'POST',
                    url: '/store_session_data_registration',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'email': email,
                        'password': password
                    }),
                    success: function (response) {
                        window.location.href = '/form';
                    },
                    error: function (xhr, status, error) {
                        console.error('Error storing session data:', error);
                    }
                });
            },
            error: function (xhr, status, error) {
                if (xhr.status === 400 && xhr.responseJSON.message === "This email is already registered") {
                    showNotification();
                } else {
                    console.error('Error validating email:', error);
                }
            }
        });
    });
});
