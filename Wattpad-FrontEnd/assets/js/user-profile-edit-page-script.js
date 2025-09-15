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




//load user data
async function loadUserData() {
    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/user/' + userId, {
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

            // Full Name
            if (user.fullName) {
                document.querySelector('#fullname').value = user.fullName;
            }

            // Location
            if (user.location) {
                document.querySelector('#update-location').value = user.location;
            }

            // About / Description
            if (user.about) {
                document.querySelector('#update-description').value = user.about;
            }

            // Pronouns (select dropdown)
            if (user.pronouns) {
                let pronounSelect = document.querySelector('#update-gender');
                if (pronounSelect) {
                    pronounSelect.value = user.pronouns;
                }
            }

            // Website
            if (user.websiteLink) {
                document.querySelector('#update-website').value = user.websiteLink;
            }

            // Facebook
            if (user.facebookLink) {
                document.querySelector('#update-facebook').value = user.facebookLink;
            }

            // Profile Pic
            if (user.profilePicPath) {
                document.querySelector('#profile-pic').src = `${user.profilePicPath}`;
            }

            // Cover Pic
            if (user.coverPicPath) {
                document.querySelector('.background').src = `${user.coverPicPath}`;
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



let profilePicChanged = false;
let profilePicFile = null;

let coverChanged = false;
let coverFile = null;

const profilePicImg = document.querySelector('#profile-pic');
const coverImg = document.querySelector('.background');
const defaultCover = "http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/default-cover.png";

document.addEventListener('DOMContentLoaded', function() {
    // Profile picture edit functionality
    const profilePicInput = document.querySelector('.pic-edit input[type="file"]');
    const profilePicImg = document.getElementById('profile-pic');

    if (profilePicInput && profilePicImg) {
        profilePicInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (file.type.startsWith('image/')) {
                    profilePicChanged = true;
                    profilePicFile = file;
                    // Create object URL for the selected image
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        profilePicImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select a valid image file.');
                }
            }
        });
    }

    // Cover image edit functionality
    const coverInput = document.querySelector('.cover-edit input[type="file"]');
    const coverImg = document.querySelector('.cover-image.background');

    if (coverInput && coverImg) {
        coverInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                // Validate file type
                if (file.type.startsWith('image/')) {
                    coverChanged = true;
                    coverFile = file;
                    // Create object URL for the selected image
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        coverImg.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select a valid image file.');
                }
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        //load chapter not found page
        return;
    }

    // --- CONFIG ---
    const IMGBB_KEY = '50b3e812e73f116edbb14b35639f9725'; // replace with your key if different
    const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`;

    // Default cover image URL (treat as "no cover set")
    const DEFAULT_COVER_SRC = 'https://w0.peakpx.com/wallpaper/410/412/HD-wallpaper-plain-black-black.jpg';

    // --- ELEMENTS ---
    const profilePicImg = document.getElementById('profile-pic'); // <img id="profile-pic">
    const coverImg = document.querySelector('.cover-image.background') || document.querySelector('.background') || document.querySelector('.cover-image');

    const profilePicInput = document.querySelector('.pic-edit input[type="file"]');
    const coverInput = document.querySelector('.cover-edit input[type="file"]');

    const saveButton = document.querySelector('.on-edit-save');
    const cancelButton = document.querySelector('.on-edit-cancel');

    // --- STATE ---
    const initialProfileSrc = profilePicImg ? profilePicImg.src : null;
    const initialCoverSrc = coverImg ? coverImg.src : null;

    let profilePicChanged = false;
    let profilePicFile = null;

    let coverChanged = false;
    let coverFile = null;

    // --- HELPERS ---
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = () => reject(new Error('File read error'));
            r.readAsDataURL(file);
        });
    }

    async function uploadToImgbb(file) {
        const dataUrl = await readFileAsDataURL(file);
        const base64 = dataUrl.split(',')[1];

        const res = await fetch(IMGBB_UPLOAD_URL, {
            method: 'POST',
            body: new URLSearchParams({ image: base64 })
        });

        const json = await res.json();
        if (!json || !json.success || !json.data || !json.data.url) {
            throw new Error('ImgBB upload failed');
        }
        return json.data.url; // full imgbb URL
    }

    function safeSrc(el) {
        return el && el.src ? el.src : null;
    }

    // --- PREVIEW LISTENERS (set changed flags + preview) ---
    if (profilePicInput && profilePicImg) {
        profilePicInput.addEventListener('change', (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            if (!f.type.startsWith('image/')) {
                Swal.fire('Error', 'Please select an image file for profile picture.', 'error');
                return;
            }
            profilePicFile = f;
            profilePicChanged = true;
            readFileAsDataURL(f).then(dataUrl => {
                profilePicImg.src = dataUrl;
            }).catch(() => {
                Swal.fire('Error', 'Failed to preview profile image.', 'error');
            });
        });
    }

    if (coverInput && coverImg) {
        coverInput.addEventListener('change', (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            if (!f.type.startsWith('image/')) {
                Swal.fire('Error', 'Please select an image file for cover.', 'error');
                return;
            }
            coverFile = f;
            coverChanged = true;
            readFileAsDataURL(f).then(dataUrl => {
                coverImg.src = dataUrl;
            }).catch(() => {
                Swal.fire('Error', 'Failed to preview cover image.', 'error');
            });
        });
    }

    // --- SAVE LOGIC ---
    if (saveButton) {
        saveButton.addEventListener('click', async function () {
            try {
                // Collect text fields
                const fullName = (document.getElementById('fullname')?.value || '').trim();
                const pronouns = (document.getElementById('update-gender')?.value || '').trim();
                const description = (document.getElementById('update-description')?.value || '').trim();
                const website = (document.getElementById('update-website')?.value || '').trim();
                const location = (document.getElementById('update-location')?.value || '').trim();

                // Prepare image paths to send
                let profilePicPathToSend = null;
                let coverPicPathToSend = null;

                // 1) PROFILE PIC
                if (profilePicChanged && profilePicFile) {
                    // Upload new file first, wait for URL
                    saveButton.disabled = true;
                    saveButton.textContent = 'Uploading profile image...';
                    try {
                        const url = await uploadToImgbb(profilePicFile);
                        profilePicPathToSend = url;
                    } catch (err) {
                        saveButton.disabled = false;
                        saveButton.textContent = 'Save Changes';
                        Swal.fire('Error', 'Uploading profile image failed. Try again.', 'error');
                        return;
                    }
                } else {
                    // Not changed → use existing src URL if exists, null if no initial image
                    profilePicPathToSend = safeSrc(profilePicImg) || null;
                }

                // 2) COVER PIC
                if (coverChanged && coverFile) {
                    saveButton.disabled = true;
                    saveButton.textContent = 'Uploading cover image...';
                    try {
                        const url = await uploadToImgbb(coverFile);
                        coverPicPathToSend = url;
                    } catch (err) {
                        saveButton.disabled = false;
                        saveButton.textContent = 'Save Changes';
                        Swal.fire('Error', 'Uploading cover image failed. Try again.', 'error');
                        return;
                    }
                } else {
                    // Not changed → use existing src URL if exists and not default, null if default or no image
                    const currentCoverSrc = safeSrc(coverImg) || initialCoverSrc;
                    coverPicPathToSend = (currentCoverSrc && currentCoverSrc !== DEFAULT_COVER_SRC) ? currentCoverSrc : null;
                }

                // Build payload
                const payload = {
                    id: userId,
                    fullName,
                    pronouns,
                    about: description,
                    websiteLink: website,
                    location,
                    profilePicPath: profilePicPathToSend,
                    coverPicPath: coverPicPathToSend
                };

                console.log(payload);

                // Send final update to backend
                saveButton.disabled = true;
                saveButton.textContent = 'Saving...';
                const resp = await fetch('http://localhost:8080/user', {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const json = await resp.json();
                if (!resp.ok) {
                    throw new Error(JSON.stringify(json));
                }

                Swal.fire('Success', 'Profile updated successfully!', 'success')
                    .then(() => {
                        // window.location.reload();
                        saveButton.disabled = false;
                        saveButton.textContent = 'Save Changes';
                    });
            } catch (err) {
                console.error(err);
                try {
                    const parsed = typeof err.message === 'string' ? JSON.parse(err.message) : null;
                    Swal.fire('Error', parsed?.message || 'Failed to update profile', 'error');
                } catch (e) {
                    Swal.fire('Error', 'Failed to update profile', 'error');
                } finally {
                    if (saveButton) {
                        saveButton.disabled = false;
                        saveButton.textContent = 'Save Changes';
                    }
                }
            }
        });
    }

    // --- CANCEL BUTTON ---
    if (cancelButton) {
        cancelButton.addEventListener('click', (e) => {
            let userId = null;
            const params = new URLSearchParams(window.location.search);

            if (params.has("userId")) {
                userId = params.get("userId");
            }

            if(userId==null){
                //load chapter not found page
                return;
            }

            window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${userId}`;
        });
    }
});













