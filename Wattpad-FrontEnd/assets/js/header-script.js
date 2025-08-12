//when click on browse drop down show genre model
let discoverDropDown = $('#discover-dropdown')[0];
discoverDropDown.addEventListener('click',function (event) {

    let header = document.querySelector('header');

    let hasDropdown = Array.from(header.children).some(child =>
        child.classList.contains('discover-categories-container')
    );
    if (hasDropdown) {
        let dropdown = header.querySelector('.discover-categories-container');
        if (dropdown) {
            dropdown.remove();
        }
    }

    let browseGenresDropdown = `
    <div class="discover-categories-container" style="display: flex; height: 348px;">
        <div class="discover-categories" style="display: flex;">
            <ul class="row" style="display: flex; width: 570px; padding-left: 10px;">
                <li class="browse-title" style="width: 570px; font-size: 1rem;">Browse</li>
                <li>
                    <a href="/stories/romance" class="on-topic">Romance</a>
                </li>
                <li>
                    <a href="/stories/fanfiction" class="on-topic">Fanfiction</a>
                </li>
                <li>
                    <a href="/stories/lgbt" class="on-topic">LGBTQ+</a>
                </li>
                <li>
                    <a href="https://www.wattpad.com/catalog/wattpadoriginals" class="on-topic">Wattpad
                        Originals</a>
                </li>
                <li>
                    <a href="/stories/werewolf" class="on-topic">Werewolf</a>
                </li>
                <li>
                    <a href="/stories/newadult" class="on-topic">New Adult</a>
                </li>
                <li>
                    <a href="/stories/fantasy" class="on-topic">Fantasy</a>
                </li>
                <li>
                    <a href="/stories/shortstory" class="on-topic">Short Story</a>
                </li>
                <li>
                    <a href="/stories/teenfiction" class="on-topic">Teen Fiction</a>
                </li>
                <li>
                    <a href="/stories/historicalfiction" class="on-topic">Historical Fiction</a>
                </li>
                <li>
                    <a href="/stories/paranormal" class="on-topic">Paranormal</a>
                </li>
                <li>
                    <a href="https://www.wattpad.com/list/551324301" class="on-topic">Editor's Picks</a>
                </li>
                <li>
                    <a href="/stories/humor" class="on-topic">Humor</a>
                </li>
                <li>
                    <a href="/stories/horror" class="on-topic">Horror</a>
                </li>
                <li>
                    <a href="/stories/contemporarylit" class="on-topic">Contemporary Lit</a>
                </li>
                <li>
                    <a href="/stories/diverselit" class="on-topic">Diverse Lit</a>
                </li>
                <li>
                    <a href="/stories/mystery" class="on-topic">Mystery</a>
                </li>
                <li>
                    <a href="/stories/thriller" class="on-topic">Thriller</a>
                </li>
                <li>
                    <a href="/stories/sciencefiction" class="on-topic">Science Fiction</a>
                </li>
                <li>
                    <a href="https://www.wattpad.com/user/TheWattys" class="on-topic">The Wattys</a>
                </li>
                <li>
                    <a href="/stories/adventure" class="on-topic">Adventure</a>
                </li>
                <li>
                    <a href="/stories/nonfiction" class="on-topic">Non-Fiction</a>
                </li>
                <li>
                    <a href="/stories/poetry" class="on-topic">Poetry</a>
                </li>
            </ul>
        </div>
    </div>
    `
    let jqueryHeader = $('header');
    jqueryHeader.append(browseGenresDropdown);
});



//when click on write drop down show write model
let writeDropDown = $('#writer-opportunities-dropdown')[0];
writeDropDown.addEventListener('click',function (event) {

    let header = document.querySelector('header');

    let hasDropdown = Array.from(header.children).some(child =>
        child.classList.contains('MaVh4')
    );
    if (hasDropdown) {
        let dropdown = header.querySelector('.MaVh4');
        if (dropdown) {
            dropdown.remove();
        }
    }

    let writeDropdown = `
    <div class="MaVh4 V-8Oa M33oU">
        <ul class="_0X2RS" aria-label="Write">
            <li class="fnWge">
                <a class="c97t-" href="#" rel="nofollow"><img class="_5Aey9" alt="Create a new story" src="assets/image/create-story.svg">Create a new story</a>
            </li>
            <li class="fnWge">
                <a class="c97t-" href="#" target="_self">My Stories</a>
            </li>
        </ul>
    </div>
    `

    let jqueryHeader = $('header');
    jqueryHeader.append(writeDropdown);
});



//when click on user profile show navigation model
let profileDropdown = $('#profile-dropdown')[0];
profileDropdown.addEventListener('click',function (event) {

    let header = document.querySelector('header');

    let hasDropdown = Array.from(header.children).some(child =>
        child.classList.contains('profile-dropdown')
    );
    if (hasDropdown) {
        let dropdown = header.querySelector('.profile-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }

    let profileDropdown = `

    <div class="dropdown-menu dropdown-menu-right large profile-dropdown" role="menu" aria-labelledby="profile-dropdown">
              <ul aria-label="Profile" class="header-list">
                  <li><a class="on-navigate" href="">My Profile</a></li>
                  <li role="presentation" class="divider"></li>
                  <li><a href="/inbox">Inbox</a></li>
                  <li><a href="/notifications">Notifications</a></li>
                  <li><a href="/library">Library</a></li>
                  <li role="presentation" class="divider"></li>
                  <li><a href="/settings/language?jq=true" class="on-language" data-ignore="true">Language: English</a></li>
                  <li><a href="//support.wattpad.com">Help</a></li>
                  <li><a class="on-navigate" href="/settings">Settings</a></li>
                  <li><a href="/logout" class="on-logout">Log Out</a></li>
              </ul>
          </div>
    `

    let jqueryHeader = $('header');
    jqueryHeader.append(profileDropdown);
});



//when click on the body remove all the models
let body = $('body')[0];
body.addEventListener('click',function (event) {

    //ignore if click on header
    if (event.target.closest('header')) {
        return;
    }

    let header = document.querySelector('header');

    //remove browse dropdown model
    let hasDropdownBrowse = Array.from(header.children).some(child =>
        child.classList.contains('discover-categories-container')
    );
    if (hasDropdownBrowse) {
        let dropdown = header.querySelector('.discover-categories-container');
        if (dropdown) {
            dropdown.remove();
        }
    }

    //remove write dropdown model
    let hasDropdownWrite = Array.from(header.children).some(child =>
        child.classList.contains('MaVh4')
    );
    if (hasDropdownWrite) {
        let dropdown = header.querySelector('.MaVh4');
        if (dropdown) {
            dropdown.remove();
        }
    }

    //remove profile dropdown model
    let hasDropdownProfile = Array.from(header.children).some(child =>
        child.classList.contains('profile-dropdown')
    );
    if (hasDropdownProfile) {
        let dropdown = header.querySelector('.profile-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }
});



//get user profile image path
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

            if(data.data!==null){
                $('.user-profile-pic').attr('src', `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${data.data}`);
            }

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
}

setProfilePic();















