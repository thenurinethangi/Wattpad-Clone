//when click on don't have an account load signup page
let signUpBtn = $('.footer-button-margin-signup')[0];
signUpBtn.addEventListener('click',function (event) {
    window.location.href = 'signup-page.html';
});


//google signup
window.onload = function () {
    // Initialize Google Sign-In
    google.accounts.id.initialize({
        client_id: '81161313108-6ke52l7mhr8400np1uqpmik5f98130tj.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });

    // Render the invisible Google button
    google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
            theme: "outline",
            size: "large"
        }
    );

    // Hook your custom button to trigger real Google button
    document.getElementById("google-login-button").addEventListener("click", function () {
        const googleBtn = document.querySelector("#google-signin-button div[role='button']");
        if (googleBtn) {
            googleBtn.click();
        }
    });
};


let idToken;
// Handle Google credential response
function handleCredentialResponse(response) {

    idToken = response.credential;
    console.log("Google ID Token:", idToken);

    let data = {
        'idToken': idToken
    }

    fetch('http://localhost:8080/auth/google/login', {
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

                Swal.fire({
                    title: 'Info!',
                    text: 'You haven\'t signed up. Please register before log in!',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.href = 'signup-page.html';
                    }
                });
            }
            else if(response.status===406){

                localStorage.setItem('otp',response.data.otp);

                let otpModel = `
    <div class="modal-overlay">
        <div class="otp-modal">
            <input class="username-hide-input" style="display: none; visibility: hidden;" value="${idToken}">
        
            <button class="close-btn">&times;</button>
            
            <div class="modal-header" style="display: flex; flex-direction: column;">
                <h2 class="modal-title">Verify Your Email</h2>
                <p class="modal-subtitle">Please enter the 5-digit verification code sent to your email address</p>
            </div>
            
            <div class="otp-container">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
            </div>
            
            <button class="verify-btn">Verify Email</button>
            
            <a href="#" class="resend-link">Didn't receive code? Resend</a>
        </div>
    </div>`;

                $('body').append(otpModel);
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
}


$(document).on('click','.verify-btn',function (event) {

    let children = $('.otp-container').children();

    let userOtp = '';
    for (let i = 0; i < children.length; i++) {
        userOtp += $(children[i]).val();
    }

    userOtp = Number(userOtp);
    let serverOtp = Number(localStorage.getItem('otp'));

    if(userOtp===serverOtp){

        let idToken = $('.username-hide-input')[0].value;

        fetch('http://localhost:8080/auth/email/login/verify', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: idToken
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
                window.location.href = 'genre-selection-page.html';
            })
            .catch(error => {
                let response = JSON.parse(error.message);
                if(response.status===404){

                    Swal.fire({
                        title: 'Error!',
                        text: "Email cannot be verified. User not found. Please sign up!",
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        willClose: () => {
                            window.location.href = 'signup-page.html';
                        }
                    });
                }
            });
    }
    else{
        Swal.fire({
            title: 'Info!',
            text: 'OTP is incorrect!',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
                // window.location.href = 'login-page.html';
            }
        });
    }

});




$(document).on('click','.resend-link ',function (event) {

    fetch('http://localhost:8080/auth/email/signup/otp', {
        method: 'GET',
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
            localStorage.setItem('otp',data.data.otp);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
        });

});



$(document).on('click', '.log-in-with-email', function () {

    let loginForm = $('.login-form');
    loginForm.empty();

    let fields = `
                <div class="panel-body">
                    <button class="back-button button__Y70Pw tertiary-variant__Y9kWU default-accent__Pc0Pm medium-size__CLqD3 clickable__iYXtN full-width__dXWyx with-padding__cVt72 back-all-option" style="padding-bottom: 60px; padding-top: 20px;">
                        <span class="background-overlay__mCEaX"></span>
                        <span class="icon__p6RRK">
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpChevronLeft</title><path d="m10.612 12.5 4.632-4.915a.97.97 0 0 0 0-1.313.84.84 0 0 0-1.238 0l-5.25 5.571a.97.97 0 0 0 0 1.314l5.25 5.571a.84.84 0 0 0 1.238 0 .97.97 0 0 0 0-1.313L10.612 12.5Z" fill="#121212"></path></svg>
                        </span>Back to all login options
                    </button>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Email or username</span>
                        <label class="control-label sr-only" for="signup-email">Email or username</label>
                        <div class="field-container">
                            <input type="text" id="login-email" class="form-control enable input-lg" name="email" placeholder="E-mail or username">
                        </div>
                    </div>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Password</span>
                        <label class="control-label sr-only" for="signup-password">Password</label>
                        <div class="field-container">
                            <input type="text" id="login-password" class="form-control enable input-lg" name="password" placeholder="Enter Password">
                        </div>
                    </div>
                    <button id="login-btn" class="btn-block btn-primary submit-btn-new" style="margin-top: 1px;">Log in</button>
                    <button class="button__Y70Pw tertiary-variant__Y9kWU default-accent__Pc0Pm medium-size__CLqD3 clickable__iYXtN full-width__dXWyx with-padding__cVt72 forgot-password">
                        <span class="background-overlay__mCEaX"></span>Forgot password?
                    </button>
                </div>
                `;

    loginForm.append(fields);
});


$(document).on('click','.back-all-option',function (event) {

    let loginForm = $('.login-form');
    loginForm.empty();

    let allOptionAvailable = `
                                    <p class="title">Log in to Wattpad</p>
                                        <div class="panel-body">
                                            <div class="signin-buttons signin-buttons-new">
                                                <button class="btn btn-google btn-block auth-button-new" id="google-login-button">
                                                    <!-- Hidden Google button -->
                                                    <div id="google-signin-button" style="opacity: 0; position: absolute; pointer-events: none;"></div>
                                                    <img src="assets/image/google_login_color.png" alt="Google Login" class="google-login-icon" width="18" aria-hidden="true">
                                                    <span>
                                                    <span class="auth-button-text-new">Log in with Google</span>
                                                </span>
                                                </button>
                                                <button class="btn btn-facebook btn-block auth-button-new" data-source="login">
                                                    <img src="assets/image/facebook-login-color.png" alt="Facebook Login" class="google-login-icon" width="18" aria-hidden="true">
                                                    <span>
                                                    <span class="auth-button-text-new">Log in with Facebook</span>
                                                </span>
                                                </button>
                                            </div>
                                            <div class="hr-with-text hr-margin-new">
                                                <div class="horizontal-line"></div>
                                                <span class="or"> or </span>
                                                <div class="horizontal-line"></div>
                                            </div>
                                            <button class="btn-block btn-primary submit-btn-new log-in-with-email">Log in with email</button>
                                            <button class="button__Y70Pw tertiary-variant__Y9kWU default-accent__Pc0Pm medium-size__CLqD3 clickable__iYXtN full-width__dXWyx with-padding__cVt72 forgot-password">
                                                <span class="background-overlay__mCEaX"></span>Forgot password?
                                            </button>
                                        </div>
                                        <button class="footer-button-margin-signup button__Y70Pw tertiary-variant__Y9kWU default-accent__Pc0Pm medium-size__CLqD3 clickable__iYXtN full-width__dXWyx with-padding__cVt72">
                                            <span class="background-overlay__mCEaX"></span>
                                            Don't have an account? Sign up
                                        </button>
    `;

    loginForm.append(allOptionAvailable);
});



$(document).on('click','#login-btn',function (event) {

    let email = $('#login-email')[0].value.trim();
    let password = $('#login-password')[0].value.trim();

    if(email==='' || password===''){
        return;
    }

    let data = {
        'email': email,
        'password': password
    };

    console.log(data);

    fetch('http://localhost:8080/auth/email/login', {
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

                Swal.fire({
                    title: 'Info!',
                    text: 'You haven\'t signed up. Please register before log in!',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.href = 'signup-page.html';
                    }
                });
            }
            else if(response.status===417){
                Swal.fire({
                    title: 'Info!',
                    text: 'Password is incorrect!',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        console.log('Alert closed automatically');
                    }
                });
            }
            else if(response.status===401){
                Swal.fire({
                    title: 'Warn!',
                    text: 'Invalid Email Address!',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        console.log('Alert closed automatically');
                    }
                });
            }
            else if(response.status===406){

                localStorage.setItem('otp',response.data.otp);

                let otpModel = `
    <div class="modal-overlay">
        <div class="otp-modal">
            <input class="username-hide-input" style="display: none; visibility: hidden;" value="${email}">
        
            <button class="close-btn">&times;</button>
            
            <div class="modal-header" style="display: flex; flex-direction: column;">
                <h2 class="modal-title">Verify Your Email</h2>
                <p class="modal-subtitle">Please enter the 5-digit verification code sent to your email address</p>
            </div>
            
            <div class="otp-container">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
            </div>
            
            <button class="verify-btn">Verify Email</button>
            
            <a href="#" class="resend-link">Didn't receive code? Resend</a>
        </div>
    </div>`;

                $('body').append(otpModel);

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




$(document).on('click','.forgot-password',function (event) {

    let loginForm = $('.login-form');
    loginForm.empty();

    let forgotPassword = `
                                  <div class="hElOo">
                                    <div class="qLwAp" data-testid="forgot-password-form">
                                        <header class="mftTh">
                                            <h2>Lost your password?</h2>
                                            <span>Type your username or email below and we'll send you one time password to reset it.</span>
                                        </header>
                                        <hr>
                                        <form method="post" action="/forgot?nextUrl=https://www.wattpad.com/home" id="forgot-password-form">
                                            <div class="form-group has-feedback" data-attr="forgotEmail">
                                                <div class="rS0-b Auj4-">
                                                    <label for="forgot-email" class="HSR87"></label>
                                                    <input type="text" id="forgot-email" placeholder="Username or Email" name="email" class="_9T55T" required="" value="">
                                                </div>
                                            </div>
                                            <div class="hF3B-">
                                                <input type="button" class="HuEB9 _3lofP" id="send-otp" value="Send" style="color: #fff;"><a data-testid="cancel-btn" class="HuEB9 _7Lv9u" rel="nofollow" href="login-page.html">Cancel</a>
                                            </div>
                                        </form>
                                    </div>
                                  </div>
    `;

    loginForm.append(forgotPassword);
    
});



$(document).on('click','#send-otp',function (event) {

    let emailOrUsername = $('#forgot-email')[0].value;

    let emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    let usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

    let emailValidation = emailPattern.test(emailOrUsername);
    let usernameValidation = usernamePattern.test(emailOrUsername);

    if(emailOrUsername===''){
        return;
    }

    if(!emailValidation && !usernameValidation){
        let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Invalid input for this field. Please correct it</p>`;
        $('#forgot-email').next('.warning-msg').remove();
        $('#forgot-email').after(warningMsg);
        return;
    }

    fetch('http://localhost:8080/auth/email/login/forgotPassword', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: emailOrUsername
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
            localStorage.setItem('otp',data.data.otp);

            let otpModel = `
    <div class="modal-overlay">
        <div class="otp-modal">
            <input class="forgot-password-username-hide-input" style="display: none; visibility: hidden;" value="${emailOrUsername}">
        
            <button class="close-btn">&times;</button>
            
            <div class="modal-header" style="display: flex; flex-direction: column;">
                <h2 class="modal-title">Recover Your Password</h2>
                <p class="modal-subtitle">Please enter the 5-digit otp code sent to your email address</p>
            </div>
            
            <div class="otp-container">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
                <input type="text" class="otp-input" maxlength="1" placeholder="0">
            </div>
            
            <button class="enter-opt-btn">Enter</button>
            
            <a href="#" class="resend-link">Didn't receive code? Resend</a>
        </div>
    </div>`;

            $('body').append(otpModel);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            if(response.status===404){

                Swal.fire({
                    title: 'Error!',
                    text: "User not found. Please sign up!",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.href = 'signup-page.html';
                    }
                });
            }
        });
});



$(document).on('click','.enter-opt-btn',function (event) {

    let children = $('.otp-container').children();

    let userOtp = '';
    for (let i = 0; i < children.length; i++) {
        userOtp += $(children[i]).val();
    }

    userOtp = Number(userOtp);
    let serverOtp = Number(localStorage.getItem('otp'));

    if(userOtp===serverOtp){

        let emailOrUsername = $('.forgot-password-username-hide-input')[0].value;

        $('body').find('.modal-overlay').remove();

        let loginForm = $('.login-form');
        loginForm.empty();

        let changePassword = `
                                  <div class="hElOo">
                                    <div class="qLwAp">
                                        <header class="mftTh">
                                            <h2>Change password</h2>
                                        </header>
                                        <hr>
                                        <form method="post" action="" id="forgot-password-form">
                                            <div class="form-group has-feedback">
                                                <input id="reset-password-user-data-hide" value="${emailOrUsername}" style="display: none; visibility: hidden; opacity: 0;">
                                                <div class="rS0-b Auj4-" style="margin-bottom: 4px;">
                                                    <label for="new-password" class="HSR87" style="padding-top: 15px; padding-bottom: 3px; font-size: 16px; color: #222;">New password</label>
                                                    <input type="text" id="new-password" placeholder="john98216" class="_9T55T" required="">
                                                </div>
                                                <div class="rS0-b Auj4-" style="margin-bottom: 15px;">
                                                    <label for="re-enter-new-password" class="HSR87" style="padding-top: 15px; padding-bottom: 3px; font-size: 16px; color: #222;">Confirm password</label>
                                                    <input type="text" id="re-enter-new-password" placeholder="john98216" class="_9T55T" required="">
                                                </div>
                                            </div>
                                            <div class="hF3B-">
                                                <input type="button" class="HuEB9 _3lofP" id="reset-password-btn" value="Change" style="color: #fff;"><a data-testid="cancel-btn" class="HuEB9 _7Lv9u" rel="nofollow" href="login-page.html">Cancel</a>
                                            </div>
                                        </form>
                                    </div>
                                  </div>
    `;

        loginForm.append(changePassword);

    }
    else{
        Swal.fire({
            title: 'Info!',
            text: 'OTP is incorrect!',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
                // window.location.href = 'login-page.html';
            }
        });
    }

});



$(document).on('click','#reset-password-btn',function (event) {

    let emailOrUsername = $('#reset-password-user-data-hide')[0].value;
    let newPassword = $('#new-password')[0].value;
    let confirmPassword = $('#re-enter-new-password')[0].value;

    if(emailOrUsername==='' || newPassword==='' || confirmPassword===''){
        return;
    }

    if(newPassword!==confirmPassword){
        Swal.fire({
            title: 'Warn!',
            text: 'Confirm Password!',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
            }
        });
        return;
    }

    let passwordPattern = /^(?=.*\d).{7,}$/;
    let passwordValidation = passwordPattern.test(newPassword);
    if(!passwordValidation){
        Swal.fire({
            title: 'Warn!',
            text: 'Invalid password. Must be at least 7 characters long and include one number!',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {
            }
        });
        return;
    }

    let data = {
        'newPassword': newPassword,
        'confirmPassword': confirmPassword,
        'emailOrUsername': emailOrUsername
    }

    fetch('http://localhost:8080/auth/email/login/changePassword', {
        method: 'POST',
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

            Swal.fire({
                title: 'Success!',
                text: "Password changed successfully!",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                willClose: () => {
                    window.location.href = 'signup-page.html';
                }
            });
            window.location.href = 'login-page.html';
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            if(response.status===404){

                Swal.fire({
                    title: 'Error!',
                    text: "User not found. Please sign up!",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.href = 'signup-page.html';
                    }
                });
            }
            else if(response.status===401){
                Swal.fire({
                    title: 'Warn!',
                    text: 'Invalid Inputs!',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                    }
                });
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


//close otp model
$(document).on('click','.close-btn',function (event) {

    $('body').find('.modal-overlay').remove();
});






