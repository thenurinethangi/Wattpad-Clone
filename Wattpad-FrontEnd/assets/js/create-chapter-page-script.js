//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/chapter', {
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




//load story details
async function loadStoryDetails() {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if(storyId==null){
        //load chapter not found page
        return;
    }

    console.log(storyId)

    await fetch('http://localhost:8080/api/v1/story/get/'+storyId, {
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

            let story = data.data;

            $('.story-cover').find('img').attr('scr',`http://localhost:8080/assets/image/${story.coverImagePath}`);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
}
loadStoryDetails();





















