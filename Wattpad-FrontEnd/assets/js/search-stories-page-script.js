//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/search', {
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

            if (params.has("search")) {
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




//load all stories that match to searched keyword
async function loadAllStoriesThatMatchToSearchedKeyWord() {

    let search = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("search")) {
        search = params.get("search");
    }

    if(search==null){
        //load chapter not found page
        return;
    }

    $('#searched-keyword').text('"'+search+'"');

    await fetch('http://localhost:8080/api/v1/search/by/'+encodeURIComponent(search), {
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

            let searchResponse = data.data;

            $('.stories-tab').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search-stories-page.html?search=${search}`);
            $('.profiles-tag').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search-profile-page.html?search=${search}`);

            $('#total-story-count').text(searchResponse.totalStoriesCount+' results');

            $('#tags-container').empty();
            for (let i = 0; i < searchResponse.tags.length; i++) {

                let tag = searchResponse.tags[i];
                let t = `<li data-tag="${tag}" class="single-tag"><div class="tag-pill__yrFxu refine-by-tag" role="button" aria-label="filter by alpha" aria-describedby="screen-reader-description" style="color: rgb(18, 18, 18);">${tag}</div></li>`;
                $('#tags-container').append(t);
            }

            $('#story-container').empty();
            if(searchResponse.genreStoryDTOList.length<=0){
                let msg = `<p style="font-size: 18px;">No stories found for the searched word.</p>`
                $('#story-container').append(msg)
            }

            for (let i = 0; i < searchResponse.genreStoryDTOList.length; i++) {

                let story = searchResponse.genreStoryDTOList[i];
                let s = `
                                                <!--single story-->
                                                <li style="width: 100%;" class="list-group-item">
                                                    <a class="story-card" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}">
                                                        <div style="width: 630px;" class="story-card-data hidden-xxs">
                                                            <div class="cover">
                                                                <img style="object-fit: cover;" src="${story.coverImagePath}" alt="">
                                                            </div>
                                                            <div style="width: 460px;" class="story-info">
                                                                <span class="sr-only">${story.storyTitle}</span>
                                                                <div class="title" aria-hidden="true">${story.storyTitle}</div>
                                                                <span class="sr-only">  Complete </span>
                                                                <div class="icon-bar" aria-hidden="true">
                                                                    ${story.status === 1 
                                                                    ? `<div class="completed">
                                                                        <div class="tag-item" style="background-color: rgb(28, 111, 101); color: rgb(255, 255, 255);">Complete</div>
                                                                       </div>`
                                                                    : ``
                                                                    }
                                                                    ${story.rating === 1
                                                                    ? `<div class="completed">
                                                                        <div class="tag-item" style="background-color: rgb(158, 29, 66); color: rgb(255, 255, 255);">Mature</div>
                                                                       </div>`
                                                                    : ``
                                                                    }
                                                                </div>
                                                                <ul class="new-story-stats" style="">
                                                                    <li class="stats-item">
                                                                        <div class="stats-label">
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg><span class="stats-label__text" aria-hidden="true">Reads</span>
                                                                        </div>
                                                                        <span class="sr-only">Reads 36,459,162</span>
                                                                        <div class="icon-container" aria-hidden="true">
                                                                            <div data-tip="36,459,162" class="tool-tip">
                                                                                <span class="sr-only">36,459,162</span>
                                                                                <span class="stats-value" aria-hidden="true">${story.views}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li class="stats-item">
                                                                        <div class="stats-label">
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg>
                                                                            <span class="stats-label__text" aria-hidden="true">Votes</span>
                                                                        </div>
                                                                        <span class="sr-only">Votes 1,019,382</span>
                                                                        <div class="icon-container" aria-hidden="true">
                                                                            <div data-tip="1,019,382" class="tool-tip">
                                                                                <span class="sr-only">1,019,382</span>
                                                                                <span class="stats-value" aria-hidden="true">${story.likes}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li class="stats-item">
                                                                        <div class="stats-label">
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.33366 4.66634C3.70185 4.66634 4.00033 4.36786 4.00033 3.99967C4.00033 3.63148 3.70185 3.33301 3.33366 3.33301C2.96547 3.33301 2.66699 3.63148 2.66699 3.99967C2.66699 4.36786 2.96547 4.66634 3.33366 4.66634ZM4.00033 7.99967C4.00033 8.36786 3.70185 8.66634 3.33366 8.66634C2.96547 8.66634 2.66699 8.36786 2.66699 7.99967C2.66699 7.63148 2.96547 7.33301 3.33366 7.33301C3.70185 7.33301 4.00033 7.63148 4.00033 7.99967ZM4.00033 11.9997C4.00033 12.3679 3.70185 12.6663 3.33366 12.6663C2.96547 12.6663 2.66699 12.3679 2.66699 11.9997C2.66699 11.6315 2.96547 11.333 3.33366 11.333C3.70185 11.333 4.00033 11.6315 4.00033 11.9997ZM6.00033 7.99967C6.00033 8.36786 6.2988 8.66634 6.66699 8.66634H12.667C13.0352 8.66634 13.3337 8.36786 13.3337 7.99967C13.3337 7.63148 13.0352 7.33301 12.667 7.33301H6.66699C6.2988 7.33301 6.00033 7.63148 6.00033 7.99967ZM6.66699 12.6663C6.2988 12.6663 6.00033 12.3679 6.00033 11.9997C6.00033 11.6315 6.2988 11.333 6.66699 11.333H12.667C13.0352 11.333 13.3337 11.6315 13.3337 11.9997C13.3337 12.3679 13.0352 12.6663 12.667 12.6663H6.66699ZM6.00033 3.99967C6.00033 4.36786 6.2988 4.66634 6.66699 4.66634H12.667C13.0352 4.66634 13.3337 4.36786 13.3337 3.99967C13.3337 3.63148 13.0352 3.33301 12.667 3.33301H6.66699C6.2988 3.33301 6.00033 3.63148 6.00033 3.99967Z"></path></g></svg>
                                                                            <span class="stats-label__text" aria-hidden="true">Parts</span>
                                                                        </div>
                                                                        <span class="sr-only">Parts 44</span>
                                                                        <div class="icon-container" aria-hidden="true">
                                                                            <div data-tip="44" class="tool-tip">
                                                                                <span class="sr-only">44</span>
                                                                                <span class="stats-value" aria-hidden="true">${story.parts}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
<!--                                                                    <li class="stats-item">-->
<!--                                                                        <div class="stats-label">-->
<!--                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M1.7998 1.91992C1.52366 1.91992 1.2998 2.14378 1.2998 2.41992V11.72C1.2998 11.9962 1.52366 12.22 1.7998 12.22H6.13985C6.50055 12.22 6.84648 12.3633 7.10153 12.6184C7.3518 12.8686 7.49446 13.2064 7.49972 13.5598V13.58C7.49972 13.8562 7.72358 14.08 7.99972 14.08C7.99977 14.08 7.99983 14.08 7.99987 14.08C8.27602 14.08 8.49987 13.8562 8.49987 13.58V13.5598C8.50514 13.2064 8.6478 12.8686 8.89806 12.6184C9.15312 12.3633 9.49904 12.22 9.85975 12.22H14.1998C14.4759 12.22 14.6998 11.9962 14.6998 11.72V2.41992C14.6998 2.14378 14.4759 1.91992 14.1998 1.91992H10.4798C9.6894 1.91992 8.93142 2.23389 8.37255 2.79275C8.23258 2.93273 8.10796 3.0852 7.9998 3.24754C7.89163 3.0852 7.76702 2.93273 7.62704 2.79275C7.06818 2.23389 6.3102 1.91992 5.51985 1.91992H1.7998ZM8.49987 11.6512V4.89995C8.49987 4.89362 8.49985 4.8873 8.49981 4.88097C8.50478 4.36269 8.71281 3.86671 9.07966 3.49986C9.45099 3.12853 9.95462 2.91992 10.4798 2.91992H13.6998V11.22H9.85975C9.3696 11.22 8.89517 11.3725 8.49987 11.6512ZM7.49978 4.88097C7.49482 4.36269 7.28679 3.86671 6.91994 3.49986C6.54861 3.12853 6.04498 2.91992 5.51985 2.91992H2.2998V11.22H6.13985C6.63 11.22 7.10443 11.3725 7.49972 11.6512V4.89995C7.49972 4.89362 7.49974 4.8873 7.49978 4.88097Z" fill="#686868"></path></g></svg>-->
<!--                                                                            <span class="stats-label__text" aria-hidden="true">Time</span>-->
<!--                                                                        </div>-->
<!--                                                                        <span class="sr-only">Time 4h 39m</span>-->
<!--                                                                        <div class="icon-container" aria-hidden="true">-->
<!--                                                                            <div data-tip="4 hours, 39 minutes" class="tool-tip">-->
<!--                                                                                <span class="sr-only">4 hours, 39 minutes</span>-->
<!--                                                                                <span class="stats-value" aria-hidden="true">4h 39m</span>-->
<!--                                                                            </div>-->
<!--                                                                        </div>-->
<!--                                                                    </li>-->
                                                                </ul>
                                                                <div class="description">${story.storyDescription}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>`;

                $('#story-container').append(s);
            }

            if (searchResponse.areMoreStoriesAvailable == 1) {
                $('#btn-container').show();

                let result = `<div class="results">You are seeing <strong></strong>${searchResponse.genreStoryDTOList.length} of <strong>${searchResponse.totalStoriesCount}</strong> results</div>`;
                $('#btn-container .results').remove();
                $('#btn-container').append(result);
            }
            else {
                $('#btn-container').hide();
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

loadAllStoriesThatMatchToSearchedKeyWord();



let noOfStories = 15;
$(document).on('click','.btn-load-more.load-more',function (event) {

    noOfStories+=15;
    helperStoriesLoad();
});
async function helperStoriesLoad() {

    let search = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("search")) {
        search = params.get("search");
    }

    if(search==null){
        //load chapter not found page
        return;
    }

    $('#searched-keyword').text('"'+search+'"');

    await fetch('http://localhost:8080/api/v1/search/by/'+encodeURIComponent(search)+'/'+noOfStories, {
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

            let searchResponse = data.data;

            $('.stories-tab').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search-stories-page.html?search=${search}`);
            $('.profiles-tag').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search-profile-page.html?search=${search}`);

            $('#total-story-count').text(searchResponse.totalStoriesCount+' results');

            $('#tags-container').empty();
            for (let i = 0; i < searchResponse.tags.length; i++) {

                let tag = searchResponse.tags[i];
                let t = `<li data-tag="${tag}" class="single-tag"><div class="tag-pill__yrFxu refine-by-tag" role="button" aria-label="filter by alpha" aria-describedby="screen-reader-description" style="color: rgb(18, 18, 18);">${tag}</div></li>`;
                $('#tags-container').append(t);
            }

            $('#story-container').empty();
            for (let i = 0; i < searchResponse.genreStoryDTOList.length; i++) {

                let story = searchResponse.genreStoryDTOList[i];
                let s = `
                                                <!--single story-->
                                                <li style="width: 100%;" class="list-group-item">
                                                    <a class="story-card" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}">
                                                        <div style="width: 630px;" class="story-card-data hidden-xxs">
                                                            <div class="cover">
                                                                <img style="object-fit: cover;" src="${story.coverImagePath}" alt="">
                                                            </div>
                                                            <div style="width: 460px;" class="story-info">
                                                                <span class="sr-only">${story.storyTitle}</span>
                                                                <div class="title" aria-hidden="true">${story.storyTitle}</div>
                                                                <span class="sr-only">  Complete </span>
                                                                <div class="icon-bar" aria-hidden="true">
                                                                    ${story.status === 1
                    ? `<div class="completed">
                                                                        <div class="tag-item" style="background-color: rgb(28, 111, 101); color: rgb(255, 255, 255);">Complete</div>
                                                                       </div>`
                    : ``
                }
                                                                    ${story.rating === 1
                    ? `<div class="completed">
                                                                        <div class="tag-item" style="background-color: rgb(158, 29, 66); color: rgb(255, 255, 255);">Mature</div>
                                                                       </div>`
                    : ``
                }
                                                                </div>
                                                                <ul class="new-story-stats" style="">
                                                                    <li class="stats-item">
                                                                        <div class="stats-label">
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg><span class="stats-label__text" aria-hidden="true">Reads</span>
                                                                        </div>
                                                                        <span class="sr-only">Reads 36,459,162</span>
                                                                        <div class="icon-container" aria-hidden="true">
                                                                            <div data-tip="36,459,162" class="tool-tip">
                                                                                <span class="sr-only">36,459,162</span>
                                                                                <span class="stats-value" aria-hidden="true">${story.views}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li class="stats-item">
                                                                        <div class="stats-label">
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg>
                                                                            <span class="stats-label__text" aria-hidden="true">Votes</span>
                                                                        </div>
                                                                        <span class="sr-only">Votes 1,019,382</span>
                                                                        <div class="icon-container" aria-hidden="true">
                                                                            <div data-tip="1,019,382" class="tool-tip">
                                                                                <span class="sr-only">1,019,382</span>
                                                                                <span class="stats-value" aria-hidden="true">${story.likes}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li class="stats-item">
                                                                        <div class="stats-label">
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.33366 4.66634C3.70185 4.66634 4.00033 4.36786 4.00033 3.99967C4.00033 3.63148 3.70185 3.33301 3.33366 3.33301C2.96547 3.33301 2.66699 3.63148 2.66699 3.99967C2.66699 4.36786 2.96547 4.66634 3.33366 4.66634ZM4.00033 7.99967C4.00033 8.36786 3.70185 8.66634 3.33366 8.66634C2.96547 8.66634 2.66699 8.36786 2.66699 7.99967C2.66699 7.63148 2.96547 7.33301 3.33366 7.33301C3.70185 7.33301 4.00033 7.63148 4.00033 7.99967ZM4.00033 11.9997C4.00033 12.3679 3.70185 12.6663 3.33366 12.6663C2.96547 12.6663 2.66699 12.3679 2.66699 11.9997C2.66699 11.6315 2.96547 11.333 3.33366 11.333C3.70185 11.333 4.00033 11.6315 4.00033 11.9997ZM6.00033 7.99967C6.00033 8.36786 6.2988 8.66634 6.66699 8.66634H12.667C13.0352 8.66634 13.3337 8.36786 13.3337 7.99967C13.3337 7.63148 13.0352 7.33301 12.667 7.33301H6.66699C6.2988 7.33301 6.00033 7.63148 6.00033 7.99967ZM6.66699 12.6663C6.2988 12.6663 6.00033 12.3679 6.00033 11.9997C6.00033 11.6315 6.2988 11.333 6.66699 11.333H12.667C13.0352 11.333 13.3337 11.6315 13.3337 11.9997C13.3337 12.3679 13.0352 12.6663 12.667 12.6663H6.66699ZM6.00033 3.99967C6.00033 4.36786 6.2988 4.66634 6.66699 4.66634H12.667C13.0352 4.66634 13.3337 4.36786 13.3337 3.99967C13.3337 3.63148 13.0352 3.33301 12.667 3.33301H6.66699C6.2988 3.33301 6.00033 3.63148 6.00033 3.99967Z"></path></g></svg>
                                                                            <span class="stats-label__text" aria-hidden="true">Parts</span>
                                                                        </div>
                                                                        <span class="sr-only">Parts 44</span>
                                                                        <div class="icon-container" aria-hidden="true">
                                                                            <div data-tip="44" class="tool-tip">
                                                                                <span class="sr-only">44</span>
                                                                                <span class="stats-value" aria-hidden="true">${story.parts}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
<!--                                                                    <li class="stats-item">-->
<!--                                                                        <div class="stats-label">-->
<!--                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M1.7998 1.91992C1.52366 1.91992 1.2998 2.14378 1.2998 2.41992V11.72C1.2998 11.9962 1.52366 12.22 1.7998 12.22H6.13985C6.50055 12.22 6.84648 12.3633 7.10153 12.6184C7.3518 12.8686 7.49446 13.2064 7.49972 13.5598V13.58C7.49972 13.8562 7.72358 14.08 7.99972 14.08C7.99977 14.08 7.99983 14.08 7.99987 14.08C8.27602 14.08 8.49987 13.8562 8.49987 13.58V13.5598C8.50514 13.2064 8.6478 12.8686 8.89806 12.6184C9.15312 12.3633 9.49904 12.22 9.85975 12.22H14.1998C14.4759 12.22 14.6998 11.9962 14.6998 11.72V2.41992C14.6998 2.14378 14.4759 1.91992 14.1998 1.91992H10.4798C9.6894 1.91992 8.93142 2.23389 8.37255 2.79275C8.23258 2.93273 8.10796 3.0852 7.9998 3.24754C7.89163 3.0852 7.76702 2.93273 7.62704 2.79275C7.06818 2.23389 6.3102 1.91992 5.51985 1.91992H1.7998ZM8.49987 11.6512V4.89995C8.49987 4.89362 8.49985 4.8873 8.49981 4.88097C8.50478 4.36269 8.71281 3.86671 9.07966 3.49986C9.45099 3.12853 9.95462 2.91992 10.4798 2.91992H13.6998V11.22H9.85975C9.3696 11.22 8.89517 11.3725 8.49987 11.6512ZM7.49978 4.88097C7.49482 4.36269 7.28679 3.86671 6.91994 3.49986C6.54861 3.12853 6.04498 2.91992 5.51985 2.91992H2.2998V11.22H6.13985C6.63 11.22 7.10443 11.3725 7.49972 11.6512V4.89995C7.49972 4.89362 7.49974 4.8873 7.49978 4.88097Z" fill="#686868"></path></g></svg>-->
<!--                                                                            <span class="stats-label__text" aria-hidden="true">Time</span>-->
<!--                                                                        </div>-->
<!--                                                                        <span class="sr-only">Time 4h 39m</span>-->
<!--                                                                        <div class="icon-container" aria-hidden="true">-->
<!--                                                                            <div data-tip="4 hours, 39 minutes" class="tool-tip">-->
<!--                                                                                <span class="sr-only">4 hours, 39 minutes</span>-->
<!--                                                                                <span class="stats-value" aria-hidden="true">4h 39m</span>-->
<!--                                                                            </div>-->
<!--                                                                        </div>-->
<!--                                                                    </li>-->
                                                                </ul>
                                                                <div class="description">${story.storyDescription}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>`;

                $('#story-container').append(s);
            }

            if (searchResponse.areMoreStoriesAvailable == 1) {
                $('#btn-container').show();

                let result = `<div class="results">You are seeing <strong></strong>${searchResponse.genreStoryDTOList.length} of <strong>${searchResponse.totalStoriesCount}</strong> results</div>`;
                $('#btn-container .results').remove();
                $('#btn-container').append(result);
            }
            else {
                $('#btn-container').hide();
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




let length = 'anyLength';
let time = 'anytime';
let content = null;
let tags = [];

let criteria = {
    'storyCount': 15,
    'length': length,
    'time': time,
    'content': content,
    'tags': tags,
};


let checkBoxLength = $('.checkbox-length');

checkBoxLength.each(function (index, element) {
    $(element).on('change', function () {
        let siblingDiv = $(this).next('div');

        if (this.checked) {

            $('#filter-length .checked')
                .removeClass('checked')
                .find('svg')
                .remove();

            siblingDiv.addClass('checked');
            let svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L9.70711 17.7071C9.31658 18.0976 8.68342 18.0976 8.29289 17.7071L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929C3.68342 10.9024 4.31658 10.9024 4.70711 11.2929L9 15.5858L19.2929 5.29289C19.6834 4.90237 20.3166 4.90237 20.7071 5.29289Z"></path></g></svg>`;
            siblingDiv.prepend(svg);

            length = this.value;
            criteria.length = length;

            loadAllStoriesThatMatchToSearchedKeyWordAndCriteria(criteria)
        }
        else {
            // siblingDiv.removeClass('checked');
            // siblingDiv.find('svg').remove();
        }
    });
});




let checkBoxTime = $('.checkbox-time');

checkBoxTime.each(function (index, element) {
    $(element).on('change', function () {
        let siblingDiv = $(this).next('div');

        if (this.checked) {

            $('#filter-time .checked')
                .removeClass('checked')
                .find('svg')
                .remove();

            siblingDiv.addClass('checked');
            let svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L9.70711 17.7071C9.31658 18.0976 8.68342 18.0976 8.29289 17.7071L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929C3.68342 10.9024 4.31658 10.9024 4.70711 11.2929L9 15.5858L19.2929 5.29289C19.6834 4.90237 20.3166 4.90237 20.7071 5.29289Z"></path></g></svg>`;
            siblingDiv.prepend(svg);

            time = this.value;
            criteria.time = time;

            loadAllStoriesThatMatchToSearchedKeyWordAndCriteria(criteria)
        }
        else {
            // siblingDiv.removeClass('checked');
            // siblingDiv.find('svg').remove();
        }
    });
});




let checkBoxContent = $('.checkbox-content');

checkBoxContent.each(function (index, element) {
    $(element).on('change', function () {
        let siblingDiv = $(this).next('div');

        if (this.checked) {

            $('#filter-content .checked')
                .removeClass('checked')
                .find('svg')
                .remove();

            siblingDiv.addClass('checked');
            let svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M20.7071 5.29289C21.0976 5.68342 21.0976 6.31658 20.7071 6.70711L9.70711 17.7071C9.31658 18.0976 8.68342 18.0976 8.29289 17.7071L3.29289 12.7071C2.90237 12.3166 2.90237 11.6834 3.29289 11.2929C3.68342 10.9024 4.31658 10.9024 4.70711 11.2929L9 15.5858L19.2929 5.29289C19.6834 4.90237 20.3166 4.90237 20.7071 5.29289Z"></path></g></svg>`;
            siblingDiv.prepend(svg);

            content = this.value;
            criteria.content = content;
            console.log(criteria);

            loadAllStoriesThatMatchToSearchedKeyWordAndCriteria(criteria)
        }
        else {
            // siblingDiv.removeClass('checked');
            // siblingDiv.find('svg').remove();
        }
    });
});



$(document).on('click','.single-tag',function (event) {

    let tag = $(this).data('tag');

    let index = criteria.tags.indexOf(tag);

    if (index === -1) {
        criteria.tags.push(tag);
        $(this).find('div').css('background-color','#000000');
        $(this).find('div').css('color','#fff');

        loadAllStoriesThatMatchToSearchedKeyWordAndCriteria(criteria)

    } else {
        criteria.tags.splice(index, 1);
        $(this).find('div').css('background-color','var(--ds-neutral-40, rgba(18, 18, 18, .12))');
        $(this).find('div').css('color','#222');

        loadAllStoriesThatMatchToSearchedKeyWordAndCriteria(criteria)
    }

});





//load all stories that match to searched keyword
async function loadAllStoriesThatMatchToSearchedKeyWordAndCriteria(criteria) {

    let search = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("search")) {
        search = params.get("search");
    }

    if(search==null){
        // load chapter not found page
        return;
    }

    $('#searched-keyword').text('"'+search+'"');

    await fetch('http://localhost:8080/api/v1/search/by/criteria/'+encodeURIComponent(search), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(criteria)

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

            let searchResponse = data.data;

            // $('#total-story-count').text(searchResponse.totalStoriesCount+' results');
            //
            // $('#tags-container').empty();
            // for (let i = 0; i < searchResponse.tags.length; i++) {
            //
            //     let tag = searchResponse.tags[i];
            //     let t = `<li data-tag="${tag}" class="single-tag"><div class="tag-pill__yrFxu refine-by-tag" role="button" aria-label="filter by alpha" aria-describedby="screen-reader-description" style="color: rgb(18, 18, 18);">${tag}</div></li>`;
            //     $('#tags-container').append(t);
            // }

            $('#story-container').empty();
            for (let i = 0; i < searchResponse.genreStoryDTOList.length; i++) {

                let story = searchResponse.genreStoryDTOList[i];
                let s = `
                                                <!--single story-->
                                                <li style="width: 100%;" class="list-group-item">
                                                    <a class="story-card" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}">
                                                        <div style="width: 630px;" class="story-card-data hidden-xxs">
                                                            <div class="cover">
                                                                <img style="object-fit: cover;" src="${story.coverImagePath}" alt="">
                                                            </div>
                                                            <div style="width: 460px;" class="story-info">
                                                                <span class="sr-only">${story.storyTitle}</span>
                                                                <div class="title" aria-hidden="true">${story.storyTitle}</div>
                                                                <span class="sr-only">  Complete </span>
                                                                <div class="icon-bar" aria-hidden="true">
                                                                    ${story.status === 1
                                                                    ? `<div class="completed">
                                                                        <div class="tag-item" style="background-color: rgb(28, 111, 101); color: rgb(255, 255, 255);">Complete</div>
                                                                       </div>`
                                                                    : ``
                                                                    }
                                                                    ${story.rating === 1
                                                                    ? `<div class="completed">
                                                                        <div class="tag-item" style="background-color: rgb(158, 29, 66); color: rgb(255, 255, 255);">Mature</div>
                                                                       </div>`
                                                                    : ``
                                                                    }
                                                                </div>
                                                                <ul class="new-story-stats" style="">
                                                                    <li class="stats-item">
                                                                        <div class="stats-label">
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg><span class="stats-label__text" aria-hidden="true">Reads</span>
                                                                        </div>
                                                                        <span class="sr-only">Reads 36,459,162</span>
                                                                        <div class="icon-container" aria-hidden="true">
                                                                            <div data-tip="36,459,162" class="tool-tip">
                                                                                <span class="sr-only">36,459,162</span>
                                                                                <span class="stats-value" aria-hidden="true">${story.views}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li class="stats-item">
                                                                        <div class="stats-label">
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg>
                                                                            <span class="stats-label__text" aria-hidden="true">Votes</span>
                                                                        </div>
                                                                        <span class="sr-only">Votes 1,019,382</span>
                                                                        <div class="icon-container" aria-hidden="true">
                                                                            <div data-tip="1,019,382" class="tool-tip">
                                                                                <span class="sr-only">1,019,382</span>
                                                                                <span class="stats-value" aria-hidden="true">${story.likes}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li class="stats-item">
                                                                        <div class="stats-label">
                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.33366 4.66634C3.70185 4.66634 4.00033 4.36786 4.00033 3.99967C4.00033 3.63148 3.70185 3.33301 3.33366 3.33301C2.96547 3.33301 2.66699 3.63148 2.66699 3.99967C2.66699 4.36786 2.96547 4.66634 3.33366 4.66634ZM4.00033 7.99967C4.00033 8.36786 3.70185 8.66634 3.33366 8.66634C2.96547 8.66634 2.66699 8.36786 2.66699 7.99967C2.66699 7.63148 2.96547 7.33301 3.33366 7.33301C3.70185 7.33301 4.00033 7.63148 4.00033 7.99967ZM4.00033 11.9997C4.00033 12.3679 3.70185 12.6663 3.33366 12.6663C2.96547 12.6663 2.66699 12.3679 2.66699 11.9997C2.66699 11.6315 2.96547 11.333 3.33366 11.333C3.70185 11.333 4.00033 11.6315 4.00033 11.9997ZM6.00033 7.99967C6.00033 8.36786 6.2988 8.66634 6.66699 8.66634H12.667C13.0352 8.66634 13.3337 8.36786 13.3337 7.99967C13.3337 7.63148 13.0352 7.33301 12.667 7.33301H6.66699C6.2988 7.33301 6.00033 7.63148 6.00033 7.99967ZM6.66699 12.6663C6.2988 12.6663 6.00033 12.3679 6.00033 11.9997C6.00033 11.6315 6.2988 11.333 6.66699 11.333H12.667C13.0352 11.333 13.3337 11.6315 13.3337 11.9997C13.3337 12.3679 13.0352 12.6663 12.667 12.6663H6.66699ZM6.00033 3.99967C6.00033 4.36786 6.2988 4.66634 6.66699 4.66634H12.667C13.0352 4.66634 13.3337 4.36786 13.3337 3.99967C13.3337 3.63148 13.0352 3.33301 12.667 3.33301H6.66699C6.2988 3.33301 6.00033 3.63148 6.00033 3.99967Z"></path></g></svg>
                                                                            <span class="stats-label__text" aria-hidden="true">Parts</span>
                                                                        </div>
                                                                        <span class="sr-only">Parts 44</span>
                                                                        <div class="icon-container" aria-hidden="true">
                                                                            <div data-tip="44" class="tool-tip">
                                                                                <span class="sr-only">44</span>
                                                                                <span class="stats-value" aria-hidden="true">${story.parts}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
<!--                                                                    <li class="stats-item">-->
<!--                                                                        <div class="stats-label">-->
<!--                                                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M1.7998 1.91992C1.52366 1.91992 1.2998 2.14378 1.2998 2.41992V11.72C1.2998 11.9962 1.52366 12.22 1.7998 12.22H6.13985C6.50055 12.22 6.84648 12.3633 7.10153 12.6184C7.3518 12.8686 7.49446 13.2064 7.49972 13.5598V13.58C7.49972 13.8562 7.72358 14.08 7.99972 14.08C7.99977 14.08 7.99983 14.08 7.99987 14.08C8.27602 14.08 8.49987 13.8562 8.49987 13.58V13.5598C8.50514 13.2064 8.6478 12.8686 8.89806 12.6184C9.15312 12.3633 9.49904 12.22 9.85975 12.22H14.1998C14.4759 12.22 14.6998 11.9962 14.6998 11.72V2.41992C14.6998 2.14378 14.4759 1.91992 14.1998 1.91992H10.4798C9.6894 1.91992 8.93142 2.23389 8.37255 2.79275C8.23258 2.93273 8.10796 3.0852 7.9998 3.24754C7.89163 3.0852 7.76702 2.93273 7.62704 2.79275C7.06818 2.23389 6.3102 1.91992 5.51985 1.91992H1.7998ZM8.49987 11.6512V4.89995C8.49987 4.89362 8.49985 4.8873 8.49981 4.88097C8.50478 4.36269 8.71281 3.86671 9.07966 3.49986C9.45099 3.12853 9.95462 2.91992 10.4798 2.91992H13.6998V11.22H9.85975C9.3696 11.22 8.89517 11.3725 8.49987 11.6512ZM7.49978 4.88097C7.49482 4.36269 7.28679 3.86671 6.91994 3.49986C6.54861 3.12853 6.04498 2.91992 5.51985 2.91992H2.2998V11.22H6.13985C6.63 11.22 7.10443 11.3725 7.49972 11.6512V4.89995C7.49972 4.89362 7.49974 4.8873 7.49978 4.88097Z" fill="#686868"></path></g></svg>-->
<!--                                                                            <span class="stats-label__text" aria-hidden="true">Time</span>-->
<!--                                                                        </div>-->
<!--                                                                        <span class="sr-only">Time 4h 39m</span>-->
<!--                                                                        <div class="icon-container" aria-hidden="true">-->
<!--                                                                            <div data-tip="4 hours, 39 minutes" class="tool-tip">-->
<!--                                                                                <span class="sr-only">4 hours, 39 minutes</span>-->
<!--                                                                                <span class="stats-value" aria-hidden="true">4h 39m</span>-->
<!--                                                                            </div>-->
<!--                                                                        </div>-->
<!--                                                                    </li>-->
                                                                </ul>
                                                                <div class="description">${story.storyDescription}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </li>`;

                $('#story-container').append(s);
            }

            // if (searchResponse.areMoreStoriesAvailable == 1) {
            //     $('#btn-container').show();
            //
            //     let result = `<div class="results">You are seeing <strong></strong>${searchResponse.genreStoryDTOList.length} of <strong>${searchResponse.totalStoriesCount}</strong> results</div>`;
            //     $('#btn-container .results').remove();
            //     $('#btn-container').append(result);
            // }
            // else {
            //     $('#btn-container').hide();
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

















