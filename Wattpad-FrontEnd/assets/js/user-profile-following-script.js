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

    fetch('http://localhost:8080/api/v1/following', {
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
                $('#profile-pic').attr('src', `${user.profilePicPath}`);

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
                $('#reading-list-setting').remove();
                $('#add-reading-list').remove();
                $('#story-setting').remove();
            }

            $('.about-tab').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${userId}`);

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




//load followers
let count = 16;
async function loadFollowingUsers() {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if(userId==null){
        //load chapter not found page
        return; 
    }

    await fetch('http://localhost:8080/api/v1/following/following/users/'+userId+'/'+count, {
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

            if(data.data.isMoreFollowingUsersAvailable===0){
                $('.show-more-user-btn').remove();
            }

            $('#user-profiles-container').empty();
            for (let i = 0; i < data.data.followingUserDTOList.length; i++) {

                let user = data.data.followingUserDTOList[i];

                const randomIndex = Math.floor(Math.random() * profileColors.length);
                const randomColor = profileColors[randomIndex];

                let singleUser = `
                        <article class="user-card" style="width: 220px;">
                            ${user.coverPicPath===null
                            ? `<div class="background background-sm" style="background-image: url( '${user.coverPicPath}' );"></div>`
                            : `<div class="background background-sm" style="background-color: ${randomColor}"></div>`
                            }
                            ${user.profilePicPath===null
                            ? `<a style="background-color: ${randomColor};" class="avatar avatar-lg on-navigate" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${user.userId}">
                                 <p style="font-weight: 500; font-size: 3em; text-align: center; transform: translateY(28px); color: #fff;">${user.fullName.substring(0,1).toUpperCase()}</p>
                               </a>`
                            : `<a class="avatar avatar-lg on-navigate" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${user.userId}">
                                <img style="object-fit: cover;" src="${user.profilePicPath}">
                               </a>`
                            }
                            <div class="content">
                                <h5><a class="alt-link on-navigate" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${user.userId}">${user.fullName}</a></h5>
                                <small>@${user.username}</small>
                                ${user.isFollowedByTheCurrentUser===1
                                ? `<button data-user-id="${user.userId}" class="btn btn-fan btn-md btn-block btn-teal on-unfollow unfollow-btn" role="button">
                                    <i class="fa-solid fa-user-plus" style="font-size:15px; color: #fff;"></i>
                                    <span class="truncate">Followed</span>
                                </button>`
                                : `<button data-user-id="${user.userId}" style="background-color: #fff; border: 1.5px solid rgba(111,111,111,0.5);" class="btn btn-fan btn-md btn-block btn-teal on-unfollow follow-btn" role="button">
                                    <i class="fa-solid fa-user-plus" style="font-size:15px; color: #099;"></i>
                                    <span class="truncate" style="color: #6f6f6f;">Follow</span>
                                </button>`
                                }
                            </div>
                            <footer>
                                <div>
                                    <h5>${user.work}</h5>
                                    <small class="x-small">Works</small>
                                </div>
                                <div>
                                    <h5>${user.followings}</h5>
                                    <small class="x-small">Following</small>
                                </div>
                                <div>
                                    <h5>${user.followers}</h5>
                                    <small class="x-small">Followers</small>
                                </div>
                            </footer>
                        </article>`

                $('#user-profiles-container').append(singleUser);
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




//click on show more users btn
let showMoreUsersBtn = $('.show-more-user-btn')[0];
showMoreUsersBtn.addEventListener('click',async function (event) {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        //load chapter not found page
        return;
    }

    count+=16;
    loadFollowingUsers();

});




//follow user
$(document).on('click', '.follow-btn', function (event) {

    let userId = $('.follow-btn').data('user-id');

    fetch('http://localhost:8080/user/follow/' + userId, {
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
            loadFollowingUsers();
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
});




//unfollow user
$(document).on('click', '.unfollow-btn', function (event) {

    let userId = $('.unfollow-btn').data('user-id');

    fetch('http://localhost:8080/user/unfollow/' + userId, {
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
            loadFollowingUsers();
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
});




async function run() {
    await loadUserData();
    loadFollowingUsers();

}

run();




//click on edit profile
let editProfileBtn = $('.on-edit-profile')[0];
editProfileBtn.addEventListener('click',async function (event) {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        //load chapter not found page
        return;
    }

    window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile-edit-page.html?userId=${userId}`;

});




// Open followers modal and load followers
let openFollowersModelBtn = $('.open-followers-model')[0];
if (openFollowersModelBtn) {
    openFollowersModelBtn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const $modal = $('#follower-modal');
        $modal.css({
            'display': 'block',
            'visibility': 'visible',
            'opacity': 1
        });

        loadFollowers(); // Load followers when modal opens
    });
}

// Close followers modal
let followersModelCloseBtn = $('.followers-model-close-btn')[0];
if (followersModelCloseBtn) {
    followersModelCloseBtn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        $('#follower-modal').css({
            'display': 'none',
            'visibility': 'hidden',
            'opacity': 0
        });
    });
}

// Load all followers from backend
let followersCount = 6;
function loadFollowers() {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        // load chapter not found page
        return;
    }

    fetch('http://localhost:8080/user/followers/'+userId+'/'+followersCount, {
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
            console.log('Followers data:', data);
            const $userRowItems = $('#user-row-items');
            $userRowItems.empty();

            if(data.data.isMoreFollowingUsersAvailable===0){
                $('.show-more-followers').remove();
            }

            if (data.data && data.data.followingUserDTOList.length > 0) {
                data.data.followingUserDTOList.forEach(follower => {
                    const isFollowing = follower.isFollowedByTheCurrentUser;
                    $userRowItems.append(`
                        <div class="col-xs-12">
                            <div class="pull-left">
                                <a class="avatar avatar-sm3 on-navigate" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${follower.userId}">
                                    <img style="object-fit: cover;" alt="${follower.username}" src="${follower.profilePicPath || `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/avatar.jpg`}">
                                </a>
                            </div>
                            <div class="user-data pull-left truncate-width">
                                <a class="alt-link on-navigate fullname" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${follower.userId}">
                                    ${follower.fullName || follower.username}
                                    <span class="username">@${follower.username}</span>
                                </a>
                                <ul>
                                    <li>${follower.work || 0} Work${follower.work !== 1 ? 's' : ''}</li>
                                    <li>${follower.followers || 0} Follower${follower.followers !== 1 ? 's' : ''}</li>
                                </ul>
                            </div>
                            <div class="follow">
                                <button class="btn btn-fan btn-white on-follow" data-target="${follower.userId}" data-following="false" role="button" style="display: ${isFollowing ? 'none' : 'inline-block'};">
                                    <i class="fa-solid fa-user-plus" style="font-size:15px; color: gray;"></i>
                                    <span class="truncate">Follow</span>
                                </button>
                                <button class="btn btn-fan on-following" data-target="${follower.userId}" data-following="true" role="button" style="display: ${isFollowing ? 'inline-block' : 'none'}; background: none; color: #000;">
                                    <i class="fa-solid fa-user-check" style="font-size:15px; color: gray;"></i>
                                    <span class="truncate">Following</span>
                                </button>
                            </div>
                        </div>
                    `);
                });
                $('.modal-title').text(`${data.data.followingUserDTOList.length} Follower${data.data.length !== 1 ? 's' : ''}`);
            } else {
                $userRowItems.append('<div class="col-xs-12">No followers found.</div>');
                $('.modal-title').text('0 Followers');
            }
        })
        .catch(error => {
            console.error('Error loading followers:', error);
            $('#user-row-items').html('<div class="col-xs-12">Failed to load followers.</div>');
        });
}


let showMoreFollowersBtn = $('.showmore-followers-btn')[0];
showMoreFollowersBtn.addEventListener('click',function (event) {

    followersCount+=6;
    loadFollowers();
});


// Handle follow button click
$(document).on('click', '.on-follow', function (event) {
    event.preventDefault();
    event.stopPropagation();

    const $button = $(this);
    const userId = $button.data('target');

    fetch(`http://localhost:8080/api/v1/follow/add/${userId}`, {
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
            console.log('Follow success:', data);
            $button.hide();
            $button.next('.on-following').show();
            loadFollowingUsers();
        })
        .catch(error => {
            console.error('Error following user:', error);
            alert('Failed to follow user.');
        });
});

// Handle following button click
$(document).on('click', '.on-following', function (event) {
    event.preventDefault();
    event.stopPropagation();

    const $button = $(this);
    const userId = $button.data('target');

    fetch(`http://localhost:8080/api/v1/follow/remove/${userId}`, {
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
            console.log('Unfollow success:', data);
            $button.hide();
            $button.prev('.on-follow').show();
            loadFollowingUsers();
        })
        .catch(error => {
            console.error('Error unfollowing user:', error);
            alert('Failed to unfollow user.');
        });
});

















