//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/notification', {
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




//load all announcements from backend
async function loadAnnouncements() {

    await fetch('http://localhost:8080/api/v1/notification/all/currentUser', {
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

            $('#scroll-div').empty();

            for (let i = 0; i < data.data.length; i++) {

                let announcement = data.data[i];

                let singleAnnouncement = `
                <!--single notification-->
                <div class="fLTjc transparent-button Wx2aQ vdMYU">
                    <a aria-label="" class="AIZN6 transparent-button" href="">
                        <img src="https://ma.wattpad.com/firebase_in-app_512x512.jpg" aria-hidden="true" alt="" class="pTyGP"/>
                    </a>
                    <a href="" class="_1icRF">
                        <div class="w7tm6">
                            <div class="doBW9">
                                <div>
                                    <b>${announcement.title}</b>
                                    <br>${announcement.description}
                                </div>
                            </div>
                            <div class="n32iW">
                                <div class="uBCcp">
                                    <img src="assets/image/megaphone_grey.png" width="17" height="11"/>
                                </div>
                                <div>${announcement.dateTime}</div>
                            </div>
                        </div>
                    </a>
                </div>`;

                $('#scroll-div').append(singleAnnouncement);
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

loadAnnouncements();










