//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/search', {
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

            if (params.has("search")) {
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





//load all profile that match to searched keyword
async function loadAllProfileThatMatchToSearchedKeyWord() {

    let search = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("search")) {
        search = params.get("search");
    }

    if(search==null){
        //load chapter not found page
        return;
    }

    $('#searched-keyword').text('"'+search+'"');

    await fetch('http://localhost:8080/api/v1/search/profile/by/'+encodeURIComponent(search), {
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

            $('#profile-container').empty();

            for (let i = 0; i < data.data.length; i++) {

                let user = data.data[i];

                let singleProfile = `<!--single profile-->
                                            <li class="list-group-item new-item">
                                                <div class="profile-card">
                                                    <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${user.userId}" class="profile-card-data">
                                                        <img class="display-pic" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${user.profilePicPath}" alt="mystrie" aria-hidden="true">
                                                        <div class="card-content">
                                                            <div class="sr-only">mystrie @mystrie</div>
                                                            <div class="name-and-badges" aria-hidden="true">
                                                                <h5>${user.fullName}</h5>
                                                                <div class="badges"></div>
                                                            </div>
                                                            <p class="username" aria-hidden="true">@${user.username}</p>
                                                            <div class="card-meta">
                                                                <p><b>${user.storyCount}</b> Stories</p>
                                                                <p><b>${user.readingListCount}</b> Reading lists</p>
                                                                <p><b>${user.followersCount}</b> Followers</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    ${user.isCurrentUserFollowed === 1
                                                    ? `<button data-user-id="${user.userId}" class="follow btn-load-more active following-btn" aria-label="Following">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="follow__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 7C3.5 9.76142 5.73858 12 8.5 12C11.2614 12 13.5 9.76142 13.5 7C13.5 4.23858 11.2614 2 8.5 2C5.73858 2 3.5 4.23858 3.5 7ZM11.5 7C11.5 8.65685 10.1569 10 8.5 10C6.84315 10 5.5 8.65685 5.5 7C5.5 5.34315 6.84315 4 8.5 4C10.1569 4 11.5 5.34315 11.5 7ZM17 21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V19C15 17.3431 13.6569 16 12 16H5C3.34315 16 2 17.3431 2 19V21C2 21.5523 1.55228 22 1 22C0.447715 22 0 21.5523 0 21V19C0 16.2386 2.23858 14 5 14H12C14.7614 14 17 16.2386 17 19V21ZM23.7071 8.29289C23.3166 7.90237 22.6834 7.90237 22.2929 8.29289L19 11.5858L17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929C15.9024 10.6834 15.9024 11.3166 16.2929 11.7071L18.2929 13.7071C18.6834 14.0976 19.3166 14.0976 19.7071 13.7071L23.7071 9.70711C24.0976 9.31658 24.0976 8.68342 23.7071 8.29289Z"></path></g></svg>
                                                        <span class="follow__text" aria-hidden="true">Following</span>
                                                       </button>`
                                                    : `<button data-user-id="${user.userId}" class="follow btn-load-more follow-btn" aria-label="Follow">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#222222" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="follow__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 7C3.5 9.76142 5.73858 12 8.5 12C11.2614 12 13.5 9.76142 13.5 7C13.5 4.23858 11.2614 2 8.5 2C5.73858 2 3.5 4.23858 3.5 7ZM11.5 7C11.5 8.65685 10.1569 10 8.5 10C6.84315 10 5.5 8.65685 5.5 7C5.5 5.34315 6.84315 4 8.5 4C10.1569 4 11.5 5.34315 11.5 7ZM17 21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V19C15 17.3431 13.6569 16 12 16H5C3.34315 16 2 17.3431 2 19V21C2 21.5523 1.55228 22 1 22C0.447715 22 0 21.5523 0 21V19C0 16.2386 2.23858 14 5 14H12C14.7614 14 17 16.2386 17 19V21ZM21 10H23C24.3333 10 24.3333 12 23 12H21V14C21 15.3333 19 15.3333 19 14V12H17C15.6667 12 15.6667 10 17 10H19V8C19 6.66667 21 6.66667 21 8V10Z"></path></g></svg>
                                                        <span class="follow__text" aria-hidden="true">Follow</span>
                                                       </button>`
                                                    }
                                                </div>
                                            </li>`;

                $('#profile-container').append(singleProfile);
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

loadAllProfileThatMatchToSearchedKeyWord();




$(document).on('click', '.follow-btn', function () {

    let userId = $(this).data('user-id');

    console.log("-----");
    console.log(userId);

    fetch('http://localhost:8080/api/v1/follow/add/'+userId, {
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

            let parent = $(this).parent();

            parent.children('button').remove();

            let followingBtn = `<button data-user-id="${userId}" class="follow btn-load-more active following-btn" aria-label="Following">
                                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="follow__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 7C3.5 9.76142 5.73858 12 8.5 12C11.2614 12 13.5 9.76142 13.5 7C13.5 4.23858 11.2614 2 8.5 2C5.73858 2 3.5 4.23858 3.5 7ZM11.5 7C11.5 8.65685 10.1569 10 8.5 10C6.84315 10 5.5 8.65685 5.5 7C5.5 5.34315 6.84315 4 8.5 4C10.1569 4 11.5 5.34315 11.5 7ZM17 21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V19C15 17.3431 13.6569 16 12 16H5C3.34315 16 2 17.3431 2 19V21C2 21.5523 1.55228 22 1 22C0.447715 22 0 21.5523 0 21V19C0 16.2386 2.23858 14 5 14H12C14.7614 14 17 16.2386 17 19V21ZM23.7071 8.29289C23.3166 7.90237 22.6834 7.90237 22.2929 8.29289L19 11.5858L17.7071 10.2929C17.3166 9.90237 16.6834 9.90237 16.2929 10.2929C15.9024 10.6834 15.9024 11.3166 16.2929 11.7071L18.2929 13.7071C18.6834 14.0976 19.3166 14.0976 19.7071 13.7071L23.7071 9.70711C24.0976 9.31658 24.0976 8.68342 23.7071 8.29289Z"></path></g></svg>
                                         <span class="follow__text" aria-hidden="true">Following</span>
                                       </button>`;
            parent.append(followingBtn);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

            window.location.href = 'login-page.html';
        });

});




$(document).on('click', '.following-btn', function () {

    let userId = $(this).data('user-id');

    console.log("+++++");
    console.log(userId);

    fetch('http://localhost:8080/api/v1/follow/remove/'+userId, {
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

            let parent = $(this).parent();

            parent.children('button').remove();

            let followBtn = `<button data-user-id="${userId}" class="follow btn-load-more follow-btn" aria-label="Follow">
                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="#222222" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="follow__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 7C3.5 9.76142 5.73858 12 8.5 12C11.2614 12 13.5 9.76142 13.5 7C13.5 4.23858 11.2614 2 8.5 2C5.73858 2 3.5 4.23858 3.5 7ZM11.5 7C11.5 8.65685 10.1569 10 8.5 10C6.84315 10 5.5 8.65685 5.5 7C5.5 5.34315 6.84315 4 8.5 4C10.1569 4 11.5 5.34315 11.5 7ZM17 21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V19C15 17.3431 13.6569 16 12 16H5C3.34315 16 2 17.3431 2 19V21C2 21.5523 1.55228 22 1 22C0.447715 22 0 21.5523 0 21V19C0 16.2386 2.23858 14 5 14H12C14.7614 14 17 16.2386 17 19V21ZM21 10H23C24.3333 10 24.3333 12 23 12H21V14C21 15.3333 19 15.3333 19 14V12H17C15.6667 12 15.6667 10 17 10H19V8C19 6.66667 21 6.66667 21 8V10Z"></path></g></svg>
                                          <span class="follow__text" aria-hidden="true">Follow</span>
                                       </button>`;
            parent.append(followBtn);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

            window.location.href = 'login-page.html';
        });

});
















