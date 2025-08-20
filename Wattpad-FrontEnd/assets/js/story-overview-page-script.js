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




//load story data and set it to a page
async function loadStoryData() {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if(storyId==null){
        //load story not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/story/'+storyId, {
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

            //story cover and title
            $('#story-cover-image').attr('src', `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${story.coverImagePath}`);
            $('#story-title').text(story.title);

            //stats
            $('#reads-stats').text(story.views);
            $('#votes-stats').text(story.likes);
            $('#parts-stats').text(story.parts);

            //author
            $('#author-profile-image').attr('src', `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${story.profilePicPath}`);
            $('#author-profile-link').attr('href', `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${story.userId}`);
            $('#author-profile-link').text(story.username);

            $('#badge-box').empty();
            if(story.status==1){
                let completeBadge = `
                <div class="_2-rOR">
                    <div class="pill__pziVI solid-variant__RGER9 default-size__BJ5Po base-3-accent__Xrbrb square-shape__V66Yy gap-for-default-pill__d6nVx">
                        <span class="typography-label-small-semi">Complete</span>
                    </div>
                </div>`;

                $('#badge-box').append(completeBadge);
            }

            if(story.rating==1){
                let matureBadge = `
                <div class="_2-rOR OPdNU" style=" margin-left: 7px;">
                    <div class="pill__pziVI solid-variant__RGER9 default-size__BJ5Po base-4-accent__JqbdI square-shape__V66Yy gap-for-default-pill__d6nVx">
                        <span class="typography-label-small-semi" style="color: white;">Mature</span>
                    </div>
                </div>`;

                $('#badge-box').append(matureBadge);
            }

            $('#description').text(story.description);
            $('#copyright').text(story.copyright);

            $('#tags-box').empty();
            for (let i = 0; i < story.tags.length; i++) {
                let t = story.tags[i];
                let tag = `<a class="no-text-decoration-on-focus no-text-decoration-on-hover _76mBx pill__pziVI default-variant__ERiYv default-size__BJ5Po default-accent__YcamO round-shape__sOoT2 clickable__llABU gap-for-default-pill__d6nVx" href="https://www.wattpad.com/stories/angst">
                                    <span class="typography-label-small-semi">${t}</span>
                                  </a>`;

                $('#tags-box').append(tag);
            }

            $('#chapter-box').empty();
            for (let i = 0; i < story.chapterSimpleDTOList.length; i++) {

                let c = story.chapterSimpleDTOList[i];

                let chapter = `
            <li class="">
                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${c.id}" class="_6qJpE">
                  <div class="vbUDq">
                    <div class="o7jpT">
                      <div class="a2GDZ" data-testid="new-part-icon"></div>
                      <div class="wpYp-">${c.title}</div>
                    </div>
                    <div class="f0I9e"></div>
                  </div>
                  <div class="bSGSB">${c.publishedDate}</div>
                </a>
            </li>`;

                $('#chapter-box').append(chapter);
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

loadStoryData();


























