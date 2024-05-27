$(document).ready(function () {
    $(".box-meals").hide();

    $('.user-icon').click(function () {
        $('.user-info').toggle();
    });

    var mealsAdded = $(".box-meals .card").length;
    
    var mealsPerWeek = parseInt($('h2').attr('data-meals-per-week'));

    $("#box-toggle").click(function () {
        $(".box-meals").toggle();
        checkEmptyBox();
    });

    $(".button").click(function () {
        if (mealsAdded < mealsPerWeek) {
            var mealCard = $(this).closest(".card").clone();

            mealCard.find(".button").remove();
            mealCard.find(".faq-button").remove();
            $(".box-meals").append(mealCard);

            var deleteButton = $("<button class='delete-button'><svg class='delete-svgIcon' viewBox='0 0 448 512'><path d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z'></path></svg></button>");
            mealCard.find(".meal-buttons").append(deleteButton);

            mealsAdded++;
            $(".empty-box-message").hide();
        } else {
            var notification = $("<div class='notification'>You have reached the maximum limit of meals per week.</div>");
            $("body").append(notification);
            setTimeout(function () {
                notification.fadeOut();
            }, 3000);
        }
        checkEmptyBox();
    });

    $(document).on("click", ".delete-button", function () {
        $(this).closest(".card").remove();
        mealsAdded--;
        checkEmptyBox();
    });

    function checkEmptyBox() {
        var boxMeals = $(".box-meals");
        var cards = boxMeals.find('.card');

        if (cards.length === 0) {
            $(".empty-box-message").show();
        } else {
            $(".empty-box-message").hide();
        }
    }

    $(".box-meals .card").each(function () {
        var deleteButton = $("<button class='delete-button'><svg class='delete-svgIcon' viewBox='0 0 448 512'><path d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z'></path></svg></button>");
        $(this).find(".meal-buttons").append(deleteButton);
    });
});
