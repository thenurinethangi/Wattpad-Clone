//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/user/block', {
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




//load all blocked users
async function loadAllBlockedUsers() {

    await fetch('http://localhost:8080/api/v1/user/block/all', {
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

            $('.user-list').empty();

            for (let i = 0; i < data.data.length; i++) {

                let user = data.data[i];

                let singleUser = ` <!--single reported user-->
                                    <li class="muted-user">
                                        <!--user image-->
                                        <img src="${user.profilePicPath}" alt="user avatar" align="top" width="64" height="64">
                                        <!--user name-->
                                        <div class="username-wrapper">
                                            <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${user.id}" class="user-profile on-navigate" title="Sillybuttercup">${user.username}</a>
                                        </div>
                                        <!--3 dots btn-->
                                        <div class="button-group inline-block relative ">
                                            <button class="btn btn-white dropdown-toggle more-options unmute-button" data-toggle="dropdown" aria-controls="more-options" aria-expanded="false" aria-label="more options">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class=""><g><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></g></svg>
                                            </button>
                                            <div class="triangle"></div>
                                            <!--when 3 dot click this must show-->
                                            <!--style="display: flex; opacity: 1; visibility: visible;"-->
                                            <div class="dropdown-menu align-right">
                                                <div class="user-safety-operations" style="width: 70px; height: 90px;">
                                                    <button style="transform: translateX(-130px) translateY(-25px); text-decoration: none;" data-user-id="${user.id}" class="user-safety-operation btn-no-background btn-left-icon unmute">
<!--                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class=""><g><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></g></svg>-->
                                                        Unblock Sillybuttercup
                                                    </button>
                                                    <button style="transform: translateX(-130px) translateY(-70px); text-decoration: none;" data-user-id="${user.id}" class="on-report user-safety-operation btn-no-background btn-left-icon" data-username="Sillybuttercup">
<!--                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class=""><g><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></g></svg>-->
                                                        Report
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>`;

                $('.user-list').append(singleUser);
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
    await loadAllBlockedUsers();

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




// delegate since buttons are added dynamically
$(document).on('click', '.dropdown-toggle', function (e) {
    e.preventDefault();
    e.stopPropagation();

    // find the nearest dropdown menu inside the same button-group
    let $dropdown = $(this).closest('.button-group').find('.dropdown-menu');

    // hide all other open dropdowns first
    $('.dropdown-menu').css({
        display: 'none',
        visibility: 'hidden',
        opacity: '0'
    });

    // toggle the clicked one
    if ($dropdown.css('display') === 'none') {
        $dropdown.css({
            display: 'flex',
            visibility: 'visible',
            opacity: '1'
        });
    } else {
        $dropdown.css({
            display: 'none',
            visibility: 'hidden',
            opacity: '0'
        });
    }
});

// close dropdown if click outside
$(document).on('click', function () {
    $('.dropdown-menu').css({
        display: 'none',
        visibility: 'hidden',
        opacity: '0'
    });
});




// Unmute button click
$(document).on('click', '.unmute', function () {

    let userId = $(this).data('user-id');

    Swal.fire({
        title: 'Are you sure?',
        text: 'Would you like to unblock this user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, unmute',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'modern-swal',
            confirmButton: 'swal2-confirm',
            cancelButton: 'swal2-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(`http://localhost:8080/api/v1/user/block/remove/${userId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(errData => { throw new Error(JSON.stringify(errData)); });
                    }
                    return response.json();

                })
                .then(data => {
                    console.log("Unblock successfully:", data);
                    loadAllBlockedUsers();

                    Swal.fire({
                        title: 'Success',
                        text: 'Unblock user successfully!',
                        icon: 'success',
                        timer: 3000,
                        showConfirmButton: false
                    });

                })
                .catch(error => {
                    let response = JSON.parse(error.message);
                    console.log(response);

                    Swal.fire({
                        title: 'Fail',
                        text: 'An error occur while unblocking the user, try later!',
                        icon: 'error',
                        timer: 3000,
                        showConfirmButton: false
                    });
                });
        }
        else {
            // console.log('still activate');
        }
    });
});





// Report button click
$(document).on('click', '.on-report', function () {

    let userId = $(this).data('user-id');
    openUserReport(userId);
});



let reportedUserId = null;
let userSelectedCategory = null;
let userSelectedSubReason = null;

// Step 2: Load sub-options
function loadUserSubOptions(type) {
    userSelectedCategory = type;
    const content = document.getElementById("userReportContent");
    let html = "";

    if (type === "harassment") {
        html = `
      <h6>What type of harassment?</h6>
      ${buildUserOption("Bullying", "This includes direct harassment, insults, or threats.")}
      ${buildUserOption("Hate Speech", "Targeting people based on race, gender, orientation, etc.")}
    `;
    } else if (type === "spam") {
        html = `
      <h6>What kind of spam?</h6>
      ${buildUserOption("Unwanted Ads", "Promotions unrelated to Wattpad.")}
      ${buildUserOption("Mass Messaging", "Sending repetitive or irrelevant messages.")}
    `;
    } else if (type === "impersonation") {
        html = `
      <h6>What kind of impersonation?</h6>
      ${buildUserOption("Pretending to be me", "This user is impersonating my account.")}
      ${buildUserOption("Pretending to be someone else", "This user is impersonating another person or entity.")}
    `;
    }

    content.innerHTML = html;
}

// Helper to build sub-option
function buildUserOption(title, desc) {
    return `
    <div onclick="selectUserSubReason('${title}')" 
      style="border:1px solid #ddd; padding:10px; margin-bottom:10px; border-radius:6px; cursor:pointer;">
      <strong>${title}</strong>
      <p style="margin:5px 0 0; font-size:13px; color:#555;">${desc}</p>
    </div>
  `;
}

// Step 3: Select sub-reason
function selectUserSubReason(reason) {
    userSelectedSubReason = reason;
    document.getElementById("userReportFooter").style.display = "block";
}

// Step 4: Submit report
function submitUserReport() {
    const description = document.getElementById("userExtraReason").value.trim();
    if (!userSelectedSubReason) {
        alert("Please select a reason.");
        return;
    }
    if (!description) {
        alert("Please add details.");
        return;
    }

    fetch('http://localhost:8080/api/v1/user/report', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: reportedUserId,
            category: userSelectedCategory,
            reason: userSelectedSubReason,
            description: description
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => { throw new Error(JSON.stringify(errData)); });
            }
            return response.json();
        })
        .then(data => {
            closeUserReport();
            Swal.fire({
                title: 'Success',
                text: 'Reported user successfully!',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false
            });
        })
        .catch(() => {
            Swal.fire({
                title: 'Failed',
                text: 'Could not submit report. Try later.',
                icon: 'error',
                timer: 3000,
                showConfirmButton: false
            });
        });
}

// Close modal
function closeUserReport() {
    document.getElementById("userReportModal").style.display = "none";
}

// Open modal (when clicking "Report" in dropdown)
function openUserReport(userId) {
    reportedUserId = userId;
    document.getElementById("userReportModal").style.display = "flex";
}

// Close when clicking outside modal
window.addEventListener("click", (event) => {
    const modal = document.getElementById("userReportModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});












