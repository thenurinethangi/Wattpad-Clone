let currentUser = null;

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
        <div class="discover-categories-container" style="display: flex; height: 348px;">
            <div class="discover-categories" style="display: flex;">
                <ul class="row" style="display: flex; width: 570px; padding-left: 10px;">
                    <li class="browse-title" style="width: 570px; font-size: 1rem;">Browse</li>
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
$(document).on('click', { capture: true }, function (event) {
    let header = document.querySelector('header');
    let searchSuggestions = document.querySelector('#search-suggestions-container');
    if (!event.target.closest('header') && !event.target.closest('#search-suggestions-container')) {
        let dropdowns = header.querySelectorAll('.discover-categories-container, .MaVh4, .profile-dropdown');
        dropdowns.forEach(dropdown => {
            if (dropdown) dropdown.remove();
        });
        // Hide search suggestions if visible
        if (searchSuggestions && searchSuggestions.style.display !== 'none') {
            searchSuggestions.style.display = 'none';
        }
    }
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