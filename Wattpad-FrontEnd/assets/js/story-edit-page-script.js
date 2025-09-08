//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/story', {
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

            if (params.has("storyId")) {

                let storyId = params.get("storyId");

                fetch('http://localhost:8080/api/v1/story/isCurrentUser/'+storyId, {
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

                        if(data.data===true){
                            document.body.style.display = 'block';
                            document.body.style.visibility = 'visible';
                            document.body.style.opacity = 1;
                        }
                        else {
                            //set alert saying you have no access to this
                            window.location.href = 'home-page.html';
                        }

                    })
                    .catch(error => {
                        let response = JSON.parse(error.message);
                        console.log(response);

                    });
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




//load all chapters
async function loadAllChapters() {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if(storyId==null){
        //load story not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/story/chapters/'+storyId, {
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

            // $('.all-stories-tab').addClass('active');
            // $('.published-stories-tab').removeClass('active');
            //
            // $('.works-item-new.drag-item').empty();
            // for (let i = 0; i < data.data.length; i++) {
            //
            //     let story = data.data[i];
            //
            //     let singleStory = ``;
            //
            //     $('.works-item-new.drag-item').append(singleStory);
            // }

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
    await loadAllChapters();

}

run();











