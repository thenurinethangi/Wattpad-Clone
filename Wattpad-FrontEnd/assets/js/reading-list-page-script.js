//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/readingList', {
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



//load all reading lists from backend
async function loadReadingLists() {

    await fetch('http://localhost:8080/api/v1/readingList/all', {
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

            let readingLists = data.data;

            $('#likedListCount').html( readingLists.likedReadingListCount + " lists"+`<span class="WXRkM"></span><svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpLock</title><path d="M6 10H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-1V7A6 6 0 0 0 6 7v3Zm2 0V7a4 4 0 1 1 8 0v3H8Zm11 2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h14Z" fill="#121212"></path></svg> `);

            $('#reading-list-container').empty();
            for (let i = 0; i < readingLists.singleReadingListDTOList.length; i++) {

                let singleReadingList = readingLists.singleReadingListDTOList[i];

                let list = `<!--a single reading list-->
                <li style="z-index:unset;transform:none">
                    <div class="_6cYXx" tabindex="0">
                        <!--a1 - burger icon -->
                        <div class="GsPGa" style="touch-action:none">
                            <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpDrag</title><path fill-rule="evenodd" clip-rule="evenodd" d="M27.8667 12.6668C27.8667 13.3295 27.3294 13.8668 26.6667 13.8668L5.33337 13.8668C4.67062 13.8668 4.13337 13.3295 4.13337 12.6668C4.13337 12.0041 4.67062 11.4668 5.33337 11.4668L26.6667 11.4668C27.3294 11.4668 27.8667 12.0041 27.8667 12.6668ZM27.8667 19.3335C27.8667 19.9962 27.3294 20.5335 26.6667 20.5335L5.33337 20.5335C4.67062 20.5335 4.13337 19.9962 4.13337 19.3335C4.13337 18.6707 4.67062 18.1335 5.33337 18.1335L26.6667 18.1335C27.3294 18.1335 27.8667 18.6707 27.8667 19.3335Z" fill="#121212"></path></svg>
                        </div>
                        <!--a2 - 3 story images in reading list -->
                        <div class="lxkLC">
                            <div class="aWUEw">
                                <div class="IAzmt MDIEi" style="row-gap:4px;column-gap:4px">
                                    <div class="D5ByT zv-c6">
                                        ${singleReadingList.threeStoriesCoverImagePath[0] === "wattpad-logo-white.svg"
                                        ? `<img class="FB8MI" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${singleReadingList.threeStoriesCoverImagePath[0]}" alt="Wattpad Logo"/>`
                                        : `<img style="width: 100%; height: 100%;" class="FB8MI" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${singleReadingList.threeStoriesCoverImagePath[0]}" alt="Wattpad Logo"/>`
                                        }
                                    </div>
                                    <div class="D5ByT dyxxG">
                                        ${singleReadingList.threeStoriesCoverImagePath[1] === "wattpad-logo-white.svg"
                                        ? `<img class="FB8MI" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${singleReadingList.threeStoriesCoverImagePath[1]}" alt="Wattpad Logo"/>`
                                        : `<img style="width: 100%; height: 100%;" class="FB8MI" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${singleReadingList.threeStoriesCoverImagePath[1]}" alt="Wattpad Logo"/>`
                                        }
                                    </div>
                                    <div class="D5ByT dyxxG">
                                        ${singleReadingList.threeStoriesCoverImagePath[2] === "wattpad-logo-white.svg"
                                        ? `<img class="FB8MI" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${singleReadingList.threeStoriesCoverImagePath[2]}" alt="Wattpad Logo"/>`
                                        : `<img style="width: 100%; height: 100%;" class="FB8MI" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${singleReadingList.threeStoriesCoverImagePath[2]}" alt="Wattpad Logo"/>`
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--a3 - reading list name and count of stories in the reading list -->
                        <div class="rII7T">
                            <div class="_5kbPA">
                                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/single-reading-list-page.html?readingListId=${singleReadingList.readingListId}">${singleReadingList.readingListName}</a>
                            </div>
                            <div class="L7Od7">${singleReadingList.storyCount+ ' stories'}</div>
                        </div>
                        <!--a4 - 3 dot icon -->
                        <div class="_6yJ1L">
                            <div id="reading-list-dropdown-1736461758" class="avnzx false undefined" data-testid="reading-list-dropdown-1736461758">
                                <button class="DMdhq _26YSH">
                                    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpMore</title><path d="M7 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm5 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="#121212"></path></svg>
                                </button>
                                <ul class="mMePQ _5GM2R" style="display: none; visibility: hidden; opacity: 0;">
                                    <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/reading-list-edit-page.html?readingListId=${singleReadingList.readingListId}">
                                        <li class="JCyh- _5FhKY">
                                            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpEdit</title><path d="m19.399 2.434-.207-.062-.21-.05a3.446 3.446 0 0 0-3.118.942l-12.15 12.15a.9.9 0 0 0-.232.4l-1.35 4.95a.9.9 0 0 0 1.105 1.104l4.95-1.35a.9.9 0 0 0 .4-.232l12.15-12.15a3.446 3.446 0 0 0-1.338-5.702Zm.065 4.43L7.483 18.844l-3.2.873.872-3.2 11.981-11.98a1.646 1.646 0 1 1 2.328 2.327Z" fill="#121212"></path></svg>
                                            <div class="zeRpI w347i">Edit</div>
                                        </li>
                                    </a>
                                    <li class="JCyh- _5FhKY delete-btn" data-reading-list-id="${singleReadingList.readingListId}">
                                        <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpDelete</title><path d="M7 5V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1h4a1 1 0 1 1 0 2h-1v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7H3a1 1 0 0 1 0-2h4Zm2.293-1.707A1 1 0 0 0 9 4v1h6V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-.707.293ZM6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7H6Z" fill="#121212"></path><path d="M10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1ZM14 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z" fill="#121212"></path></svg>
                                        <div class="zeRpI w347i">Delete</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>`;

                $('#reading-list-container').append(list);
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

loadReadingLists();



//when click on 3 dots button show the options
$(document).on('click', '.DMdhq', function (event) {

    let parent = $(this).parent();

    let child = parent.find('.mMePQ');
    child.css('display','block');
    child.css('visibility','visible');
    child.css('opacity',1);
});



//when click outside of the 3 dots and dropdown options dropdown hide
$(document).on('click', function (e) {
    if (!$(e.target).closest('.mMePQ, .DMdhq').length) {
        $('.mMePQ').css({
            'display': 'none',
            'visibility': 'hidden',
            'opacity': 0
        });
    }
});




//when click on 3 dots button show the options
$(document).on('click', '.delete-btn', function (event) {

    Swal.fire({
        title: 'Delete reading list?',
        text: "This action cannot be undone",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {

            let readingListId = $(this).data('reading-list-id');

            fetch('http://localhost:8080/api/v1/readingList/'+readingListId, {
                method: 'DELETE',
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

                    loadReadingLists();

                })
                .catch(error => {
                    let response = JSON.parse(error.message);
                    console.log(response);
                });

        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
            console.log("Cancelled!");
        }
    });
});
















