const profileColors = [
    "#F28B82", // soft red
    "#F78DA7", // soft pink
    "#C58AF9", // soft purple
    "#A7A5EB", // light indigo
    "#81A1F5", // light blue
    "#5AC8FA", // sky blue
    "#5FD1C8", // teal
    "#4DD0A5", // aqua green
    "#6CCB7F", // fresh green
    "#A3D977", // lime green
    "#FFD580", // soft peach
    "#FFB870"  // soft orange
];


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

            const params = new URLSearchParams(window.location.search);

            if (params.has("userId")) {
                document.body.style.display = 'block';
                document.body.style.visibility = 'visible';
                document.body.style.opacity = 1;
            }
            else {
                window.location.href = 'login-page.html';
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

            window.location.href = 'login-page.html';
        });
}




//load user profile data
async function loadUserData() {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if(userId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/user/'+userId, {
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

            $('.profile-name').text(user.fullName);
            $('#alias').text('@'+user.username);
            $('#work').text(user.work);
            $('#reading-lists').text(user.readingLists);
            $('.followers-count').text(user.followers);

            if(user.profilePicPath==null){
                console.log('profile pic is null');
                $('#profile-pic').remove();
                $('.profile-pic-container').append(`<p style="font-weight: 500; font-size: 4em; text-align: center; transform: translateY(28px);">${user.fullName.substring(0,1).toUpperCase()}</p>`);

                const randomIndex = Math.floor(Math.random() * profileColors.length);
                const randomColor = profileColors[randomIndex];

                $('.profile-pic-warp').css('background-color',randomColor);
                $('.profile-pic-warp').css('border','0.5px solid #E0E0E0');

                if(user.coverPicPath==null){
                    $('.background.background-lg').css('background-color',randomColor);
                }
                else{
                    $('.background.background-lg').css('background-image', `url(${user.coverPicPath})`);
                }
            }
            else {
                $('#profile-pic').attr('src', `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${user.profilePicPath}`);

                if(user.coverPicPath==null){
                    const randomIndex = Math.floor(Math.random() * profileColors.length);
                    const randomColor = profileColors[randomIndex];
                    $('.background.background-lg').css('background-color',randomColor);
                }
                else{
                    $('.background.background-lg').css('background-image', `url(${user.coverPicPath})`);
                }
            }

            if(user.isCurrentUser===1){
                $('.on-follow-user.on-follow').remove();
                $('.three-dots-btn').remove();
            }
            else{
                $('.user-balance').remove();
                $('.on-edit-profile').remove();
            }

            if(user.about==null){
                $('.description').remove();
            }
            else{
                $('.no-description').remove();
                $('.description').find('pre').text(user.about);
            }

            if(user.location==null){
                $('.location').remove();
            }
            else{
                $('.location').html(`<span class="user-meta-info-content">
                                         <i class="fa-solid fa-location-dot" style="color: #6f6f6f; font-size: 14px; margin-right: 5px;"></i>${user.location}
                                     </span>`);
            }

            $('.date').html(`<span class="user-meta-info-content">
                                <span>Joined</span>${user.joinedDate}
                             </span>`);

            if(user.facebookLink==null){
                $('.facebook').empty();
            }
            else{
                $('.facebook').find('a').text(user.fullName.split(' ')[0]+'\'s Facebook profile');
            }


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
    await loadUserData();
}

run();





























