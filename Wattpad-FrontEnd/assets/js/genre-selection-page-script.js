//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/genre/all', {
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

            window.location.href = 'signup-page.html';
        });
};



$('.genre-btn').on('click', function (event) {

    let bool = $(this).hasClass('selected');

    if(bool){
        $(this).removeClass('selected');
    }
    else{
        $(this).addClass('selected');
    }
});



$('.continue-btn').on('click',function (event) {

    let selectedGenresList = $('.selected');
    if(selectedGenresList.length<3){
        Swal.fire({
            title: 'Warn!',
            text: 'You must select at least three genres to proceed!',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
            }
        });
        return;
    }

    let genres = Array.of();
    for (let i = 0; i < selectedGenresList.length; i++) {
        genres.push($(selectedGenresList[i]).data('value'));
    }

    let data = {
        'genres': genres
    }

    fetch('http://localhost:8080/genre/select', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
            console.log('POST Data:', data);
            window.location.href = 'home-page.html';

        })
        .catch(error => {
            console.error('Fetch error:', error.message);
            let response = JSON.parse(error.message);

            if(response.status===404){
                window.location.href = 'signup-page.html';
            }
            else if (response.status===401){
                window.location.href = 'login-page.html';
            }
            else if (response.status===403){
                //you are not allow to access this
            }
            else if(response.status===500){
                Swal.fire({
                    title: 'alert!',
                    text: 'Internal Server Error, Please try again later!',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        console.log('Alert closed automatically');
                    }
                });
            }
        });
});




















