//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/library', {
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




//load library stories from backend
async function loadLibraryStories() {

    await fetch('http://localhost:8080/api/v1/library/stories', {
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

            let libraryStories = data.data;
            $('#library-story-container').empty();

            if(libraryStories.length<=0){
                return;
            }

            for (let i = 0; i < libraryStories.length; i++) {

                let story = libraryStories[i];

                let singleLibraryStory = `
        <!--single library story-->
        <div class="hBlTa">
            <div class="libraryStoryCard__y5_Fe">
                <div class="libraryStoryItem__Yxev4">
                    <div class="libraryCover__zF7AM coverWrapper__t2Ve8">
                        <img class="cover__BlyZa" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${story.storyCoverImagePath}" alt="storyCover"/>
                    </div>
                    <div class="SMOJH" style="visibility: hidden; opacity: 0;">
                        <div class="_3mT2V"></div>
                        <div class="oHIU7">
                            <button class="_0OiLI delete-btn" data-story-id="${story.storyId}">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ds-neutral-00)" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round"><g><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></g></svg>
                            </button>
                        </div>
                        <div class="_3CmAp">
                            <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${story.lastOpenedChapterId}">
                                <button class="skvBl">Start Reading</button>
                            </a>
                            <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}">
                                <button class="skvBl">Details</button>
                            </a>
                            <button class="skvBl">Archive</button>
                            <button class="skvBl">Add to List</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="progress_bar__ja0_4" style="width:100%;height:8px" role="progressbar">
                        <div class="progress_bar_value__rnwN9 primary__efugz" style="width: ${(story.lastOpenedChapterSequenceNo / story.totalParts) * 100}%"></div>
                        <div class="progress_bar_value__rnwN9 default__sk_o3" style="width:100%"></div>
                        <div class="progress_bar_value__rnwN9 success__BzCzJ" style="width:0%"></div>
                    </div>
                    <p hidden="">progress-bar-label-180595293</p>
                </div>
                <div class="authorWrapper__u0RFS">
                    <div class="authorSection__GVjjz">
                        <strong>${story.storyTitle}</strong>
                        <small>${story.username}</small>
                    </div>
                    <div>
                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${story.userId}" aria-label="">
                            <img src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${story.userProfilePicPath}" aria-hidden="true" alt="" class="avatar__Ygp0_ avatar_sm__zq5iO"/>
                        </a>
                    </div>
                </div>
                <div class="statsWrapper__DqAW0">
                    <span class="stats_wrapper__THA2S">
                        <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpView</title><path d="M1.82 10.357c-.353.545-.594.975-.723 1.233a.916.916 0 0 0 0 .82c.129.258.37.688.723 1.233a18.78 18.78 0 0 0 2.063 2.65C6.19 18.754 8.902 20.25 12 20.25c3.098 0 5.81-1.497 8.117-3.956a18.784 18.784 0 0 0 2.063-2.65c.352-.546.594-.976.723-1.234a.916.916 0 0 0 0-.82c-.129-.258-.37-.688-.723-1.233a18.786 18.786 0 0 0-2.063-2.65C17.81 5.246 15.098 3.75 12 3.75c-3.098 0-5.81 1.496-8.117 3.956a18.782 18.782 0 0 0-2.063 2.65Zm3.4 4.683A16.969 16.969 0 0 1 2.963 12a16.97 16.97 0 0 1 2.259-3.04C7.21 6.837 9.484 5.585 12 5.585c2.517 0 4.788 1.253 6.78 3.377A16.973 16.973 0 0 1 21.037 12a16.97 16.97 0 0 1-2.259 3.04c-1.99 2.122-4.262 3.376-6.779 3.376-2.516 0-4.788-1.254-6.78-3.377Z" fill="#121212"></path><path d="M8.333 12a3.667 3.667 0 1 0 7.334 0 3.667 3.667 0 0 0-7.334 0Zm5.5 0a1.833 1.833 0 1 1-3.666 0 1.833 1.833 0 0 1 3.666 0Z" fill="#121212"></path></svg>
                        <span class="stats-label__text__VzfuV" aria-hidden="true">${story.views}</span>
                    </span>
                    <span class="stats_wrapper__THA2S">
                        <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpVote</title><path d="M9.807 8.703a1 1 0 0 1-.752.547l-4.907.717 3.55 3.457a1 1 0 0 1 .288.885l-.838 4.883 4.386-2.307a1 1 0 0 1 .931 0l4.387 2.307-.838-4.883a1 1 0 0 1 .288-.885l3.55-3.457-4.907-.717a1 1 0 0 1-.752-.547L12 4.259 9.807 8.703ZM8.246 7.347l2.857-5.79a1 1 0 0 1 1.794 0l2.857 5.79 6.39.934a1 1 0 0 1 .554 1.705l-4.624 4.503 1.091 6.362a1 1 0 0 1-1.45 1.054L12 18.9l-5.715 3.005a1 1 0 0 1-1.45-1.054l1.09-6.361-4.623-4.504a1 1 0 0 1 .553-1.705l6.39-.934Z" fill="#121212"></path></svg>
                        <span class="stats-label__text__VzfuV" aria-hidden="true">${story.likes}</span>
                    </span>
                </div>
            </div>
        </div>`

                $('#library-story-container').append(singleLibraryStory);
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

loadLibraryStories();



//when hover over a story show the options box
$(document).on('mouseenter', '.libraryStoryItem__Yxev4', function (event) {

    let child = $(this).find('.SMOJH');
    child.css('visibility','visible');
    child.css('opacity',1);

});



//when hover over a story hide the options box
$(document).on('mouseleave', '.libraryStoryItem__Yxev4', function (event) {

    let child = $(this).find('.SMOJH');
    child.css('visibility','hidden');
    child.css('opacity',0);
});



//delete story
$(document).on('click', '.delete-btn', function (event) {

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to remove this story for your library?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {

            let storyId = $(this).data('story-id');

            fetch('http://localhost:8080/api/v1/library/'+storyId, {
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

                    loadLibraryStories();

                })
                .catch(error => {
                    let response = JSON.parse(error.message);
                    console.log(response);
                });

        } else if (result.dismiss === Swal.DismissReason.cancel) {
            console.log("Cancelled!");
        }
    });

});















