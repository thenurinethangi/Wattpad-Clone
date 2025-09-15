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
// async function loadLibraryStories() {
//
//     await fetch('http://localhost:8080/api/v1/library/stories', {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//     })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(errData => {
//                     throw new Error(JSON.stringify(errData));
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('Success:', data);
//
//             let libraryStories = data.data;
//             $('#library-story-container').empty();
//
//             if(libraryStories.length<=0){
//                 return;
//             }
//
//             for (let i = 0; i < libraryStories.length; i++) {
//
//                 let story = libraryStories[i];
//
//                 let singleLibraryStory = `
//         <!--single library story-->
//         <div class="hBlTa">
//             <div class="libraryStoryCard__y5_Fe">
//                 <div class="libraryStoryItem__Yxev4">
//                     <div class="libraryCover__zF7AM coverWrapper__t2Ve8">
//                         <img class="cover__BlyZa" src="${story.storyCoverImagePath}" alt="storyCover"/>
//                     </div>
//                     <div class="SMOJH" style="visibility: hidden; opacity: 0;">
//                         <div class="_3mT2V"></div>
//                         <div class="oHIU7">
//                             <button class="_0OiLI delete-btn" data-story-id="${story.storyId}">
//                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ds-neutral-00)" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round"><g><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></g></svg>
//                             </button>
//                         </div>
//                         <div class="_3CmAp">
//                             <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${story.lastOpenedChapterId}">
//                                 <button class="skvBl">Start Reading</button>
//                             </a>
//                             <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}">
//                                 <button class="skvBl">Details</button>
//                             </a>
//                             <button class="skvBl">Archive</button>
//                             <button class="skvBl">Add to List</button>
//                         </div>
//                     </div>
//                 </div>
//                 <div>
//                     <div class="progress_bar__ja0_4" style="width:100%;height:8px" role="progressbar">
//                         <div class="progress_bar_value__rnwN9 primary__efugz" style="width: ${(story.lastOpenedChapterSequenceNo / story.totalParts) * 100}%"></div>
//                         <div class="progress_bar_value__rnwN9 default__sk_o3" style="width:100%"></div>
//                         <div class="progress_bar_value__rnwN9 success__BzCzJ" style="width:0%"></div>
//                     </div>
//                     <p hidden="">progress-bar-label-180595293</p>
//                 </div>
//                 <div class="authorWrapper__u0RFS">
//                     <div class="authorSection__GVjjz">
//                         <strong>${story.storyTitle}</strong>
//                         <small>${story.username}</small>
//                     </div>
//                     <div>
//                         <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${story.userId}" aria-label="">
//                             <img style="object-fit: cover;" src="${story.userProfilePicPath}" aria-hidden="true" alt="" class="avatar__Ygp0_ avatar_sm__zq5iO"/>
//                         </a>
//                     </div>
//                 </div>
//                 <div class="statsWrapper__DqAW0">
//                     <span class="stats_wrapper__THA2S">
//                         <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpView</title><path d="M1.82 10.357c-.353.545-.594.975-.723 1.233a.916.916 0 0 0 0 .82c.129.258.37.688.723 1.233a18.78 18.78 0 0 0 2.063 2.65C6.19 18.754 8.902 20.25 12 20.25c3.098 0 5.81-1.497 8.117-3.956a18.784 18.784 0 0 0 2.063-2.65c.352-.546.594-.976.723-1.234a.916.916 0 0 0 0-.82c-.129-.258-.37-.688-.723-1.233a18.786 18.786 0 0 0-2.063-2.65C17.81 5.246 15.098 3.75 12 3.75c-3.098 0-5.81 1.496-8.117 3.956a18.782 18.782 0 0 0-2.063 2.65Zm3.4 4.683A16.969 16.969 0 0 1 2.963 12a16.97 16.97 0 0 1 2.259-3.04C7.21 6.837 9.484 5.585 12 5.585c2.517 0 4.788 1.253 6.78 3.377A16.973 16.973 0 0 1 21.037 12a16.97 16.97 0 0 1-2.259 3.04c-1.99 2.122-4.262 3.376-6.779 3.376-2.516 0-4.788-1.254-6.78-3.377Z" fill="#121212"></path><path d="M8.333 12a3.667 3.667 0 1 0 7.334 0 3.667 3.667 0 0 0-7.334 0Zm5.5 0a1.833 1.833 0 1 1-3.666 0 1.833 1.833 0 0 1 3.666 0Z" fill="#121212"></path></svg>
//                         <span class="stats-label__text__VzfuV" aria-hidden="true">${story.views}</span>
//                     </span>
//                     <span class="stats_wrapper__THA2S">
//                         <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpVote</title><path d="M9.807 8.703a1 1 0 0 1-.752.547l-4.907.717 3.55 3.457a1 1 0 0 1 .288.885l-.838 4.883 4.386-2.307a1 1 0 0 1 .931 0l4.387 2.307-.838-4.883a1 1 0 0 1 .288-.885l3.55-3.457-4.907-.717a1 1 0 0 1-.752-.547L12 4.259 9.807 8.703ZM8.246 7.347l2.857-5.79a1 1 0 0 1 1.794 0l2.857 5.79 6.39.934a1 1 0 0 1 .554 1.705l-4.624 4.503 1.091 6.362a1 1 0 0 1-1.45 1.054L12 18.9l-5.715 3.005a1 1 0 0 1-1.45-1.054l1.09-6.361-4.623-4.504a1 1 0 0 1 .553-1.705l6.39-.934Z" fill="#121212"></path></svg>
//                         <span class="stats-label__text__VzfuV" aria-hidden="true">${story.likes}</span>
//                     </span>
//                 </div>
//             </div>
//           <!--reading list library to add the story model-->
//           <div data-testid="popover-content" class="vDQzQ pgq4C Imgyz model" data-placement="bottom" style="position: fixed; inset: 0px auto auto 0px; transform: translate3d(511.5px, 371px, 0px); background-color: #fff; width: 300px; display: none; visibility: hidden; opacity: 0;">
//             <div class="tl9FC" style="width: 100%">
//               <h3>Add to</h3>
//               <ul class="lists-menu" style="display: flex; flex-direction: column; gap: 7px; width: 100%; overflow-x: hidden; overflow-y: auto;">
//                 <li data-story-id="${story.storyId}">
//                   <a class="on-modify-list" data-list-id="1736461758" style="display: flex; justify-content: space-between; align-items: center; gap: 50px; width: 100%">
// <!--                    <span class="fa fa-reading-list fa-wp-neutral-2 " aria-hidden="true" style="font-size:autopx;"></span>-->
//                     <span class="reading-list-name" style="font-size: 14px; color: #222222;">yukee07's Reading List</span>
//                     <div class="status">
//                       <i class="fa-regular fa-circle-check" style="color: #00b2b2; font-size: 17px;"></i>
//                     </div>
//                   </a>
//                 </li>
//                 <li>
//                   <a class="on-modify-list" data-list-id="1761803156" style="display: flex; justify-content: space-between; align-items: center; width: 100%">
// <!--                    <span class="fa fa-reading-list fa-wp-neutral-2 " aria-hidden="true" style="font-size:autopx;"></span>-->
//                     <span class="reading-list-name" style="font-size: 14px; color: #222222;">warewolf</span>
//                     <div class="status">
//                       <i class="fa-regular fa-circle-check" style="color: #00b2b2; font-size: 17px;"></i>
//                     </div>
//                   </a>
//                 </li>
//               </ul>
//               <div class="inputs" style="margin-top: 10px; padding-bottom: 17px; display: flex; gap: 10px;">
//                 <label for="new-reading-list" class="sr-only">New Reading List</label>
//                 <input id="new-reading-list" type="text" class="form-control list-name list-error-placeholder" placeholder="Add new reading list..." style="font-size: 14px; color: #222222; font-weight: 400;">
//                 <button class="btn btn-orange on-create-list" type="button" data-story-id="397138907" style="background-color: #ff6122;">
//                   <svg width="11" height="11" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
//                     <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
//                     <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//             <div data-testid="popover-arrow" class="XeyST" style="position: absolute; left: 0px; transform: translate3d(163.5px, 0px, 0px);"></div>
//           </div>
//         </div>`
//
//                 $('#library-story-container').append(singleLibraryStory);
//             }
//
//         })
//         .catch(error => {
//             try {
//                 let errorResponse = JSON.parse(error.message);
//                 console.error('Error:', errorResponse);
//             } catch (e) {
//                 console.error('Error:', error.message);
//             }
//         });
// }
//
// loadLibraryStories();
// Load library stories from backend
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

            if (libraryStories.length <= 0) {
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
                                    <img class="cover__BlyZa" src="${story.storyCoverImagePath}" alt="storyCover"/>
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
                                        <button class="skvBl add-lb-rl" data-story-id="${story.storyId}">Add to List</button>
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
                                        <img style="object-fit: cover;" src="${story.userProfilePicPath}" aria-hidden="true" alt="" class="avatar__Ygp0_ avatar_sm__zq5iO"/>
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
                        <!-- Reading list modal for this story -->
                        <div data-testid="popover-content" class="vDQzQ pgq4C Imgyz model" data-story-id="${story.storyId}" data-placement="bottom" style="position: fixed; inset: 0px auto auto 0px; background-color: #fff; width: 300px; display: none; visibility: hidden; opacity: 0; z-index: 1000;">
                            <div class="tl9FC" style="width: 100%">
                                <h3>Add to</h3>
                                <ul class="lists-menu" style="display: flex; flex-direction: column; gap: 8px; width: 100%; overflow-x: hidden; overflow-y: auto;">
                                </ul>
                                <div class="inputs" style="margin-top: 10px; padding-bottom: 17px; display: flex; gap: 10px;">
                                    <label for="new-reading-list-${story.storyId}" class="sr-only">New Reading List</label>
                                    <input id="new-reading-list-${story.storyId}" type="text" class="form-control list-name list-error-placeholder" placeholder="Add new reading list..." style="font-size: 12px; color: #222222; font-weight: 400; width: 70%;">
                                    <button class="btn btn-orange on-create-list" type="button" data-story-id="${story.storyId}" style="background-color: #ff6122; padding: 5px; width: 30px; border-radius: 5px; color: #fff;">
                                        <svg width="11" height="11" viewBox="0 0 16 16"  xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                                            <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                            <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div data-testid="popover-arrow" class="XeyST" style="position: absolute; left: 0px; transform: translate3d(163.5px, 0px, 0px);"></div>
                        </div>
                    </div>
                `;

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


// Load all reading lists for a specific story
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
            $ul.empty(); // Clear existing lists

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

    let $dropdown = $(this).closest('.vDQzQ.pgq4C.Imgyz.model');
    let storyId = $dropdown.data('story-id');
    if (!storyId) {
        console.error('Story ID not found in modal');
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
            refreshLists($dropdown, storyId);
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
});


// Wrapper to refresh reading lists
function refreshLists($dropdown, storyId) {
    return loadReadingLists($dropdown, storyId); // Only refresh reading lists, no library
}


// Open dropdown (modal) when clicking the button
$(document).on('click', '.add-lb-rl', function (e) {
    e.preventDefault();
    e.stopPropagation();

    let storyId = $(this).data('story-id');
    if (!storyId) {
        console.error('Story ID not found on button');
        return;
    }

    const $modal = $(this).closest('.hBlTa').find('.vDQzQ.pgq4C.Imgyz.model'); // Find the specific modal for this story
    if ($modal.length === 0) {
        console.error('Modal not found for story ID:', storyId, 'Check HTML structure:', $(this).closest('.hBlTa').html().substring(0, 200));
        return;
    }

    // Debug initial state
    console.log('Modal found for story ID:', storyId, 'Initial state:', {
        display: $modal.css('display'),
        visibility: $modal.css('visibility'),
        opacity: $modal.css('opacity')
    });

    // Reload lists each time before showing
    loadReadingLists($modal, storyId).then(() => {
        // Show the modal
        $modal.css({
            display: 'block',
            visibility: 'visible',
            opacity: 1
        });

        // Position the modal near the button
        const rect = this.getBoundingClientRect();
        const modalWidth = $modal.outerWidth();
        const windowWidth = $(window).width();

        let left = rect.left + window.scrollX;
        if (left + modalWidth > windowWidth - 10) {
            left = windowWidth - modalWidth - 10;
        }

        $modal.css({
            left: left + 'px',
            top: rect.bottom + window.scrollY + 'px',
            position: 'absolute'
        });

        console.log('Modal shown at:', { left: left + 'px', top: (rect.bottom + window.scrollY) + 'px' });
    }).catch(error => {
        console.error('Error loading reading lists:', error);
    });
});


// Close dropdown (modal) when clicking outside
$(document).on('click', function (e) {
    const $target = $(e.target);
    if (!$target.closest('.vDQzQ.pgq4C.Imgyz.model').length && !$target.closest('.add-lb-rl').length) {
        $('.vDQzQ.pgq4C.Imgyz.model').css({
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

    let storyId = $(this).data('story-id');
    if (!storyId) {
        console.error('Story ID not found on create button');
        return;
    }

    const listName = $(`#new-reading-list-${storyId}`).val().trim();
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
            $(`#new-reading-list-${storyId}`).val('');

            if (data.data === false) {
                alert("Reading list with this name already exists, try another.");
            } else {
                const $dropdown = $(this).closest('.vDQzQ.pgq4C.Imgyz.model');
                refreshLists($dropdown, storyId);
            }
        })
        .catch(error => {
            console.error("Error creating list:", error);
            alert("Failed to create reading list. Try again.");
        });
});




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















