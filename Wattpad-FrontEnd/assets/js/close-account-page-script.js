//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(JSON.stringify(errData));
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);

            document.body.style.display = 'block';
            document.body.style.visibility = 'visible';
            document.body.style.opacity = 1;

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

            window.location.href = 'login-page.html';
        });
}




$('.close-btn').on('click', function (event) {
    event.preventDefault();

    const selected = document.querySelector('input[name="reasonToClose"]:checked');
    if (selected) {
        $('.error-msg').hide();
        console.log(selected.value);
        // continue with fetch...
    } else {
        $('.error-msg').css('display','flex');
        return;
    }

    fetch('http://localhost:8080/user/deactivate', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(JSON.stringify(errData));
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);

            alert('Your account is now closed, and you no longer have access to it.')
            window.location.href = 'signup-page.html';

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

            window.location.href = 'login-page.html';
        });
});


$('input[name="reasonToClose"]').on('change', function () {
    $('.error-msg').hide();
});















