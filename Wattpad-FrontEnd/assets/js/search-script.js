let form = document.getElementById('search-form');
//when submit the search input navigate to search result page
form.addEventListener('submit', function (event) {

    event.preventDefault();

    let inputValue = $('#search-input')[0].value.trim();
    if(inputValue===''){
        return;
    }

    window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search-stories-page.html?search=${inputValue}`;
});




//when enter input to the search bar get top stories suggestions
let searchInput = $('#search-input')[0];
searchInput.addEventListener('keyup',function (event) {

    let inputValue = searchInput.value.trim();

    if(inputValue.length>=3) {

        fetch('http://localhost:8080/api/v1/search/'+inputValue, {
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

                let ar = data.data;

                if(ar.length>0){
                    $('#search-suggestions-container').css('display','block');
                    $('#search-suggestions-list').empty();

                    for (let i = 0; i < ar.length; i++) {
                        let title = `<li class="_2fMQj "><a class="_8oV22" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search-stories-page.html?search=${ar[i]}"><svg width="13px" height="13px" viewBox="0 0 24 24" fill="none" stroke="#eee" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round"><g><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></g></svg><span class="UO9bH">${ar[i]}</span></a></li>`;
                        $('#search-suggestions-list').append(title);
                    }
                }
                else{
                    $('#search-suggestions-container').css('display','none');
                }

            })
            .catch(error => {
                let response = JSON.parse(error.message);
                console.log(response);

                window.location.href = 'login-page.html';
            });
    }
    else{
        $('#search-suggestions-list').empty();
        $('#search-suggestions-container').css('display','none');
    }
});





//header script

// When click on browse dropdown show genre modal
let discoverDropDown = $('#discover-dropdown')[0];
discoverDropDown.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    let header = document.querySelector('header');
    let existingDropdown = header.querySelector('.discover-categories-container');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }

    let browseGenresDropdown = `
        <div class="discover-categories-container" style="height: 325px; padding-top: 13px;">
            <div class="discover-categories">
                <ul class="row" style="width: 580px; display: flex; flex-wrap: wrap;">
                    <li class="browse-title">Browse</li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Romance" class="on-topic">Romance</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Fanfiction" class="on-topic">Fanfiction</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=LGBTQ%2B" class="on-topic">LGBTQ+</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Wattpad Originals" class="on-topic">Wattpad Originals</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Werewolf" class="on-topic">Werewolf</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=New Adult" class="on-topic">New Adult</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Fantasy" class="on-topic">Fantasy</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Short Story" class="on-topic">Short Story</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Teen Fiction" class="on-topic">Teen Fiction</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Historical Fiction" class="on-topic">Historical Fiction</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Paranormal" class="on-topic">Paranormal</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Humor" class="on-topic">Editor's Picks</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Humor" class="on-topic">Humor</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Horror" class="on-topic">Horror</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Contemporary Lit" class="on-topic">Contemporary Lit</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Diverse Lit" class="on-topic">Diverse Lit</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Mystery" class="on-topic">Mystery</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Thriller" class="on-topic">Thriller</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Science Fiction" class="on-topic">Science Fiction</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=TheWattys" class="on-topic">The Wattys</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Adventure" class="on-topic">Adventure</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Non-Fiction" class="on-topic">Non-Fiction</a>
                    </li>
                    <li>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Poetry" class="on-topic">Poetry</a>
                    </li>
                </ul>
            </div>
        </div>
    `;
    let jqueryHeader = $('header');
    jqueryHeader.append(browseGenresDropdown);
});



// When click on write dropdown show write modal
let writeDropDown = $('#writer-opportunities-dropdown')[0];
writeDropDown.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    let header = document.querySelector('header');
    let existingDropdown = header.querySelector('.MaVh4');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }

    let writeDropdown = `
        <div class="MaVh4 V-8Oa M33oU">
            <ul class="_0X2RS" aria-label="Write">
                <li class="fnWge">
                    <a class="c97t-" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/create-story-page.html" rel="nofollow"><img class="_5Aey9" alt="Create a new story" src="assets/image/create-story.svg">Create a new story</a>
                </li>
                <li class="fnWge">
                    <a class="c97t-" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/mywork-page.html" target="_self">My Stories</a>
                </li>
            </ul>
        </div>
    `;

    let jqueryHeader = $('header');
    jqueryHeader.append(writeDropdown);
});



// When click on user profile show navigation modal
let profileDropdownDesktop = $('#_83DhP')[0];
let profileDropdownMobile = $('#navbar-profile-dropdown')[0];

[profileDropdownDesktop, profileDropdownMobile].forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        let header = document.querySelector('header');
        let existingDropdown = header.querySelector('.profile-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }

        fetch('http://localhost:8080/user/current', {
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
                console.log('POST Data:', data);
                const currentUser = data.data;

                // Generate dropdown content only after fetching the user data
                let profileDropdownContent = `
                    <div class="dropdown-menu dropdown-menu-right large profile-dropdown" role="menu" aria-labelledby="profile-dropdown">
                        <ul aria-label="Profile" class="header-list">
                            <li><a class="on-navigate" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${currentUser.id}">My Profile</a></li>
                            <li role="presentation" class="divider"></li>
                            <li><a href="/inbox">Inbox</a></li>
                            <li><a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/notification-page.html">Notifications</a></li>
                            <li><a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/library-page.html">Library</a></li>
                            <li role="presentation" class="divider"></li>
                            <li><a href="/settings/language?jq=true" class="on-language" data-ignore="true">Language: English</a></li>
                            <li><a href="//support.wattpad.com">Help</a></li>
                            <li><a class="on-navigate" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/setting-page.html">Settings</a></li>
                            <li><a href="/logout" class="on-logout">Log Out</a></li>
                        </ul>
                    </div>
                `;

                let jqueryHeader = $('header');
                jqueryHeader.append(profileDropdownContent);
            })
            .catch(error => {
                console.error('Fetch error:', error.message);
                let response = JSON.parse(error.message);

                if (response.status === 404) {
                    window.location.href = 'signup-page.html';
                } else if (response.status === 401) {
                    window.location.href = 'login-page.html';
                } else if (response.status === 403) {
                    // you are not allow to access this
                } else if (response.status === 500) {
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
});



// Close all modals when clicking outside
// $(document).on('click', { capture: true }, function (event) {
//     let header = document.querySelector('header');
//     let searchSuggestions = document.querySelector('#search-suggestions-container');
//     if (!event.target.closest('header') && !event.target.closest('#search-suggestions-container')) {
//         let dropdowns = header.querySelectorAll('.discover-categories-container, .MaVh4, .profile-dropdown');
//         dropdowns.forEach(dropdown => {
//             if (dropdown) dropdown.remove();
//         });
//         // Hide search suggestions if visible
//         if (searchSuggestions && searchSuggestions.style.display !== 'none') {
//             searchSuggestions.style.display = 'none';
//         }
//     }
// });
// Close all modals when clicking outside
// $(document).on('click', function (event) {
//     let header = document.querySelector('header');
//     let searchSuggestions = $('#search-suggestions-container');
//
//     if (!$(event.target).closest('header').length && !$(event.target).closest('#search-suggestions-container').length) {
//         $(header).find('.discover-categories-container, .MaVh4, .profile-dropdown').remove();
//         searchSuggestions.hide();
//     }
// });
// Close dropdowns/modals when clicking on body
$('body').on('click', function (event) {
    let $target = $(event.target);

    // if the click is inside any dropdown or on its trigger button → do nothing
    if (
        $target.closest('.discover-categories-container').length ||
        $target.closest('.MaVh4').length ||
        $target.closest('.profile-dropdown').length ||
        $target.closest('#discover-dropdown').length ||
        $target.closest('#writer-opportunities-dropdown').length ||
        $target.closest('#_83DhP').length ||
        $target.closest('#navbar-profile-dropdown').length
    ) {
        return; // do nothing
    }

    // otherwise → close all dropdowns
    $('.discover-categories-container, .MaVh4, .profile-dropdown').remove();
    $('#search-suggestions-container').hide();
});




// Get user profile image path
function setProfilePic() {
    fetch('http://localhost:8080/user/profilePic', {
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
            console.log('POST Data:', data);

            if (data.data !== null) {
                $('.user-profile-pic').attr('src', `${data.data}`);
            }
        })
        .catch(error => {
            console.error('Fetch error:', error.message);
            let response = JSON.parse(error.message);

            if (response.status === 404) {
                window.location.href = 'signup-page.html';
            } else if (response.status === 401) {
                window.location.href = 'login-page.html';
            } else if (response.status === 403) {
                // you are not allow to access this
            } else if (response.status === 500) {
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

setProfilePic();
















