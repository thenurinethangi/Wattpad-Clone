let loginBtn = $('.log-in-btn');

loginBtn.each(function() {
    $(this).on('click', function(event) {
        window.location.href = "../../login-page.html";
    });
});
