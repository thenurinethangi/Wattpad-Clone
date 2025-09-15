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
            $('#story-cover-image').attr('src', `${story.coverImagePath}`);
            $('#story-title').text(story.title);

            //stats
            $('#reads-stats').text(story.views);
            $('#votes-stats').text(story.likes);
            $('#parts-stats').text(story.parts);

            //author
            $('#author-profile-image').attr('src', `${story.profilePicPath}`);
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
                let tag = `<a class="no-text-decoration-on-focus no-text-decoration-on-hover _76mBx pill__pziVI default-variant__ERiYv default-size__BJ5Po default-accent__YcamO round-shape__sOoT2 clickable__llABU gap-for-default-pill__d6nVx" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/tag-stories-page.html?tag=${t}">
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



//click on start reading btn
let startReadingBtn = $('.start-reading')[0];
startReadingBtn.addEventListener('click',async function (event) {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if (storyId == null) {
        //load story not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/story/' + storyId, {
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

            if(story.chapterSimpleDTOList.length<=0){
                return;
            }
            window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${story.chapterSimpleDTOList[0].id}`

        })
        .catch(error => {
            try {
                let errorResponse = JSON.parse(error.message);
                console.error('Error:', errorResponse);
            } catch (e) {
                console.error('Error:', error.message);
            }
        });
});




// Load "My Library"
function loadLibrary($dropdown, storyId) {
    return fetch('http://localhost:8080/api/v1/library/check/story/byStoryId/' + storyId, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
            const $ul = $dropdown.find('.lists-menu');
            $ul.find('li[data-list-id="0"]').remove();

            const isInLibrary = data.data;
            $ul.prepend(`
                <li data-list-id="0" style="width: 100%; padding-right: 5px; cursor: pointer;">
                  <a class="on-modify-list my-library" data-list-id="0" style="display: flex; justify-content: space-between; align-items: center; width: 100%">
                    <span class="reading-list-name" style="font-size: 14px; color: #222222;">My Library (Private)</span>
                    ${isInLibrary
                ? `<div class="status" style="">
                      <i class="fa-regular fa-circle-check" style="color: #00b2b2; font-size: 17px;"></i>
                   </div>`
                : `<div class="status" style="transform: translateX(0);"></div>`
                }
                  </a>
                </li>
            `);
        })
        .catch(error => {
            console.error('Error loading library:', error);
        });
}

// Add/Remove story from library
$(document).on('click', '.my-library', function (event) {
    event.preventDefault();
    event.stopPropagation();

    let storyId = new URLSearchParams(window.location.search).get("storyId");
    if (!storyId) {
        console.error('Story ID not found');
        return;
    }

    fetch('http://localhost:8080/api/v1/library/add/remove/story/byStory/' + storyId, {
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
            console.log('Success:', data);
            const $dropdown = $(this).closest('.vDQzQ.pgq4C.Imgyz');
            refreshLists($dropdown, storyId);
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
});

// Load all reading lists
function loadReadingLists($dropdown, storyId) {
    return fetch('http://localhost:8080/api/v1/readingList/all/check/story/byStoryId/' + storyId, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
            const $ul = $dropdown.find('.lists-menu');
            $ul.find('li[data-list-id!="0"]').remove();

            data.data.forEach(list => {
                $ul.append(`
                    <li data-list-id="${list.readingListId}" style="width: 100%; padding-right: 5px; cursor: pointer;">
                      <a class="on-modify-list my-list" data-list-id="${list.readingListId}" style="display: flex; justify-content: space-between; align-items: center; width: 100%">
                        <span class="reading-list-name" style="font-size: 14px; color: #222222;">${list.listName}</span>
                        ${list.isStoryExit === 1
                    ? `<div class="status" style="">
                         <i class="fa-regular fa-circle-check" style="color: #00b2b2; font-size: 17px;"></i>
                       </div>`
                    : `<div class="status" style="transform: translateX(0);"></div>`
                    }
                      </a>
                    </li>
                `);
            });
        })
        .catch(error => {
            console.error('Error loading reading lists:', error);
        });
}

// Add/Remove story from reading list
$(document).on('click', '.my-list', function (event) {
    event.preventDefault();
    event.stopPropagation();

    let storyId = new URLSearchParams(window.location.search).get("storyId");
    if (!storyId) {
        console.error('Story ID not found');
        return;
    }

    let listId = $(this).data('list-id');
    console.log('Adding/Removing from list ID:', listId, 'Story ID:', storyId);

    fetch('http://localhost:8080/api/v1/readingList/add/remove/story/byStory/' + listId + '/' + storyId, {
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
            console.log('Success:', data);
            const $dropdown = $(this).closest('.vDQzQ.pgq4C.Imgyz');
            refreshLists($dropdown, storyId);
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
});

// Wrapper to refresh both Library + Reading Lists
function refreshLists($dropdown, storyId) {
    return Promise.all([
        loadLibrary($dropdown, storyId),
        loadReadingLists($dropdown, storyId)
    ]);
}

// Open dropdown (modal) when clicking the button
$(document).on('click', '.add-lb-rl', function (e) {
    e.preventDefault();
    e.stopPropagation();

    let storyId = new URLSearchParams(window.location.search).get("storyId");
    if (!storyId) {
        console.error('Story ID not found in URL');
        return;
    }

    const $modal = $('.vDQzQ.pgq4C.Imgyz'); // Target the modal by its classes
    if ($modal.length === 0) {
        console.error('Modal not found in DOM. Check HTML structure:', $('body').html().substring(0, 200));
        return;
    }

    // Debug initial state
    console.log('Modal found, initial state:', {
        display: $modal.css('display'),
        visibility: $modal.css('visibility'),
        opacity: $modal.css('opacity')
    });

    // Reload lists each time before showing
    refreshLists($modal, storyId).then(() => {
        // Show the modal
        $modal.css({
            display: 'block',
            visibility: 'visible',
            opacity: 1
        });

        // console.log('Modal shown at:', { left: left + 'px', top: (rect.bottom + window.scrollY) + 'px' });
    }).catch(error => {
        console.error('Error refreshing lists:', error);
    });
});

// Close dropdown (modal) when clicking outside
$(document).on('click', function (e) {
    const $target = $(e.target);
    if (!$target.closest('.vDQzQ.pgq4C.Imgyz').length && !$target.closest('.add-lb-rl').length) {
        $('.vDQzQ.pgq4C.Imgyz').css({
            display: 'none',
            visibility: 'hidden',
            opacity: 0
        });
    }
});

// Create new reading list
$(document).on('click', '.on-create-list', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const listName = $('#new-reading-list').val().trim();
    if (!listName) {
        alert("Please enter a reading list name.");
        return;
    }

    fetch('http://localhost:8080/api/v1/readingList/create/new', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listName: listName })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(JSON.stringify(err));
                });
            }
            return response.json();
        })
        .then(data => {
            $('#new-reading-list').val('');

            if (data.data === false) {
                alert("Reading list with this name already exists, try another.");
            } else {
                let storyId = new URLSearchParams(window.location.search).get("storyId");
                const $dropdown = $('.vDQzQ.pgq4C.Imgyz');
                refreshLists($dropdown, storyId);
            }
        })
        .catch(error => {
            console.error("Error creating list:", error);
            alert("Failed to create reading list. Try again.");
        });
});





















