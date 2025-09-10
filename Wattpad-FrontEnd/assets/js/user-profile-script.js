const profileColors = [
    "#F28B82", // soft red
    "#F78DA7", // soft pink
    "#C58AF9", // soft purple
    "#A7A5EB", // light indigo
    "#81A1F5", // light blue
    "#5AC8FA", // sky blue
    "#5FD1C8", // teal
    "#4DD0A5", // aqua green
    "#6CCB7F", // fresh green
    "#A3D977", // lime green
    "#FFD580", // soft peach
    "#FFB870"  // soft orange
];


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




//load user profile data
async function loadUserData() {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if(userId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/user/'+userId, {
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

            $('.profile-name').text(user.fullName);
            $('#alias').text('@'+user.username);
            $('#work').text(user.work);
            $('#reading-lists').text(user.readingLists);
            $('.followers-count').text(user.followers);
            $('#reading-list-setting').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/reading-list-page.html`);
            $('.story-setting-on-navigate').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/mywork-page.html`);

            if(user.profilePicPath==null){
                console.log('profile pic is null');
                $('#profile-pic').remove();
                $('.profile-pic-container').append(`<p style="font-weight: 500; font-size: 4em; text-align: center; transform: translateY(28px);">${user.fullName.substring(0,1).toUpperCase()}</p>`);

                const randomIndex = Math.floor(Math.random() * profileColors.length);
                const randomColor = profileColors[randomIndex];

                $('.profile-pic-warp').css('background-color',randomColor);
                $('.profile-pic-warp').css('border','0.5px solid #E0E0E0');

                if(user.coverPicPath==null){
                    $('.background.background-lg').css('background-color',randomColor);
                }
                else{
                    $('.background.background-lg').css('background-image', `url(${user.coverPicPath})`);
                }
            }
            else {
                $('#profile-pic').attr('src', `${user.profilePicPath}`);

                if(user.coverPicPath==null){
                    const randomIndex = Math.floor(Math.random() * profileColors.length);
                    const randomColor = profileColors[randomIndex];
                    $('.background.background-lg').css('background-color',randomColor);
                }
                else{
                    $('.background.background-lg').css('background-image', `url(${user.coverPicPath})`);
                }
            }

            if(user.isCurrentUser===1){
                $('.on-follow-user.on-follow').remove();
                $('.three-dots-btn').remove();
            }
            else{
                $('.user-balance').remove();
                $('.on-edit-profile').remove();
                $('#reading-list-setting').remove();
                $('#add-reading-list').remove();
                $('#story-setting').remove();
                $('.no-description').remove();
                $('.empty-placeholder').remove();
            }

            if(user.about==null){
                $('.description').remove();
            }
            else{
                $('.no-description').remove();
                $('.description').find('pre').text(user.about);
            }

            if(user.location==null){
                $('.location').remove();
            }
            else{
                $('.location').html(`<span class="user-meta-info-content">
                                         <i class="fa-solid fa-location-dot" style="color: #6f6f6f; font-size: 14px; margin-right: 5px;"></i>${user.location}
                                     </span>`);
            }

            $('.date').html(`<span class="user-meta-info-content">
                                <span>Joined</span>${user.joinedDate}
                             </span>`);

            if(user.facebookLink==null){
                $('.facebook').empty();
            }
            else{
                $('.facebook').find('a').text(user.fullName.split(' ')[0]+'\'s Facebook profile');
            }

            $('.following-tab').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile-following.html?userId=${userId}`);

            if(user.isFollowedByTheCurrentUser===1 && user.isCurrentUser===0){
                $(".follow-btn").replaceWith(`
                <button role="menuitem" class="btn btn-fan on-follow-user on-unfollow btn-teal">
                    <i class="fa-solid fa-user-plus" style="font-size:16px;"></i>
                    <span class="hidden-xs truncate">Following</span>
                </button>
            `);
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




//load following users
async function loadFollowingUsers() {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if(userId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/user/following/'+userId, {
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

            if(data.data.length>0){

                $('.users.clearfix').empty();
                for (let i = 0; i < data.data.length; i++) {

                    let user = data.data[i];

                    let singleFollowingUser = `<a class="avatar avatar-sm2 on-navigate pull-left hide" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${user.id}">
                                                        <img src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${user.profilePicPath}">
                                                      </a>`

                    $('.users.clearfix').append(singleFollowingUser);
                }
            }
            else{
                $('#following-panel').remove();
                $('#following-hr').remove();
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




//load user stories
let storyCount = 3;
async function loadUserStories() {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if(userId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/user/story/'+userId+'/'+storyCount, {
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

            let response = data.data;

            if(response.storyDTOList.length<=0){
                $('#profile-works').remove();
            }

            $('#story-panel-title').text(`Story by ${response.userFullName}`);

            if(response.isCurrentUser===1){
                $('#story-panel-metadata').find('li').text(`${response.publishedCount} Published Story . ${response.draftCount} Draft (only visible to you)`);
            }
            else{
                $('#story-panel-metadata').find('li').text(`${response.publishedCount} Published Story`);
            }

            $('#story-container').empty();
            for (let i = 0; i < response.storyDTOList.length; i++) {

                let story = response.storyDTOList[i];

                let singleStory = `<!--single story-->
                                    <div id="works-item-view">
                                        <div class="discover-module-stories-large on-discover-module-item">
                                            <a class="send-cover-event on-story-preview cover cover-home" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.id}">
                                                <div class="fixed-ratio fixed-ratio-cover">
                                                    <img style="object-fit: cover;" src="${story.coverImagePath}" alt="Cover image">
                                                </div>
                                            </a>
                                            <div class="content" data-target="397138907" data-type="stories">
                                                <a class="title meta on-story-preview" data-story-id="397138907" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.id}">
                                                    ${story.title}
                                                </a>
                                                <div class="meta social-meta">
                                                    <span class="read-count">
                                                        <svg style="transform: translateY(2px);" width="13" height="13" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg>
                                                         ${story.views}
                                                    </span>
                                                    <span class="vote-count">
                                                        <svg style="transform: translateY(2px);" width="13" height="13" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg>
                                                         ${story.likes}
                                                    </span>
                                                    <span class="part-count">
                                                        <svg style="transform: translateY(2px);" width="14" height="14" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.33366 4.66634C3.70185 4.66634 4.00033 4.36786 4.00033 3.99967C4.00033 3.63148 3.70185 3.33301 3.33366 3.33301C2.96547 3.33301 2.66699 3.63148 2.66699 3.99967C2.66699 4.36786 2.96547 4.66634 3.33366 4.66634ZM4.00033 7.99967C4.00033 8.36786 3.70185 8.66634 3.33366 8.66634C2.96547 8.66634 2.66699 8.36786 2.66699 7.99967C2.66699 7.63148 2.96547 7.33301 3.33366 7.33301C3.70185 7.33301 4.00033 7.63148 4.00033 7.99967ZM4.00033 11.9997C4.00033 12.3679 3.70185 12.6663 3.33366 12.6663C2.96547 12.6663 2.66699 12.3679 2.66699 11.9997C2.66699 11.6315 2.96547 11.333 3.33366 11.333C3.70185 11.333 4.00033 11.6315 4.00033 11.9997ZM6.00033 7.99967C6.00033 8.36786 6.2988 8.66634 6.66699 8.66634H12.667C13.0352 8.66634 13.3337 8.36786 13.3337 7.99967C13.3337 7.63148 13.0352 7.33301 12.667 7.33301H6.66699C6.2988 7.33301 6.00033 7.63148 6.00033 7.99967ZM6.66699 12.6663C6.2988 12.6663 6.00033 12.3679 6.00033 11.9997C6.00033 11.6315 6.2988 11.333 6.66699 11.333H12.667C13.0352 11.333 13.3337 11.6315 13.3337 11.9997C13.3337 12.3679 13.0352 12.6663 12.667 12.6663H6.66699ZM6.00033 3.99967C6.00033 4.36786 6.2988 4.66634 6.66699 4.66634H12.667C13.0352 4.66634 13.3337 4.36786 13.3337 3.99967C13.3337 3.63148 13.0352 3.33301 12.667 3.33301H6.66699C6.2988 3.33301 6.00033 3.63148 6.00033 3.99967Z"></path></g></svg> 
                                                        ${story.parts}
                                                    </span>
                                                </div>
                                                <div class="description">${story.description}</div>
                                                <div class="tag-meta clearfix">
                                                    <ul class="tag-items">
                                                        ${story.tags.slice(0, 3).map(item => `<li><a class="tag-item on-navigate" href="">${item}</a></li>`).join("")}
                                                    </ul>
                                                    ${story.tags.length>3
                                                    ? `<span class="num-not-shown on-story-preview" data-story-id="347909844">+${story.tags.length-3} more</span>`
                                                    : ``
                                                    }
                                                </div>
                                                ${story.publishedOrDraft===1
                                                ? `<span class="work-state">Published</span>`
                                                : `<span class="work-state">Draft(only visible to you)</span>`}
                                            </div>
                                        </div>
                                    </div>`;

                $('#story-container').append(singleStory);

                if(response.isMoreStoriesThere===0){
                    $('.show-more-story-btn').remove();
                }
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




//click on show more stories btn
let showMoreStoriesBtn = $('.on-showmore-stories')[0];
showMoreStoriesBtn.addEventListener('click',async function (event) {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        //load chapter not found page
        return;
    }

    storyCount+=7;
    loadUserStories();

});




//load user reading lists
let readingListCount = 2;
async function loadUserReadingLists() {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if(userId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/user/readingList/'+userId+'/'+readingListCount, {
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

            if(data.data.length<=0){
                $('.reading-list-panel').remove();
                $('.show-more-reading-list').remove();
                return;
            }
            else {
                $('.empty-placeholder').remove();
            }

            $('#reading-list-panel-title').text(`${data.data.length} Reading List`);

            if(data.data[0].isMoreReadingListsAvailable===0){
                $('.show-more-reading-list').remove();
            }

            $('#lists-item-view').empty();
            for (let i = 0; i < data.data.length; i++) {

                let list = data.data[i];

                let singleList = `<!--a single reading list-->
                                        <div class="reading-list">
                                            <!--a single reading list header-->
                                            <header class="panel-heading">
                                                <div class="panel-title">
                                                    <a class="send-list-event" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/single-reading-list-page.html?readingListId=${list.readingListId}">${list.readingListName}</a>
                                                    <i class="fa-solid fa-angle-right" style="font-size:16px; transform: translateY(-1px); color: #6f6f6f; padding-left: 3px;"></i>
                                                </div>
                                                <ul class="metadata">
                                                    <li>Reading List</li>
                                                    <li>${list.readingListStoryCount} Stories</li>
                                                </ul>
                                            </header>
                                            <!--a single reading list body-->
                                            <div class="panel-body">
                                                ${list.threeStoriesDTOList.map(item => `
                                                <!--single story in a reading list-->
                                                <div class="story-item hide">
                                                    <a class="on-story-preview cover cover-md" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${item.id}">
                                                        <div class="fixed-ratio fixed-ratio-cover">
                                                            <img src="${item.coverImagePath}" alt="Story cover">
                                                        </div>
                                                    </a>
                                                    <div class="content">
                                                        <div class="info">
                                                            <a class="title meta on-story-preview" href="ttp://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${item.id}">${item.title}</a>
                                                        </div>
                                                        <div class="meta social-meta">
                                                            <span class="read-count">
                                                                <svg style="transform: translateY(2px);" width="12" height="12" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg> 
                                                                ${item.views}
                                                            </span>
                                                            <span class="vote-count" data-toggle="tooltip" data-placement="top" title="" data-original-title="52,734 Votes">
                                                                <svg style="transform: translateY(2px);" width="12" height="12" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg> 
                                                                ${item.likes}
                                                            </span>
                                                            <span class="part-count">
                                                                <svg style="transform: translateY(2px);" width="13" height="13" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.33366 4.66634C3.70185 4.66634 4.00033 4.36786 4.00033 3.99967C4.00033 3.63148 3.70185 3.33301 3.33366 3.33301C2.96547 3.33301 2.66699 3.63148 2.66699 3.99967C2.66699 4.36786 2.96547 4.66634 3.33366 4.66634ZM4.00033 7.99967C4.00033 8.36786 3.70185 8.66634 3.33366 8.66634C2.96547 8.66634 2.66699 8.36786 2.66699 7.99967C2.66699 7.63148 2.96547 7.33301 3.33366 7.33301C3.70185 7.33301 4.00033 7.63148 4.00033 7.99967ZM4.00033 11.9997C4.00033 12.3679 3.70185 12.6663 3.33366 12.6663C2.96547 12.6663 2.66699 12.3679 2.66699 11.9997C2.66699 11.6315 2.96547 11.333 3.33366 11.333C3.70185 11.333 4.00033 11.6315 4.00033 11.9997ZM6.00033 7.99967C6.00033 8.36786 6.2988 8.66634 6.66699 8.66634H12.667C13.0352 8.66634 13.3337 8.36786 13.3337 7.99967C13.3337 7.63148 13.0352 7.33301 12.667 7.33301H6.66699C6.2988 7.33301 6.00033 7.63148 6.00033 7.99967ZM6.66699 12.6663C6.2988 12.6663 6.00033 12.3679 6.00033 11.9997C6.00033 11.6315 6.2988 11.333 6.66699 11.333H12.667C13.0352 11.333 13.3337 11.6315 13.3337 11.9997C13.3337 12.3679 13.0352 12.6663 12.667 12.6663H6.66699ZM6.00033 3.99967C6.00033 4.36786 6.2988 4.66634 6.66699 4.66634H12.667C13.0352 4.66634 13.3337 4.36786 13.3337 3.99967C13.3337 3.63148 13.0352 3.33301 12.667 3.33301H6.66699C6.2988 3.33301 6.00033 3.63148 6.00033 3.99967Z"></path></g></svg> 
                                                                ${item.parts}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>`).join("")}
                                            </div>
                                        </div>`;

                $('#lists-item-view').append(singleList);
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




//click on show more reading list btn
let showMoreReadingListBtn = $('.on-showmore-reading-list')[0];
showMoreReadingListBtn.addEventListener('click',async function (event) {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        //load chapter not found page
        return;
    }

    readingListCount+=2;
    loadUserReadingLists();

});




//click on edit profile
let editProfileBtn = $('.edit-profile')[0];
editProfileBtn.addEventListener('click',async function (event) {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        //load chapter not found page
        return;
    }

    window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile-edit-page.html?userId=${userId}`;

});




//click on edit profile
let addDescriptionBtn = $('.add-description-btn')[0];
addDescriptionBtn.addEventListener('click',async function (event) {

    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        //load chapter not found page
        return;
    }

    window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile-edit-page.html?userId=${userId}`;

});




async function run() {
    await loadUserData();
    await loadFollowingUsers();
    await loadUserStories();
    loadUserReadingLists();

}

run();




//follow user
$(document).on('click', '.follow-btn', function (event) {
    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        // load chapter not found page
        return;
    }

    fetch('http://localhost:8080/user/follow/' + userId, {
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

            // Replace with unfollow button
            $(".follow-btn").replaceWith(`
                <button role="menuitem" class="btn btn-fan on-follow-user on-unfollow btn-teal">
                    <i class="fa-solid fa-user-plus" style="font-size:16px;"></i>
                    <span class="hidden-xs truncate">Following</span>
                </button>
            `);
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
});




//unfollow user
$(document).on('click', '.on-unfollow', function (event) {
    let userId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("userId")) {
        userId = params.get("userId");
    }

    if (userId == null) {
        // load chapter not found page
        return;
    }

    fetch('http://localhost:8080/user/unfollow/' + userId, {
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

            // Replace with follow button
            $(".on-unfollow").replaceWith(`
                <button role="menuitem" class="btn btn-fan btn-white on-follow-user on-follow follow-btn">
                    <i class="fa-solid fa-user-plus" style="font-size:16px;"></i>
                    <span class="hidden-xs truncate">Follow</span>
                </button>
            `);
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
});





























