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




//load user details
let userData = null;
async function loadUserDetails() {

    await fetch('http://localhost:8080/user/current', {
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

            let user = data.data;

            userData = user;

            $(".username").html(`${user.username} <button class="info" id="changeUsername">change</button>`);
            $(".email").html(`${user.email} <button class="info" id="changeEmail">change</button>`);
            $("#birthdate").val(user.birthday);

            $('.close-account-link').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/close-account-page.html?userId=${user.id}`);

        })
        .catch(error => {
            try {
                let errorResponse = JSON.parse(error.message);
                console.error('Error:', errorResponse);
            } catch (e) {
                console.error('Error:', error.message);
            }
        });
}



async function run() {
    await loadUserDetails();

}

run();




let accountTab = $('.account-tab')[0];
accountTab.addEventListener('click',function (event) {

    window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/setting-page.html';
});

let muteAccountTab = $('.mute-account-tab')[0];
muteAccountTab.addEventListener('click',function (event) {

    window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-mute-page.html';
});

let blockAccountTab = $('.block-account-tab')[0];
blockAccountTab.addEventListener('click',function (event) {

    window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-block-page.html';
});




//click on change username - change username model appear
$(document).on('click','#changeUsername',function (event) {

    event.preventDefault();
    $('.username-change-model').css('display','block');
});

//close change username model
let usernameAvailability = false;
$(document).on('click','.close-username-change-model',function (event) {

    $('.username-change-model').css('display','none');
});

//check username availability
$(document).on('keyup','.username-input',function (event) {

    let inputValue = $(this).val()

    let statusEl = $(this).next(".username-status");

    if (!inputValue) {
        statusEl.text("").removeClass("text-red text-green");
        return;
    }

    fetch(`http://localhost:8080/auth/username/existence?username=${inputValue}`, {
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

            if (data.message === 'Username Unavailable') {
                statusEl.text("Username unavailable")
                    .removeClass("text-green")
                    .addClass("text-red");
                usernameAvailability = false;
            }
            else {
                statusEl.text("Username available")
                    .removeClass("text-red")
                    .addClass("text-green");
                usernameAvailability = true;
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
});

//when click on change username btn send backend request to change the username
$(document).on('click','.change-username-btn',function (event) {

    event.preventDefault();

    let newUsername = $('.username-input').val().trim();
    let password = $('.password-input').val().trim();

    if (!newUsername && !password) {
        alert("All fields are required");
        return;
    }
    else if (!newUsername) {
        alert("Add your new username");
        return;
    }
    else if(!usernameAvailability){
        alert("username not available! use another username");
        return;
    }
    else if (!password) {
        alert("Confirm your password to change the username");
        return;
    }

    let data = {
        'username': newUsername,
        'password': password
    }

    fetch(`http://localhost:8080/user/change/username`, {
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
            console.log('Success:', data);

            if(data.data===true){
                $('.username-change-model').css('display','none');
                alert('Successfully change the username');
                window.location.reload();
            }
            else{
                alert('Password is incorrect, verify is unsuccessfully');
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });

});




// Show password
$(document).on('click', '.show-password', function () {
    let container = $(this).closest('span'); // wrapper of the icons

    $(this).hide();                      // hide show-eye
    container.find('.hide-password').show(); // show hide-eye

    let passwordHide = container.closest('div').find('.password-hide');
    let passwordShow = container.closest('div').find('.password-show');

    let value = passwordHide.val();
    passwordHide.hide();
    passwordShow.show().val(value);
});

// Hide password
$(document).on('click', '.hide-password', function () {
    let container = $(this).closest('span'); // wrapper of the icons

    $(this).hide();                       // hide hide-eye
    container.find('.show-password').show(); // show show-eye

    let passwordShow = container.closest('div').find('.password-show');
    let passwordHide = container.closest('div').find('.password-hide');

    let value = passwordShow.val();
    passwordShow.hide();
    passwordHide.show().val(value);
});




//click on change password - change password model appear
$(document).on('click','#changePassword',function (event) {

    event.preventDefault();
    $('.change-password-model').css('display','block');
});

//close change password model
$(document).on('click','.close-password-change-model',function (event) {

    $('.change-password-model').css('display','none');
});


let currentPasswordValidation = false;
let newPasswordValidation = false;
let confirmPasswordValidation = false;
let newPasswordInputValue = '';
let currentPasswordInputValue = '';

// Select all inputs with same class
const currentPasswordInputs = document.querySelectorAll(".current-password-field");

// Add same logic for each input
currentPasswordInputs.forEach(input => {
    input.addEventListener("input", function () {
        let value = this.value.trim();
        currentPasswordInputValue = value;

        if(value===''){
            currentPasswordValidation = false;
            $('.password-save-btn').attr('disabled', 'disabled');
        }
        else{
            currentPasswordValidation = true;
            if(newPasswordValidation && confirmPasswordValidation && currentPasswordValidation){
                $('.password-save-btn').removeAttr('disabled');
            }
        }

    });
});

// Select all inputs with same class
const newPasswordInputs = document.querySelectorAll(".new-password-field");

// Add same logic for each input
newPasswordInputs.forEach(input => {
    input.addEventListener("input", function () {
        let value = this.value.trim();
        newPasswordInputValue = value;

        if(value==='' || value.length<7 || !hasNumber(value)){
            $('.new-password-error-msg').css('display','block');
            newPasswordValidation = false;
            $('.password-save-btn').attr('disabled', 'disabled');
        }
        else {
            $('.new-password-error-msg').css('display','none');
            newPasswordValidation = true;
            if(newPasswordValidation && confirmPasswordValidation && currentPasswordValidation){
                $('.password-save-btn').removeAttr('disabled');
            }
        }

    });
});

// Select all inputs with same class
const confirmPasswordInputs = document.querySelectorAll(".confirm-password-field");

// Add same logic for each input
confirmPasswordInputs.forEach(input => {
    input.addEventListener("input", function () {
        let value = this.value.trim();

        if(newPasswordInputValue!==value){
            $('.confirm-password-error-msg').css('display','block');
            confirmPasswordValidation = false;
            $('.password-save-btn').attr('disabled', 'disabled');
        }
        else{
            $('.confirm-password-error-msg').css('display','none');
            confirmPasswordValidation = true;
            if(newPasswordValidation && confirmPasswordValidation && currentPasswordValidation){
                $('.password-save-btn').removeAttr('disabled');
            }
        }

    });
});

function hasNumber(str) {
    return /\d/.test(str);
}


//click on the save password btn
let savePasswordBtn = $('.password-save-btn')[0];
savePasswordBtn.addEventListener('click',function (event) {

    let data = {
        'currentPassword': currentPasswordInputValue,
        'newPassword': newPasswordInputValue
    }

    fetch('http://localhost:8080/user/change/password', {
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
            console.log('Success:', data);

            if(data.data===true){
                $('.change-password-model').css('display','none');
                alert('Successfully change the password');
                window.location.reload();
            }
            else{
                alert('Password is incorrect, verify is unsuccessfully');
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
});




//click on change password - change password model appear
$(document).on('click','#changeEmail',function (event) {

    event.preventDefault();
    $('.change-email-model').css('display','block');

    $('#old-email').text(userData.email);
});

//close change password model
$(document).on('click','.close-email-change-model',function (event) {

    $('.change-email-model').css('display','none');
});

//close change password model when click on cancel
$(document).on('click','.btn-cancel',function (event) {

    $('.change-email-model').css('display','none');
});




let newEmailValidation = false;
let confirmEmailValidation = false;
let confirmEmailPasswordValidation = false;
let newEmailInputValue = '';
let confirmEmailInputValue = '';
let password = '';

// Helper function to check all three
function toggleSaveButton() {
    if (newEmailValidation && confirmEmailValidation && confirmEmailPasswordValidation) {
        $('.email-save-btn').removeAttr('disabled');
    } else {
        $('.email-save-btn').attr('disabled', 'disabled');
    }
}

// New Email
const newEmailInput = document.querySelectorAll("#new_email");
newEmailInput.forEach(input => {
    input.addEventListener("input", function () {
        let value = this.value.trim();
        newEmailInputValue = value;

        if (value === '') {
            newEmailValidation = false;
        } else {
            newEmailValidation = true;
        }

        toggleSaveButton();
    });
});

// Confirm Email
const confirmEmailInputs = document.querySelectorAll("#confirm_email");
confirmEmailInputs.forEach(input => {
    input.addEventListener("input", function () {
        let value = this.value.trim();
        confirmEmailInputValue = value;

        if (value !== newEmailInputValue) {
            $('.confirm-email-error-message').css('display','block');
            confirmEmailValidation = false;
        } else {
            $('.confirm-email-error-message').css('display','none');
            confirmEmailValidation = true;
        }

        toggleSaveButton();
    });
});

// Confirm Password
const confirmEmailPasswordInputs = document.querySelectorAll(".confirm-email-password-field");
confirmEmailPasswordInputs.forEach(input => {
    input.addEventListener("input", function () {
        let value = this.value.trim();
        password = value;

        if (value === '') {
            confirmEmailPasswordValidation = false;
        } else {
            confirmEmailPasswordValidation = true;
        }

        toggleSaveButton();
    });
});




//click on the save email btn
let saveEmailBtn = $('.email-save-btn')[0];
saveEmailBtn.addEventListener('click',function (event) {

    if(!isValidEmail(newEmailInputValue)){
        alert('invalid email format.');
        return;
    }

    let data = {
        'newEmail': newEmailInputValue,
        'password': password
    }

    fetch('http://localhost:8080/user/change/email', {
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
            console.log('Success:', data);

            if(data.data===true){
                $('.change-email-model').css('display','none');
                alert('Successfully change the email');
                window.location.reload();
            }
            else{
                alert('Password is incorrect, verify is unsuccessfully');
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
});


function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}



//click submit form button
let submitBtn = $('#submit')[0];
submitBtn.addEventListener('click',function (event) {

    event.preventDefault();

    let birthday = $('#birthdate').val();
    let data = {
        'birthday': birthday
    }

    fetch('http://localhost:8080/user/change/setting/userData', {
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
            console.log('Success:', data);

            loadUserDetails();
            alert('Your changes was successfully');

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
});










