//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/genre', {
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

            if (params.has("genre")) {
                document.body.style.display = 'block';
                document.body.style.visibility = 'visible';
                document.body.style.opacity = 1;
            }
            else {
                //here instead of redirect to login page display model for login
                window.location.href = 'login-page.html';
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

            window.location.href = 'login-page.html';
        });
}




//load first 10 stories in selected genre
async function loadAllStoriesInSelectedGenre(data) {

    let genre = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("genre")) {
        genre = params.get("genre");
    }

    if(genre==null){
        //load chapter not found page
        return;
    }

    let genreTitle = $('#genre-title');
    if(genre==='Romance'){
        genreTitle.text('Romance Stories');
    }
    else if(genre==='Fanfiction'){
        genreTitle.text('Fanfiction Stories');
    }
    else if(genre==='LGBTQ+'){
        genreTitle.text('LGBTQ+ Stories');
    }
    else if(genre==='Wattpad Originals'){
        genreTitle.text('Wattpad Originals Stories');
    }
    else if(genre==='Werewolf'){
        genreTitle.text('Werewolf Stories');
    }
    else if(genre==='New Adult'){
        genreTitle.text('New Adult Stories');
    }
    else if(genre==='Fantasy'){
        genreTitle.text('Fantasy Stories');
    }
    else if(genre==='Short Story'){
        genreTitle.text('Short Story Stories');
    }
    else if(genre==='Teen Fiction'){
        genreTitle.text('Teen Fiction Stories');
    }
    else if(genre==='Historical Fiction'){
        genreTitle.text('Historical Fiction Stories');
    }
    else if(genre==='Paranormal'){
        genreTitle.text('Paranormal Stories');
    }
    else if(genre==='Teen Fiction'){
        genreTitle.text('Editor\'s Picks Stories');
    }
    else if(genre==='Humor'){
        genreTitle.text('Humor Stories');
    }
    else if(genre==='Horror'){
        genreTitle.text('Horror Stories');
    }
    else if(genre==='Contemporary Lit'){
        genreTitle.text('Contemporary Lit Stories');
    }
    else if(genre==='Diverse Lit'){
        genreTitle.text('Diverse Lit Stories');
    }
    else if(genre==='Mystery'){
        genreTitle.text('Mystery Stories');
    }
    else if(genre==='Thriller'){
        genreTitle.text('Thriller Stories');
    }
    else if(genre==='Science Fiction'){
        genreTitle.text('Science Fiction Stories');
    }
    else if(genre==='The Wattys'){
        genreTitle.text('The Wattys Stories');
    }
    else if(genre==='Adventure'){
        genreTitle.text('Adventure Stories');
    }
    else if(genre==='Non-Fiction'){
        genreTitle.text('Non-Fiction Stories');
    }
    else if(genre==='Poetry'){
        genreTitle.text('Poetry Stories');
    }
    else {
        window.location.href = '../../home-page.html'
    }

    await fetch('http://localhost:8080/genre/'+genre, {
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

            let genreSearchResult = data.data;

            $('#tags-container').empty();
            for (let i = 0; i < genreSearchResult.tags.length; i++) {

                let bool = false;
                for (let j = 0; j < tags.length; j++) {
                    if(genreSearchResult.tags[i]===tags[j]){
                       bool = true;
                       break;
                    }
                }

                if(bool){
                    let tag = `<div class="tag-item with-icon filter-tags" data-tag="${genreSearchResult.tags[i]}" style="background-color: #eee;">
                                        <span>${genreSearchResult.tags[i]}</span>
                                        <span class="fa fa-plus fa-wp-neutral-2" aria-hidden="true" style="font-size: 12px; transform: rotate(45deg);"></span>
                                      </div>`

                    $('#tags-container').append(tag);
                }
            }

            for (let i = 0; i < genreSearchResult.tags.length; i++) {

                let bool = false;
                for (let j = 0; j < tags.length; j++) {
                    if(genreSearchResult.tags[i]===tags[j]){
                        bool = true;
                        break;
                    }
                }

                if(!bool){
                    let tag = `<div class="tag-item with-icon filter-tags" data-tag="${genreSearchResult.tags[i]}">
                                        <span>${genreSearchResult.tags[i]}</span>
                                        <span class="fa fa-plus fa-wp-neutral-2" aria-hidden="true" style="font-size: 12px;"></span>
                                      </div>`

                    $('#tags-container').append(tag);
                }
            }

            $('#header-left').text(genreSearchResult.totalStoriesCount+ ' Stories');

            $('#browse-results-item-view').empty();
            for (let i = 0; i < genreSearchResult.genreStoryDTOList.length; i++) {

                let story = genreSearchResult.genreStoryDTOList[i];

                let singleStory = `
                            <!--a single story-->
                            <div class="browse-story-item completed">
                                <div class="component-wrapper">
                                    <div class="item">
                                        <!--image-->
                                        <a class="on-story-preview cover cover-lg" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}">
                                            <div class="fixed-ratio fixed-ratio-cover">
                                                <img src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${story.coverImagePath}" alt="Story cover">
                                                <div class="story-rank">
                                                    <span>#${story.rankNo}</span>
                                                </div>
                                            </div>
                                        </a>
                                        <!--content-->
                                        <div class="content">
                                            <!--story name-->
                                            <a class="title meta on-story-preview" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}">${story.storyTitle}</a>
                                            <!--author-->
                                            <a class="username meta on-navigate" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${story.userId}">by ${story.username}</a>
                                            <!--statics-->
                                            <div class="meta social-meta" style="display: flex; justify-content: flex-start; align-items: center;">
                                                <span class="read-count" style="display: flex; justify-content: flex-start; align-items: center; gap: 3px;">
                                                    <svg width="13" height="13" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg>
                                                    ${story.views}
                                                </span>
                                                <span class="vote-count" style="display: flex; justify-content: flex-start; align-items: center; gap: 3px;">
                                                    <svg width="13" height="13" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg>
                                                    ${story.likes}
                                                </span>
                                                <span class="part-count" style="display: flex; justify-content: flex-start; align-items: center; gap: 3px;">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.33366 4.66634C3.70185 4.66634 4.00033 4.36786 4.00033 3.99967C4.00033 3.63148 3.70185 3.33301 3.33366 3.33301C2.96547 3.33301 2.66699 3.63148 2.66699 3.99967C2.66699 4.36786 2.96547 4.66634 3.33366 4.66634ZM4.00033 7.99967C4.00033 8.36786 3.70185 8.66634 3.33366 8.66634C2.96547 8.66634 2.66699 8.36786 2.66699 7.99967C2.66699 7.63148 2.96547 7.33301 3.33366 7.33301C3.70185 7.33301 4.00033 7.63148 4.00033 7.99967ZM4.00033 11.9997C4.00033 12.3679 3.70185 12.6663 3.33366 12.6663C2.96547 12.6663 2.66699 12.3679 2.66699 11.9997C2.66699 11.6315 2.96547 11.333 3.33366 11.333C3.70185 11.333 4.00033 11.6315 4.00033 11.9997ZM6.00033 7.99967C6.00033 8.36786 6.2988 8.66634 6.66699 8.66634H12.667C13.0352 8.66634 13.3337 8.36786 13.3337 7.99967C13.3337 7.63148 13.0352 7.33301 12.667 7.33301H6.66699C6.2988 7.33301 6.00033 7.63148 6.00033 7.99967ZM6.66699 12.6663C6.2988 12.6663 6.00033 12.3679 6.00033 11.9997C6.00033 11.6315 6.2988 11.333 6.66699 11.333H12.667C13.0352 11.333 13.3337 11.6315 13.3337 11.9997C13.3337 12.3679 13.0352 12.6663 12.667 12.6663H6.66699ZM6.00033 3.99967C6.00033 4.36786 6.2988 4.66634 6.66699 4.66634H12.667C13.0352 4.66634 13.3337 4.36786 13.3337 3.99967C13.3337 3.63148 13.0352 3.33301 12.667 3.33301H6.66699C6.2988 3.33301 6.00033 3.63148 6.00033 3.99967Z"></path></g></svg>
                                                    ${story.parts}
                                                </span>
                                            </div>
                                            <!--description-->
                                            <div class="description">${story.storyDescription}</div>
                                            <!--tags/mature/complete-->
                                            <div class="bottom-content clearfix">
                                                <div class="story-status">
                                                    ${story.status === 1
                                                    ? `<span class="label label-info">Completed</span>`
                                                    : ``
                                                    }
                                                    ${story.rating === 1
                                                    ? `<span class="label label-danger">Mature</span>`
                                                    : ``
                                                    }
                                                </div>
                                                <div class="tag-meta clearfix ${story.storyId}">
                                                    <ul class="tag-items">
                                                        <!--story tags placed here-->
                                                    </ul>
<!--                                                    <span class="num-not-shown on-story-preview" role="button" tabindex="0">+19 more</span>-->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

                $('#browse-results-item-view').append(singleStory);

                $(`.${story.storyId} .tag-items`).empty();
                let count = 0;
                for (let j = 0; j < story.tags.length; j++) {
                    if(j>=3){
                        count++;
                    }
                    else{
                        let tag = `<li>
                                            <a class="tag-item" href="/stories/revenge">${story.tags[j]}</a>
                                          </li>`;

                        $(`.${story.storyId} .tag-items`).append(tag);
                    }
                }

                if(count>0){
                    let lessTagsCount = `<span class="num-not-shown on-story-preview" role="button" tabindex="0"><a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}" style="color: #6f6f6f; font-size: 12px; font-weight: 600;">+${count} more</a</span>`;
                    $(`.${story.storyId}`).append(lessTagsCount);
                }
            }

            if(genreSearchResult.areMoreStoriesAvailable==1){
                $('#show-more-btn-container').css('display','block');
            }
            else{
                $('#show-more-btn-container').css('display','none');
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

let storyCount = 16;
let tags = [];
let sortBy = 1;

let data = {
    'storyCount': storyCount,
    'tags': tags,
    'sortBy': sortBy
};
loadAllStoriesInSelectedGenre(data);




//when click on search more btn load more stories by selected genre
let searchMoreBtn = $('#search-more-btn')[0];
searchMoreBtn.addEventListener('click',function (event) {

    storyCount+=16;

    let data = {
        'storyCount': storyCount,
        'tags': tags,
        'sortBy': sortBy
    };
    loadAllStoriesInSelectedGenre(data);

});




//when click on sort by show the sort by drop down
let sortByDropDown = $('#sortby-button')[0];
sortByDropDown.addEventListener('click', function (event) {

    $('#sortby-dropdown').css('display','block');
    $('#sort-by-newest').css('display','block');
    $('#sort-by-hot').css('display','block');
});




//when click on sort by hot filter the stories by most viewed to least
let sortByHot = $('#sort-by-hot')[0];
sortByHot.addEventListener('click', function (event) {

    let icon1 = $(this).find('i');
    if (icon1.length) {
        icon1.css('display', 'block');
    }

    let icon2 = $('#sort-by-newest').find('i');
    icon2.css('display','none');

    $(this).css('display','none');
    $('#sort-by-newest').css('display','none');

    $('#sortby-text').text('Sort by:  Hot');

    sortBy = 1;
    let data = {
        'storyCount': storyCount,
        'tags': tags,
        'sortBy': sortBy
    };
    loadAllStoriesInSelectedGenre(data);

});




//when click on sort by new filter the stories by latest to old
let sortByNewest = $('#sort-by-newest')[0];
sortByNewest.addEventListener('click', function (event) {

    let icon1 = $(this).find('i');
    if (icon1.length) {
        icon1.css('display', 'block');
    }

    let icon2 = $('#sort-by-hot').find('i');
    icon2.css('display','none');

    $(this).css('display','none');
    $('#sort-by-hot').css('display','none');

    $('#sortby-text').text('Sort by:  New');

    sortBy = 0;
    let data = {
        'storyCount': storyCount,
        'tags': tags,
        'sortBy': sortBy
    };
    loadAllStoriesInSelectedGenre(data);

});




//when click on filter tags filter the stories by tags
$(document).on('click','.filter-tags',function (event) {

    let tag = $(this).data('tag');

    if (!tags.includes(tag)) {
        tags.push(tag);
    }
    else{
        tags = tags.filter(t => t !== tag);
    }

    let data = {
        'storyCount': storyCount,
        'tags': tags,
        'sortBy': sortBy
    };
    loadAllStoriesInSelectedGenre(data);

});























