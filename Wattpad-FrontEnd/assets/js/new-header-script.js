//header script

// Toggle browse dropdown visibility
let discoverDropDown = $('#discover-dropdown')[0];
let browseModal = document.getElementById('browse-modal');
discoverDropDown.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (browseModal.style.display === 'none' || browseModal.style.display === '') {
        browseModal.style.display = 'block';
        browseModal.style.visibility = 'visible';
        browseModal.style.opacity = '1';
    }
});

// Toggle write dropdown visibility
let writeDropDown = $('#writer-opportunities-dropdown')[0];
let writeModal = document.getElementById('write-modal');
writeDropDown.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (writeModal.style.display === 'none' || writeModal.style.display === '') {
        writeModal.style.display = 'block';
        writeModal.style.visibility = 'visible';
        writeModal.style.opacity = '1';
    }
});

// Toggle profile dropdown visibility (desktop)
let profileDropdownDesktop = $('#_83DhP')[0];
let profileModalDesktop = document.getElementById('profile-modal-desktop');
profileDropdownDesktop.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (profileModalDesktop.style.display === 'none' || profileModalDesktop.style.display === '') {
        profileModalDesktop.style.display = 'block';
        profileModalDesktop.style.visibility = 'visible';
        profileModalDesktop.style.opacity = '1';
    }
});

// Toggle profile dropdown visibility (mobile)
let profileDropdownMobile = $('#navbar-profile-dropdown')[0];
let profileModalMobile = document.getElementById('profile-modal-mobile');
profileDropdownMobile.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    if (profileModalMobile.style.display === 'none' || profileModalMobile.style.display === '') {
        profileModalMobile.style.display = 'block';
        profileModalMobile.style.visibility = 'visible';
        profileModalMobile.style.opacity = '1';
    }
});

// Close all modals when clicking outside, but allow link navigation
$('body').on('click', function (event) {
    let $target = $(event.target);

    // Check if the click is inside a modal or on a link
    let isInsideModal = $target.closest('#browse-modal, #write-modal, #profile-modal-desktop, #profile-modal-mobile').length > 0;
    let isLinkClick = $target.is('a') || $target.closest('a').length > 0;

    if (!isInsideModal && !isLinkClick) {
        browseModal.style.display = 'none';
        browseModal.style.visibility = 'hidden';
        browseModal.style.opacity = '0';
        writeModal.style.display = 'none';
        writeModal.style.visibility = 'hidden';
        writeModal.style.opacity = '0';
        profileModalDesktop.style.display = 'none';
        profileModalDesktop.style.visibility = 'hidden';
        profileModalDesktop.style.opacity = '0';
        profileModalMobile.style.display = 'none';
        profileModalMobile.style.visibility = 'hidden';
        profileModalMobile.style.opacity = '0';
    }
});

// Ensure links inside modals navigate properly
$('#browse-modal a, #write-modal a, #profile-modal-desktop a, #profile-modal-mobile a').on('click', function (event) {
    event.stopPropagation(); // Prevent the click from closing the modal immediately
    // Navigation will occur naturally due to the href attribute
});


function headerData() {

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

            if(currentUser.profilePicPath!=null){
                $('.user-profile-pic').attr('src',`${currentUser.profilePicPath}`);
            }
            else{
                $('.user-profile-pic').attr('src',`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnFRPx77U9mERU_T1zyHcz9BOxbDQrL4Dvtg&s`);
            }
            $('.your-profile').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${currentUser.id}`);

            if(currentUser.isUserPremium===1){
                $('#premium-member').css('display','flex');
                $('#try-premium-btn').css('display','none');
            }
            else{
                $('#premium-member').css('display','none');
                $('#try-premium-btn').css('display','flex');
            }

        })
        .catch(error => {
            console.error('Fetch error:', error.message);
            let response = JSON.parse(error.message);
        });
}
headerData();



let logOut = $('.logout')[0];
logOut.addEventListener('click', function (event) {
    event.preventDefault();

    fetch('http://localhost:8080/auth/logout', {
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
            console.log('POST Data:', data);

            window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/login-page.html';

        })
        .catch(error => {
            console.error('Fetch error:', error.message);
            let response = JSON.parse(error.message);
        });

});



let search = $('.search')[0];
search.addEventListener('click',function (event) {

    window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search.html';
});



let tryPremiumBtn = $('#try-premium-btn')[0];
tryPremiumBtn.addEventListener('click',function (event) {

    window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/premium-page.html';
});