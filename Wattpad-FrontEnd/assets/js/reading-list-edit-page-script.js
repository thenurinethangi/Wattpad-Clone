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

            const params = new URLSearchParams(window.location.search);

            if (params.has("readingListId")) {
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




let storyDeleteQueue = [];
let allStories = null;
//load all stories in reading list from backend
async function loadAllStoriesInReadingList() {

    let readingListId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("readingListId")) {
        readingListId = params.get("readingListId");
    }

    if(readingListId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/readingList/single/'+readingListId, {
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

            let readingList = data.data;

            $('#reading-list-name').text(readingList.readingListName);
            $('#reading-list-name-input').attr('placeholder', readingList.readingListName);
            $('#reading-list-stories-container').empty();

            allStories = readingList.readingListEditStoryDTOList;
            let count = 0;
           L1: for (let i = 0; i < readingList.readingListEditStoryDTOList.length; i++) {

                let story = readingList.readingListEditStoryDTOList[i];

                for (let j = 0; j < storyDeleteQueue.length; j++) {
                    if(story.storyId===storyDeleteQueue[j]){
                        continue L1;
                    }
                }

                count++;

                let editStory = `<!--single story-->
                            <li style="z-index:unset;transform:none;">
                                <div class="_6cYXx" tabindex="0">
                                    <!--burger icon-->
                                    <div class="GsPGa" style="touch-action:none">
                                        <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpDrag</title><path fill-rule="evenodd" clip-rule="evenodd" d="M27.8667 12.6668C27.8667 13.3295 27.3294 13.8668 26.6667 13.8668L5.33337 13.8668C4.67062 13.8668 4.13337 13.3295 4.13337 12.6668C4.13337 12.0041 4.67062 11.4668 5.33337 11.4668L26.6667 11.4668C27.3294 11.4668 27.8667 12.0041 27.8667 12.6668ZM27.8667 19.3335C27.8667 19.9962 27.3294 20.5335 26.6667 20.5335L5.33337 20.5335C4.67062 20.5335 4.13337 19.9962 4.13337 19.3335C4.13337 18.6707 4.67062 18.1335 5.33337 18.1335L26.6667 18.1335C27.3294 18.1335 27.8667 18.6707 27.8667 19.3335Z" fill="#121212"></path></svg>
                                    </div>
                                    <!--story cover image-->
                                    <div class="lxkLC" style="width: 100px; height: 160px;">
                                        <img style="width: 100%; height: 100%;" src="${story.storyCoverImagePath}" alt=""/>
                                    </div>
                                    <!--story static,name,author-->
                                    <div class="rII7T pHl5J">
                                        <div class="_5kbPA">${story.storyTitle}</div>
                                        <div class="L7Od7">${story.username}</div>
                                        <div class="_1Ge0J">
                                            <ul class="n0iXe">
                                                <li class="_0jt-y ViutA">
                                                    <div class="uG9U1">
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"/></g></svg>
                                                    </div>
                                                    <span class="sr-only">Reads 1,541,675</span>
                                                    <div class="stats-value">
                                                        <div aria-hidden="true" data-testid="stats-value-container">
                                                            <span class="sr-only">1,541,675</span>
                                                            <span class="_5TZHL cBfL0" aria-hidden="true" data-testid="stats-value">${story.views}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="_0jt-y ViutA">
                                                    <div class="uG9U1">
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"/></g></svg>
                                                    </div>
                                                    <span class="sr-only">Votes 52,732</span>
                                                    <div class="stats-value">
                                                        <div aria-hidden="true" data-testid="stats-value-container">
                                                            <span class="sr-only">52,732</span>
                                                            <span class="_5TZHL cBfL0" aria-hidden="true" data-testid="stats-value">${story.likes}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li class="_0jt-y ViutA">
                                                    <div class="uG9U1">
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.33366 4.66634C3.70185 4.66634 4.00033 4.36786 4.00033 3.99967C4.00033 3.63148 3.70185 3.33301 3.33366 3.33301C2.96547 3.33301 2.66699 3.63148 2.66699 3.99967C2.66699 4.36786 2.96547 4.66634 3.33366 4.66634ZM4.00033 7.99967C4.00033 8.36786 3.70185 8.66634 3.33366 8.66634C2.96547 8.66634 2.66699 8.36786 2.66699 7.99967C2.66699 7.63148 2.96547 7.33301 3.33366 7.33301C3.70185 7.33301 4.00033 7.63148 4.00033 7.99967ZM4.00033 11.9997C4.00033 12.3679 3.70185 12.6663 3.33366 12.6663C2.96547 12.6663 2.66699 12.3679 2.66699 11.9997C2.66699 11.6315 2.96547 11.333 3.33366 11.333C3.70185 11.333 4.00033 11.6315 4.00033 11.9997ZM6.00033 7.99967C6.00033 8.36786 6.2988 8.66634 6.66699 8.66634H12.667C13.0352 8.66634 13.3337 8.36786 13.3337 7.99967C13.3337 7.63148 13.0352 7.33301 12.667 7.33301H6.66699C6.2988 7.33301 6.00033 7.63148 6.00033 7.99967ZM6.66699 12.6663C6.2988 12.6663 6.00033 12.3679 6.00033 11.9997C6.00033 11.6315 6.2988 11.333 6.66699 11.333H12.667C13.0352 11.333 13.3337 11.6315 13.3337 11.9997C13.3337 12.3679 13.0352 12.6663 12.667 12.6663H6.66699ZM6.00033 3.99967C6.00033 4.36786 6.2988 4.66634 6.66699 4.66634H12.667C13.0352 4.66634 13.3337 4.36786 13.3337 3.99967C13.3337 3.63148 13.0352 3.33301 12.667 3.33301H6.66699C6.2988 3.33301 6.00033 3.63148 6.00033 3.99967Z"/></g></svg>
                                                    </div>
                                                    <span class="sr-only">Parts 58</span>
                                                    <div class="stats-value">
                                                        <div aria-hidden="true" data-testid="stats-value-container">
                                                            <span class="sr-only">58</span>
                                                            <span class="_5TZHL cBfL0" aria-hidden="true" data-testid="stats-value">${story.parts} parts</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <!--delete icon-->
                                    <div class="_6yJ1L">
                                        <button data-story-id="${story.storyId}" class="delete-button button__Y70Pw tertiary-variant__Y9kWU default-accent__Pc0Pm medium-size__CLqD3 clickable__iYXtN with-padding__cVt72 icon-only__ImhHY">
                                            <span class="background-overlay__mCEaX"></span>
                                            <span class="icon__p6RRK">
                                                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpDelete</title><path d="M7 5V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1h4a1 1 0 1 1 0 2h-1v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7H3a1 1 0 0 1 0-2h4Zm2.293-1.707A1 1 0 0 0 9 4v1h6V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-.707.293ZM6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7H6Z" fill="#121212"></path><path d="M10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1ZM14 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Z" fill="#121212"></path></svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </li>`;

                $('#reading-list-stories-container').append(editStory);
            }

            $('#story-count').text(count+' stories');
            $('#save-changes-btn').attr('data-reading-list-id', readingList.readingListId);

            if(count===0){
                let box = `<div style="width: 100%; height: 370px; color: #1c6f65;">
                                    <!-- <img style="width: 150px;" src="assets/image/empty-reading-list.png">-->
                                  </div>`;
                $('#reading-list-stories-container').append(box);
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

loadAllStoriesInReadingList();




//when click on delete icon add story to delete queue
$(document).on('click', '.delete-button', function (event) {

    let storyId = $(this).data('story-id');

    if (!storyDeleteQueue.includes(storyId)) {
        storyDeleteQueue.push(storyId);
    }
    loadAllStoriesInReadingList();
});




//when click on clear all stories btn add all the stories to delete queue
let clearBtn = $('#clear-all-stories-btn')[0];
clearBtn.addEventListener('click', function (event) {

    Swal.fire({
        title: 'Clear all stories?',
        text: "This action cannot be undone",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Clear',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {

            $('#reading-list-stories-container').empty();
            $('#story-count').text(0+' stories');

            for (let i = 0; i < allStories.length; i++) {
                if (!storyDeleteQueue.includes(allStories[i].storyId)) {
                    storyDeleteQueue.push(allStories[i].storyId);
                }
            }
            loadAllStoriesInReadingList();
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
            console.log("Cancelled!");
        }
    });
});




//when click on save changes button save, save the all changes
let saveChangesBtn = $('#save-changes-btn')[0];
saveChangesBtn.addEventListener('click', async function (event) {

    let readingListId = $(this).data('reading-list-id');
    let readingListName = $('#reading-list-name-input').val();
    let storyCount = $('#story-count').text();
    storyCount = storyCount.split(" ")[0];

    let data = {
        'readingListId': readingListId,
        'readingListName': readingListName,
        'readingListStoryCount': storyCount,
        'storyDeleteQueue': storyDeleteQueue
    }

    storyDeleteQueue = [];
    $('#reading-list-name-input').val("");
    console.log(data);

    await fetch('http://localhost:8080/api/v1/readingList/update', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)

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
            loadAllStoriesInReadingList();
            window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/single-reading-list-page.html?readingListId=${readingListId}`;

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



















