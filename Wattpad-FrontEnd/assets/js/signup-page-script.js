//when click on already have an account load login page
let signInBtn = $('.footer-button-margin-signup')[0];
signInBtn.addEventListener('click',function (event) {
    window.location.href = 'login-page.html';
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
    document.getElementById("google-signup-button").addEventListener("click", function () {
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

    //load additional information form fields
    let loginForm = $('.login-form');
    loginForm.empty();

    let additionalFields = `
                <div class="panel-body">
                    <div class="form-group has-feedback email">
                        <span class="form-label">Username</span>
                        <label class="control-label sr-only" for="signup-username">Username</label>
                        <div class="field-container">
                            <input type="text" id="signup-username" class="form-control enable input-lg" name="username" placeholder="Enter Username">
                        </div>
                    </div>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Full Name</span>
                        <label class="control-label sr-only" for="signup-fullName">Full Name</label>
                        <div class="field-container">
                            <input type="text" id="signup-fullName" class="form-control enable input-lg" name="fullName" placeholder="Enter Full Name">
                        </div>
                    </div>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Birthday</span>
                        <div class="birthday-fields">
                            <div class="has-feedback birthday-container"><div class="birthday-fields" style="display: flex; gap: 15px;"><div class="form-group has-feedback month" data-attr="month" style="display: flex; flex-direction: column;"><label class="control-label sr-only" for="signup-month" aria-hidden="true">Month<img class="drop-down-icon" src="assets/image/wp-chevron-down.svg" alt=""></label><div class="birthday-dropdowns"><select id="signup-month" class="form-control enable input-lg custom-select custom-select-lg" name="month" required=""><option value="" disabled="" selected="">Month</option><option value="01">Jan</option><option value="02">Feb</option><option value="03">Mar</option><option value="04">Apr</option><option value="05">May</option><option value="06">Jun</option><option value="07">Jul</option><option value="08">Aug</option><option value="09">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option></select></div></div><div class="form-group has-feedback day" data-attr="day" style="display: flex; flex-direction: column;"><label class="control-label sr-only" for="signup-day" aria-hidden="true">Day</label><div class="birthday-dropdowns"><select id="signup-day" class="form-control enable input-lg custom-select custom-select-lg" name="day" required=""><option value="" disabled="" selected="">Day</option><option value="01">1</option><option value="02">2</option><option value="03">3</option><option value="04">4</option><option value="05">5</option><option value="06">6</option><option value="07">7</option><option value="08">8</option><option value="09">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option></select></div></div><div class="form-group has-feedback year" data-attr="year" style="display: flex; flex-direction: column;"><label class="control-label sr-only" for="signup-year" aria-hidden="true">Year</label><div class="birthday-dropdowns"><select id="signup-year" class="form-control enable input-lg custom-select custom-select-lg" name="year" required=""><option value="" disabled="" selected="">Year</option><option value="2025">2025</option><option value="2024">2024</option><option value="2023">2023</option><option value="2022">2022</option><option value="2021">2021</option><option value="2020">2020</option><option value="2019">2019</option><option value="2018">2018</option><option value="2017">2017</option><option value="2016">2016</option><option value="2015">2015</option><option value="2014">2014</option><option value="2013">2013</option><option value="2012">2012</option><option value="2011">2011</option><option value="2010">2010</option><option value="2009">2009</option><option value="2008">2008</option><option value="2007">2007</option><option value="2006">2006</option><option value="2005">2005</option><option value="2004">2004</option><option value="2003">2003</option><option value="2002">2002</option><option value="2001">2001</option><option value="2000">2000</option><option value="1999">1999</option><option value="1998">1998</option><option value="1997">1997</option><option value="1996">1996</option><option value="1995">1995</option><option value="1994">1994</option><option value="1993">1993</option><option value="1992">1992</option><option value="1991">1991</option><option value="1990">1990</option><option value="1989">1989</option><option value="1988">1988</option><option value="1987">1987</option><option value="1986">1986</option><option value="1985">1985</option><option value="1984">1984</option><option value="1983">1983</option><option value="1982">1982</option><option value="1981">1981</option><option value="1980">1980</option><option value="1979">1979</option><option value="1978">1978</option><option value="1977">1977</option><option value="1976">1976</option><option value="1975">1975</option><option value="1974">1974</option><option value="1973">1973</option><option value="1972">1972</option><option value="1971">1971</option><option value="1970">1970</option><option value="1969">1969</option><option value="1968">1968</option><option value="1967">1967</option><option value="1966">1966</option><option value="1965">1965</option><option value="1964">1964</option><option value="1963">1963</option><option value="1962">1962</option><option value="1961">1961</option><option value="1960">1960</option><option value="1959">1959</option><option value="1958">1958</option><option value="1957">1957</option><option value="1956">1956</option><option value="1955">1955</option><option value="1954">1954</option><option value="1953">1953</option><option value="1952">1952</option><option value="1951">1951</option><option value="1950">1950</option><option value="1949">1949</option><option value="1948">1948</option><option value="1947">1947</option><option value="1946">1946</option><option value="1945">1945</option><option value="1944">1944</option><option value="1943">1943</option><option value="1942">1942</option><option value="1941">1941</option><option value="1940">1940</option><option value="1939">1939</option><option value="1938">1938</option><option value="1937">1937</option><option value="1936">1936</option><option value="1935">1935</option><option value="1934">1934</option><option value="1933">1933</option><option value="1932">1932</option><option value="1931">1931</option><option value="1930">1930</option><option value="1929">1929</option><option value="1928">1928</option><option value="1927">1927</option><option value="1926">1926</option></select></div></div></div><div aria-describedby="birthday_error" aria-live="assertive" role="alert" class="error-msg"></div></div></div>
                    </div>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Pronounce (optional)</span>
                        <label class="control-label sr-only" for="pronouns">Pronounce</label>
                        <select id="pronouns" class="form-control enable input-lg" name="pronouns">
                            <option value="" selected="">Pronouns (optional)</option>
                            <option value="He/Him">He/Him</option>
                            <option value="She/Her">She/Her</option>
                            <option value="They/Them">They/Them</option>
                            <option value="Not listed">Not listed</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                    <div class="c-checkbox__content" id="policy-consent" style="display: flex; justify-content: flex-start; align-items: flex-start; gap: 8px;">
                        <input type="checkbox" style="margin-top: 6px;" id="tac-check-box">
                        <span class="checkbox-title" style="color: rgba(34,34,34,0.93); font-weight: 400; font-size: 14px;">Yes, I have read and agree to Wattpad's
                            <a href="/terms" style="color: rgba(28,111,101,0.93); font-weight: 700; font-size: 14px;">Terms of Service</a> and
                            <a href="/privacy" style="color: rgba(28,111,101,0.93); font-weight: 700; font-size: 14px;">Privacy Policy</a>.
                        </span>
                    </div>
                    <button class="btn-block btn-primary submit-btn-new" id="sign-up-with-google-btn" style="margin-top: 32px;">Sign up</button>
                </div>
                `;

    loginForm.append(additionalFields);

    console.log("Google ID Token:", idToken);
}


let usernameAvailability= true;
$(document).on('keyup','#signup-username',function (event) {

    let username = $(this).val();
    if(username.length<2){
        return;
    }

    fetch('http://localhost:8080/auth/username/existence?username='+username,{
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(JSON.stringify(response.json()));
            }
            return response.json();
        })
        .then(data => {
            // console.log('POST Data:', data);

            usernameAvailability = data.data;
            $('#signup-username').next('.warning-msg').remove();

            if(data.data===true){
                let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Username not available</p>`;
                $('#signup-username').after(warningMsg);
            }
            else{
                let warningMsg = `<p class="warning-msg" style="font-size: small; color: green; transform: translateY(-4px); font-weight: 400; text-align: left;">Username available.</p>`;
                $('#signup-username').after(warningMsg);
            }
        })
        .catch(error => {
            let errorJson = JSON.parse(error.message);
            // console.error('Fetch error:', error.message);
        });

});


$(document).on('keyup','#signup-fullName',function (event) {

    let inputValue = $(this).val();
    let fullNamePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;
    let fullNameValidation = fullNamePattern.test(inputValue);

    if(fullNameValidation){
        $('#signup-fullName').next('.warning-msg').remove();
    }
});

$(document).on('change','#signup-month',function (event) {

    let inputValue = $(this).val();

    if(inputValue!==''){
        $('.month').find('.warning-msg').remove();
    }
});

$(document).on('change','#signup-day',function (event) {

    let inputValue = $(this).val();

    if(inputValue!==''){
        $('.day').find('.warning-msg').remove();
    }
});

$(document).on('change','#signup-year',function (event) {

    let inputValue = $(this).val();

    if(inputValue!==''){
        $('.year').find('.warning-msg').remove();
    }
});

$(document).on('change','#signup-email',function (event) {

    let inputValue = $(this).val();
    let emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    let emailValidation = emailPattern.test(inputValue)

    if(emailValidation){
        $('#signup-email').next('.warning-msg').remove();
    }
});

$(document).on('change','#signup-password',function (event) {

    let inputValue = $(this).val();
    console.log(inputValue)
    let passwordPattern = /^(?=.*\d).{7,}$/;
    let passwordValidation = passwordPattern.test(inputValue)

    if(passwordValidation){
        $('#signup-password').next('.warning-msg').remove();
    }
});


$('#signup-password').next('.warning-msg').remove();

$(document).on('click','#sign-up-with-google-btn',function (event) {

    let username = $('#signup-username')[0].value.trim();
    let fullName = $('#signup-fullName')[0].value.trim();
    let month = $('#signup-month')[0].value.trim();
    let day = $('#signup-day')[0].value.trim();
    let year = $('#signup-year')[0].value.trim();
    let pronouns = $('#pronouns')[0].value.trim();
    let termAndConditionCheckBox = $('#tac-check-box').prop('checked');

    if(username==='' || fullName==='' || month==='' || day==='' || year==='' || usernameAvailability){
        if(username===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Username required.</p>`;
            $('#signup-username').next('.warning-msg').remove();
            $('#signup-username').after(warningMsg);
        }
        if(fullName===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Full Name required.</p>`;
            $('#signup-fullName').next('.warning-msg').remove();
            $('#signup-fullName').after(warningMsg);
        }
        if(month===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Month required.</p>`;
            $('.month').find('.warning-msg').remove();
            $('.month').append(warningMsg);
        }
        if(day===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Day required.</p>`;
            $('.day').find('.warning-msg').remove();
            $('.day').append(warningMsg);
        }
        if(year===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Year required.</p>`;
            $('.year').find('.warning-msg').remove();
            $('.year').append(warningMsg);
        }
        if(usernameAvailability && username!==''){
            $('#signup-username').next('.warning-msg').remove();
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Username not available</p>`;
            $('#signup-username').after(warningMsg);
        }
        return;
    }

    let usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    let fullNamePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;

    let usernameValidation = usernamePattern.test(username);
    let fullNameValidation = fullNamePattern.test(fullName);

    if(!usernameValidation || !fullNameValidation){
        if(!usernameValidation){
            let warningMsg = `<p style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Username invalid.</p>`;
            $('#signup-username').after(warningMsg);
        }
        if(!fullNameValidation){
            let warningMsg = `<p style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Full Name invalid.</p>`;
            $('#signup-fullName').after(warningMsg);
        }
        return;
    }

    if(!termAndConditionCheckBox){
        let warningModel = `
                                    <div class="warning-model" style="background-color: #fff; box-shadow: 0 1px 12px var(--wp-neutral-10); border-radius: 7px; position: absolute; padding: 24px 20px; z-index: 1000; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; min-width: 300px; max-width: 400px;">
                                        <div class="warning-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="color: #d97706;"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        </div>
                                        <p style="font-size: 16px; color: #222; font-weight: 500; text-align: center;">You must agree to the terms and conditions before signing up!</p>
                                        <button class="warning-model-close-btn" style="background-color: black; padding: 10px; border-radius: 25px; color: #fff; font-weight: 600; width: 100px; margin-top: 17px;">OK</button>
                                    </div>  
                                    `;
        $('#policy-consent').find('.warning-model').remove();
        $('#policy-consent').append(warningModel);
        return;
    }

    let data = {
        'username': username,
        'fullName': fullName,
        'birthday': year+'-'+month+'-'+day,
        'pronouns': pronouns,
        'idToken': idToken
    };

    console.log(data);

    fetch('http://localhost:8080/auth/google/signup', {
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
            window.location.href = 'genre-selection-page.html';

        })
        .catch(error => {
            console.error('Fetch error:', error.message);

            let response = JSON.parse(error.message);
            if(response.status===400){

                Swal.fire({
                    title: 'Info!',
                    text: 'Your already signed up. please login!',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.href = 'login-page.html';
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


$(document).on('click','.warning-model-close-btn',function (event) {

    $('#policy-consent').find('.warning-model').remove();
});



$(document).on('click', '.sign-up-with-email', function () {

    let loginForm = $('.login-form');
    loginForm.empty();

    let additionalFields = `
                <div class="panel-body">
                    <button class="back-button button__Y70Pw tertiary-variant__Y9kWU default-accent__Pc0Pm medium-size__CLqD3 clickable__iYXtN full-width__dXWyx with-padding__cVt72 back-all-option" style="padding-bottom: 25px;">
                        <span class="background-overlay__mCEaX"></span>
                        <span class="icon__p6RRK">
                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpChevronLeft</title><path d="m10.612 12.5 4.632-4.915a.97.97 0 0 0 0-1.313.84.84 0 0 0-1.238 0l-5.25 5.571a.97.97 0 0 0 0 1.314l5.25 5.571a.84.84 0 0 0 1.238 0 .97.97 0 0 0 0-1.313L10.612 12.5Z" fill="#121212"></path></svg>
                        </span>Back to all signup options
                    </button>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Email</span>
                        <label class="control-label sr-only" for="signup-email">Email</label>
                        <div class="field-container">
                            <input type="text" id="signup-email" class="form-control enable input-lg" name="email" placeholder="Enter E-mail">
                        </div>
                    </div>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Username</span>
                        <label class="control-label sr-only" for="signup-username">Username</label>
                        <div class="field-container">
                            <input type="text" id="signup-username" class="form-control enable input-lg" name="username" placeholder="Enter Username">
                        </div>
                    </div>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Full Name</span>
                        <label class="control-label sr-only" for="signup-fullName">Full Name</label>
                        <div class="field-container">
                            <input type="text" id="signup-fullName" class="form-control enable input-lg" name="fullName" placeholder="Enter Full Name">
                        </div>
                    </div>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Birthday</span>
                        <div class="birthday-fields">
                            <div class="has-feedback birthday-container"><div class="birthday-fields" style="display: flex; gap: 15px;"><div class="form-group has-feedback month" data-attr="month"><label class="control-label sr-only" for="signup-month" aria-hidden="true">Month<img class="drop-down-icon" src="assets/image/wp-chevron-down.svg" alt=""></label><div class="birthday-dropdowns"><select id="signup-month" class="form-control enable input-lg custom-select custom-select-lg" name="month" required=""><option value="" disabled="" selected="">Month</option><option value="01">Jan</option><option value="02">Feb</option><option value="03">Mar</option><option value="04">Apr</option><option value="05">May</option><option value="06">Jun</option><option value="07">Jul</option><option value="08">Aug</option><option value="09">Sep</option><option value="10">Oct</option><option value="11">Nov</option><option value="12">Dec</option></select></div></div><div class="form-group has-feedback day" data-attr="day"><label class="control-label sr-only" for="signup-day" aria-hidden="true">Day</label><div class="birthday-dropdowns"><select id="signup-day" class="form-control enable input-lg custom-select custom-select-lg" name="day" required=""><option value="" disabled="" selected="">Day</option><option value="01">1</option><option value="02">2</option><option value="03">3</option><option value="04">4</option><option value="05">5</option><option value="06">6</option><option value="07">7</option><option value="08">8</option><option value="09">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option></select></div></div><div class="form-group has-feedback year" data-attr="year"><label class="control-label sr-only" for="signup-year" aria-hidden="true">Year</label><div class="birthday-dropdowns"><select id="signup-year" class="form-control enable input-lg custom-select custom-select-lg" name="year" required=""><option value="" disabled="" selected="">Year</option><option value="2025">2025</option><option value="2024">2024</option><option value="2023">2023</option><option value="2022">2022</option><option value="2021">2021</option><option value="2020">2020</option><option value="2019">2019</option><option value="2018">2018</option><option value="2017">2017</option><option value="2016">2016</option><option value="2015">2015</option><option value="2014">2014</option><option value="2013">2013</option><option value="2012">2012</option><option value="2011">2011</option><option value="2010">2010</option><option value="2009">2009</option><option value="2008">2008</option><option value="2007">2007</option><option value="2006">2006</option><option value="2005">2005</option><option value="2004">2004</option><option value="2003">2003</option><option value="2002">2002</option><option value="2001">2001</option><option value="2000">2000</option><option value="1999">1999</option><option value="1998">1998</option><option value="1997">1997</option><option value="1996">1996</option><option value="1995">1995</option><option value="1994">1994</option><option value="1993">1993</option><option value="1992">1992</option><option value="1991">1991</option><option value="1990">1990</option><option value="1989">1989</option><option value="1988">1988</option><option value="1987">1987</option><option value="1986">1986</option><option value="1985">1985</option><option value="1984">1984</option><option value="1983">1983</option><option value="1982">1982</option><option value="1981">1981</option><option value="1980">1980</option><option value="1979">1979</option><option value="1978">1978</option><option value="1977">1977</option><option value="1976">1976</option><option value="1975">1975</option><option value="1974">1974</option><option value="1973">1973</option><option value="1972">1972</option><option value="1971">1971</option><option value="1970">1970</option><option value="1969">1969</option><option value="1968">1968</option><option value="1967">1967</option><option value="1966">1966</option><option value="1965">1965</option><option value="1964">1964</option><option value="1963">1963</option><option value="1962">1962</option><option value="1961">1961</option><option value="1960">1960</option><option value="1959">1959</option><option value="1958">1958</option><option value="1957">1957</option><option value="1956">1956</option><option value="1955">1955</option><option value="1954">1954</option><option value="1953">1953</option><option value="1952">1952</option><option value="1951">1951</option><option value="1950">1950</option><option value="1949">1949</option><option value="1948">1948</option><option value="1947">1947</option><option value="1946">1946</option><option value="1945">1945</option><option value="1944">1944</option><option value="1943">1943</option><option value="1942">1942</option><option value="1941">1941</option><option value="1940">1940</option><option value="1939">1939</option><option value="1938">1938</option><option value="1937">1937</option><option value="1936">1936</option><option value="1935">1935</option><option value="1934">1934</option><option value="1933">1933</option><option value="1932">1932</option><option value="1931">1931</option><option value="1930">1930</option><option value="1929">1929</option><option value="1928">1928</option><option value="1927">1927</option><option value="1926">1926</option></select></div></div></div><div aria-describedby="birthday_error" aria-live="assertive" role="alert" class="error-msg"></div></div></div>
                    </div>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Pronounce (optional)</span>
                        <label class="control-label sr-only" for="pronouns">Pronounce</label>
                        <select id="pronouns" class="form-control enable input-lg" name="pronouns">
                            <option value="" selected="">Pronouns (optional)</option>
                            <option value="He/Him">He/Him</option>
                            <option value="She/Her">She/Her</option>
                            <option value="They/Them">They/Them</option>
                            <option value="Not listed">Not listed</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                    </div>
                    <div class="form-group has-feedback email">
                        <span class="form-label">Password</span>
                        <label class="control-label sr-only" for="signup-password">Password</label>
                        <div class="field-container">
                            <input type="text" id="signup-password" class="form-control enable input-lg" name="password" placeholder="Enter Password">
                        </div>
                    </div>
                    <div class="c-checkbox__content" id="policy-consent" style="display: flex; justify-content: flex-start; align-items: flex-start; gap: 8px;">
                        <input id="tac-check-box" type="checkbox" style="margin-top: 6px;">
                        <span class="checkbox-title" style="color: rgba(34,34,34,0.93); font-weight: 400; font-size: 14px;">Yes, I have read and agree to Wattpad's
                            <a href="/terms" style="color: rgba(28,111,101,0.93); font-weight: 700; font-size: 14px;">Terms of Service</a> and
                            <a href="/privacy" style="color: rgba(28,111,101,0.93); font-weight: 700; font-size: 14px;">Privacy Policy</a>.
                        </span>
                    </div>
                    <button id="signup-with-email-btn" class="btn-block btn-primary submit-btn-new" style="margin-top: 32px;">Sign up with email</button>
                </div>
                `;

    loginForm.append(additionalFields);
});



$(document).on('click','.back-all-option',function (event) {

    let loginForm = $('.login-form');
    loginForm.empty();

    let allOptionAvailable = `
                                    <p class="title">Sign up to join the largest storytelling community</p>
                                        <div class="panel-body">
                                            <div class="signin-buttons signin-buttons-new">
                                                <button class="btn btn-google btn-block auth-button-new" id="google-signup-button">
                                                    <!-- Hidden Google button -->
                                                    <div id="google-signin-button" style="opacity: 0; position: absolute; pointer-events: none;"></div>
                                                    <img src="assets/image/google_login_color.png" alt="Google Login" class="google-login-icon" width="18" aria-hidden="true">
                                                    <span>
                                                    <span class="auth-button-text-new">Sign up with Google</span>
                                                </span>
                                                </button>
                                                <button class="btn btn-facebook btn-block auth-button-new" data-source="login">
                                                    <img src="assets/image/facebook-login-color.png" alt="Facebook Login" class="google-login-icon" width="18" aria-hidden="true">
                                                    <span>
                                                    <span class="auth-button-text-new">Sign up with Facebook</span>
                                                </span>
                                                </button>
                                            </div>
                                            <div class="hr-with-text hr-margin-new">
                                                <div class="horizontal-line"></div>
                                                <span class="or"> or </span>
                                                <div class="horizontal-line"></div>
                                            </div>
                                            <button class="btn-block btn-primary submit-btn-new sign-up-with-email">Sign up with email</button>
                                        </div>
                                        <button class="footer-button-margin-signup button__Y70Pw tertiary-variant__Y9kWU default-accent__Pc0Pm medium-size__CLqD3 clickable__iYXtN full-width__dXWyx with-padding__cVt72">
                                            <span class="background-overlay__mCEaX"></span>
                                            I already have an account
                                        </button>
    `;

    loginForm.append(allOptionAvailable);
});



let resendData = null;
$(document).on('click','#signup-with-email-btn',function (event) {

    let email = $('#signup-email')[0].value.trim();
    let username = $('#signup-username')[0].value.trim();
    let fullName = $('#signup-fullName')[0].value.trim();
    let month = $('#signup-month')[0].value.trim();
    let day = $('#signup-day')[0].value.trim();
    let year = $('#signup-year')[0].value.trim();
    let pronouns = $('#pronouns')[0].value.trim();
    let password = $('#signup-password')[0].value.trim();
    let termAndConditionCheckBox = $('#tac-check-box').prop('checked');

    console.log(email);
    console.log(username);
    console.log(fullName);
    console.log(month);
    console.log(day);
    console.log(year);
    console.log(pronouns);
    console.log(password);
    console.log(termAndConditionCheckBox)

    let emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
    let usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    let fullNamePattern = /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;
    let passwordPattern = /^(?=.*\d).{7,}$/;

    let emailValidation = emailPattern.test(email);
    let usernameValidation = usernamePattern.test(username);
    let fullNameValidation = fullNamePattern.test(fullName);
    let passwordValidation = passwordPattern.test(password);


    if(email==='' || username==='' || fullName==='' || month==='' || day==='' || year==='' || password==='' || usernameAvailability){
        if(email===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Email required.</p>`;
            $('#signup-email').next('.warning-msg').remove();
            $('#signup-email').after(warningMsg);
        }
        if(email!=='' && !emailValidation){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Email invalid.</p>`;
            $('#signup-email').next('.warning-msg').remove();
            $('#signup-email').after(warningMsg);
        }
        if(username===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Username required.</p>`;
            $('#signup-username').next('.warning-msg').remove();
            $('#signup-username').after(warningMsg);
        }
        if(fullName===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Full Name required.</p>`;
            $('#signup-fullName').next('.warning-msg').remove();
            $('#signup-fullName').after(warningMsg);
        }
        if(fullName!=='' && !fullNameValidation){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Full Name invalid.</p>`;
            $('#signup-fullName').next('.warning-msg').remove();
            $('#signup-fullName').after(warningMsg);
        }
        if(month===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Month required.</p>`;
            $('.month').find('.warning-msg').remove();
            $('.month').append(warningMsg);
        }
        if(day===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Day required.</p>`;
            $('.day').find('.warning-msg').remove();
            $('.day').append(warningMsg);
        }
        if(year===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Year required.</p>`;
            $('.year').find('.warning-msg').remove();
            $('.year').append(warningMsg);
        }
        if(password===''){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Password required.</p>`;
            $('#signup-password').next('.warning-msg').remove();
            $('#signup-password').after(warningMsg);
        }
        if(password!=='' && !passwordValidation){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Password invalid.</p>`;
            $('#signup-password').next('.warning-msg').remove();
            $('#signup-password').after(warningMsg);
        }
        if(usernameAvailability && username!==''){
            $('#signup-username').next('.warning-msg').remove();
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Username not available</p>`;
            $('#signup-username').after(warningMsg);
        }
        return;
    }

    console.log(emailValidation)
    console.log(usernameValidation)
    console.log(fullNameValidation)
    console.log(passwordValidation)

    if(!emailValidation || !usernameValidation || !fullNameValidation || !passwordValidation){
        if(!emailValidation){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Email invalid.</p>`;
            $('#signup-email').next('.warning-msg').remove();
            $('#signup-email').after(warningMsg);
        }
        if(!usernameValidation){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Username invalid.</p>`;
            $('#signup-username').next('.warning-msg').remove();
            $('#signup-username').after(warningMsg);
        }
        if(!fullNameValidation){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Full Name invalid.</p>`;
            $('#signup-fullName').next('.warning-msg').remove();
            $('#signup-fullName').after(warningMsg);
        }
        if(!passwordValidation){
            let warningMsg = `<p class="warning-msg" style="font-size: small; color: #9e1d42; transform: translateY(-4px); font-weight: 400; text-align: left;">Password invalid.</p>`;
            $('#signup-password').next('.warning-msg').remove();
            $('#signup-password').after(warningMsg);
        }
        return;
    }

    if(!termAndConditionCheckBox){
        let warningModel = `
                                    <div class="warning-model" style="background-color: #fff; box-shadow: 0 1px 12px var(--wp-neutral-10); border-radius: 7px; position: absolute; padding: 24px 20px; z-index: 1000; display: flex; flex-direction: column; justify-content: flex-start; align-items: center; min-width: 300px; max-width: 400px;">
                                        <div class="warning-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="color: #d97706;"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        </div>
                                        <p style="font-size: 16px; color: #222; font-weight: 500; text-align: center;">You must agree to the terms and conditions before signing up!</p>
                                        <button class="warning-model-close-btn" style="background-color: black; padding: 10px; border-radius: 25px; color: #fff; font-weight: 600; width: 100px; margin-top: 17px;">OK</button>
                                    </div>  
                                    `;
        $('#policy-consent').find('.warning-model').remove();
        $('#policy-consent').append(warningModel);
        return;
    }

    let data = {
        'email': email,
        'username': username,
        'fullName': fullName,
        'birthday': year+'-'+month+'-'+day,
        'pronouns': pronouns,
        'password': password
    };
    resendData = data;

    console.log(data);

    fetch('http://localhost:8080/auth/email/signup', {
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
            console.log('POST Data:', data);

            localStorage.setItem('otp',data.data.otp);

            let otpModel = `
    <div class="modal-overlay">
        <div class="otp-modal">
            <input class="username-hide-input" style="display: none; visibility: hidden;" value="${username}">
        
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

        })
        .catch(error => {
            console.error('Fetch error:', error.message);

            let response = JSON.parse(error.message);
            if(response.status===400){

                Swal.fire({
                    title: 'Info!',
                    text: 'Your already signed up. please login!',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    willClose: () => {
                        window.location.href = 'login-page.html';
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


$(document).on('click','.verify-btn',function (event) {

    let children = $('.otp-container').children();

    let userOtp = '';
    for (let i = 0; i < children.length; i++) {
        userOtp += $(children[i]).val();
    }

    userOtp = Number(userOtp);
    let serverOtp = Number(localStorage.getItem('otp'));

    if(userOtp===serverOtp){

        let username = $('.username-hide-input')[0].value;

        fetch('http://localhost:8080/auth/email/signup/verify', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: username
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

    fetch('http://localhost:8080/auth/email/signup/otp/'+resendData.email, {
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


//close otp model
$(document).on('click','.close-btn',function (event) {

    $('body').find('.modal-overlay').remove();
});




























