$(document).ready(function () {
    $(".savebutton").on("click", function () {
        var orderId = $(".box-meals").data("id");
        var mealIds = [];
        $(".box-meals .card").each(function () {
            mealIds.push($(this).data("id"));
        });

        var api_url = "http://localhost:5000/api/v1/orders/" + orderId + "/meals";

        var username = "john";
        var password = "password123";
        
        console.log(mealIds)

        $.ajax({
            url: api_url,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "meal_ids": mealIds
            }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
            },
            success: function (response) {
                console.log("Data saved successfully:", response);
                showNotification("Data saved successfully!", "green");
            },
            error: function (xhr, status, error) {
                console.error("Error saving data:", error);
            }
        });
    });

    function showNotification(message, color) {
        var notification = $("<div>", {
            class: "notification",
            text: message
        }).css("background-color", color);

        $("body").append(notification);
        setTimeout(function () {
            notification.fadeOut("slow", function () {
                $(this).remove();
            });
        }, 3000);
    }
});
