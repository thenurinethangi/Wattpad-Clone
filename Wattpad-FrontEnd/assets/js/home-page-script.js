//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/home', {
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



//load your stories
let yourStoryExist = true;
async function loadYourStories() {
    await fetch('http://localhost:8080/home/yourStories', {
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

            if (libraryStories.length <= 0) {
                yourStoryExist = false;
                return;
            }

            let yourStoryContainer = `
<!-- ------------------you story section - where your library reason opened story have---------------- -->
            <div class="iLjsG">
                <div class="_7wY3G" data-testid="swimlane">
                    <div>
                        <header class="By7SK">
                            <div class="I1aID">
                                <h3 class="iA8-j" data-testid="heading">Your stories</h3>
                            </div>
                        </header>
                        <div class="splide ah4a1 is-overflow is-initialized splide--slide splide--ltr splide--draggable is-active scroll-override" data-testid="carousel" id="splide02" role="region" aria-roledescription="carousel">
                            <!--you story section stories place container-->
                            <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide02-track" style="padding-left: 0px; padding-right: 0px;" aria-live="polite" aria-atomic="true">
                                <ul class="splide__list" id="splide02-list" role="presentation" style="transform: translateX(0px);">
                                    ${libraryStories.map(libraryStory => `
                                        <!--single library story-->
                                        <li class="splide__slide is-active is-visible" style="margin-right: 8px; width: 125px; height: 238px">
                                            <a class="CJILD" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${libraryStory.lastReadChapterId}">
                                            <div class="F0IAU">
                                                <div class="W-SYx coverWrapper__t2Ve8" data-testid="cover">
                                                    <img class="cover__BlyZa flexible__bq0Qp" src="${libraryStory.coverImagePath}" alt="𝕃𝕠𝕧𝕖 𝔼𝕞𝕓𝕣𝕒𝕔𝕖 ᵒⁿʰᵒˡᵈ cover" data-testid="image">
                                                </div>
                                                <!--a1-->
                                                <div class="_85nDW">
                                                    <div class="NtAtJ">
                                                        <div class="progress_bar__ja0_4" role="progressbar" aria-labelledby="progress-bar-label-353771202" style="width: 100%; height: 2px;">
                                                            <div class="progress_bar_value__rnwN9 progress__WYcqd" style="width: ${(libraryStory.lastOpenedPage / libraryStory.parts) * 100}%;"></div>
                                                            <div class="progress_bar_value__rnwN9 default__sk_o3" style="width: 5.88235%;"></div>
                                                        </div>
                                                        <p hidden="">${libraryStory.lastOpenedPage} parts read, ${libraryStory.parts} parts total</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <!--a2-->
                                            <div class="iPYom">
                                                ${libraryStory.newPartCount > 0
                ? `<span class="xFBFH">${libraryStory.newPartCount} new part</span>`
                : `<span class="xFBFH">Continue</span>`
            }
                                                <span class="Uy8k-">Part ${libraryStory.lastOpenedPage}</span>
                                            </div>
                                        </a>
                                    </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`;

            $('#scroll-div').append(yourStoryContainer);

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
// loadYourStories();




//load top pick up story for user
let topPickupForYou = true;
let topPickupStories = null;
async function loadTopPickupForYou() {
    await fetch('http://localhost:8080/home/topPickupForYou', {
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

            topPickupStories = data.data;

            if (topPickupStories.length <= 0) {
                topPickupForYou = false;
                return;
            }

            let topPickupStoryContainer = `
            <!-- ---------------top pick for you section - where story match/selected to you genre have------------------ -->
            <div class="iLjsG">
                <div class="_7wY3G" data-testid="swimlane">
                    <div>
                        <header class="By7SK">
                            <div class="I1aID">
                                <h3 class="iA8-j" data-testid="heading">Top picks for you</h3>
                            </div>
                        </header>
                        <div class="splide ah4a1 is-overflow is-initialized splide--slide splide--ltr splide--draggable is-active scroll-override" data-testid="carousel" id="splide03" role="region" aria-roledescription="carousel">
                            <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide03-track" style="padding-left: 0px; padding-right: 0px;" aria-live="polite" aria-atomic="true">
                                <ul class="splide__list" id="splide03-list" role="presentation" style="transform: translateX(0px);">
                                    ${topPickupStories.map(story => `
                                        <li class="splide__slide is-active is-visible" role="group" aria-roledescription="slide" aria-label="1 of 10" style="margin-right: 8px; width: 137px; height: 246px">
                                            <div class="_72Ga-" data-testid="basicStorySlide">
                                                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}" data-testid="coverLink">
                                                    <div class="DWhiV coverWrapper__t2Ve8" data-testid="cover">
                                                        <img class="cover__BlyZa flexible__bq0Qp" src="${story.coverImagePath}" alt="cover image" data-testid="image">
                                                    </div>
                                                </a>
                                                <div class="b5x8I" data-testid="tagContainer">
                                                    <a class="pill__pziVI light-variant__fymht default-size__BJ5Po default-accent__YcamO square-shape__V66Yy clickable__llABU gap-for-default-pill__d6nVx" href="https://www.wattpad.com/stories/hoseok">
                                                        <span class="typography-label-small-semi">${story.storyTags[0]}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                        <!--slider arrow to move sliders-->
                        <div class="hero-splide__arrows splide__arrows _4iubE splide__arrows--ltr">
                            <button class="splide__arrow--prev aGvHp T7oH6" aria-label="Previous slide" aria-controls="splide01-track">
                                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false">
                                    <title id="">WpChevronRight</title>
                                    <path d="M13.388 12.5 8.756 7.585a.97.97 0 0 1 0-1.313.84.84 0 0 1 1.238 0l5.25 5.571a.97.97 0 0 1 0 1.314l-5.25 5.571a.84.84 0 0 1-1.238 0 .97.97 0 0 1 0-1.313l4.632-4.915Z" fill="#121212"></path>
                                </svg>
                            </button>
                            <button class="splide__arrow--next aGvHp rZvXs" aria-label="Next slide" aria-controls="splide01-track">
                                <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false">
                                    <title id="">WpChevronRight</title>
                                    <path d="M13.388 12.5 8.756 7.585a.97.97 0 0 1 0-1.313.84.84 0 0 1 1.238 0l5.25 5.571a.97.97 0 0 1 0 1.314l-5.25 5.571a.84.84 0 0 1-1.238 0 .97.97 0 0 1 0-1.313l4.632-4.915Z" fill="#121212"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
`;

            $('#scroll-div').append(topPickupStoryContainer);

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




//load most viewed wattpad story
let hotWattpadReads = true;
let hotWattpadStories = null;
async function loadHotWattpadReads() {
    await fetch('http://localhost:8080/home/hotWattpadReads', {
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

            hotWattpadStories = data.data;

            if (hotWattpadStories.length <= 0) {
                hotWattpadReads = false;
                return;
            }

            let hotWattpadStoryContainer = `
            <!-- --------------hot wattpad read section - where most viewed stories have------------- -->
            <div class="iLjsG">
                <div class="_7wY3G" data-testid="swimlane">
                    <div>
                        <header class="By7SK">
                            <h4 class="X2T-d" data-testid="subheading">Check out these fan favourites</h4>
                            <div class="I1aID">
                                <h3 class="iA8-j" data-testid="heading">Hot Wattpad Reads</h3>
                            </div>
                        </header>
                        <div class="splide ah4a1 splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized scroll-override" data-testid="carousel" id="splide04" role="region" aria-roledescription="carousel">
                            <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide04-track" aria-live="polite" aria-atomic="true">
                                <ul class="splide__list" id="splide04-list" role="presentation" style="transform: translateX(0px);">
                                    ${hotWattpadStories.map(story => `
                                        <li class="splide__slide is-active is-visible" role="group" aria-roledescription="slide" aria-label="1 of 23" style="margin-right: 8px; width: 137px; height: 268px;">
                                            <div class="_72Ga-" data-testid="basicStorySlide">
                                                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}" data-testid="coverLink">
                                                    <div class="DWhiV coverWrapper__t2Ve8" data-testid="cover">
                                                        <img class="cover__BlyZa flexible__bq0Qp" src="${story.coverImagePath}" alt="Raven: His First Everything cover" data-testid="image">
                                                    </div>
                                                </a>
                                                <div class="b5x8I" data-testid="tagContainer">
                                                    <a class="pill__pziVI light-variant__fymht default-size__BJ5Po default-accent__YcamO square-shape__V66Yy clickable__llABU gap-for-default-pill__d6nVx" href="https://www.wattpad.com/stories/hatetolove">
                                                        <span class="typography-label-small-semi">${story.storyTags[0]}</span>
                                                    </a>
                                                </div>
                                                <!--c1-->
                                                <div class="mDq3M BISB9 typography-paragraph-x-small" data-testid="readCount">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><mask id="path-1-inside-1_11964_339780" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.899048 8.00001C1.71312 4.83709 4.58431 2.5 8.00135 2.5C11.4184 2.5 14.2896 4.83709 15.1037 8.00001C14.2896 11.1629 11.4184 13.5 8.00135 13.5C4.58431 13.5 1.71312 11.1629 0.899048 8.00001Z"></path></mask><path d="M0.899048 8.00001L-0.263077 7.7009L-0.340062 8.00001L-0.263077 8.29912L0.899048 8.00001ZM15.1037 8.00001L16.2658 8.29912L16.3428 8.00001L16.2658 7.7009L15.1037 8.00001ZM2.06117 8.29912C2.7421 5.65351 5.14511 3.7 8.00135 3.7V1.3C4.02351 1.3 0.684146 4.02067 -0.263077 7.7009L2.06117 8.29912ZM8.00135 3.7C10.8576 3.7 13.2606 5.65351 13.9415 8.29912L16.2658 7.7009C15.3186 4.02067 11.9792 1.3 8.00135 1.3V3.7ZM13.9415 7.7009C13.2606 10.3465 10.8576 12.3 8.00135 12.3V14.7C11.9792 14.7 15.3186 11.9793 16.2658 8.29912L13.9415 7.7009ZM8.00135 12.3C5.14511 12.3 2.7421 10.3465 2.06117 7.7009L-0.263077 8.29912C0.684146 11.9793 4.02351 14.7 8.00135 14.7V12.3Z" fill="#121212" fill-opacity="0.64" mask="url(#path-1-inside-1_11964_339780)"></path><circle cx="7.99963" cy="8" r="2.4" stroke="#121212" stroke-opacity="0.64" stroke-width="1.2"></circle></svg>
                                                    <span aria-hidden="true">${story.views}</span>
                                                </div>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

            $('#scroll-div').append(hotWattpadStoryContainer);

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
// loadHotWattpadReads();




//load reading lists
let readingLists = true;
async function loadReadingLists() {
    await fetch('http://localhost:8080/home/readingLists', {
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

            let readingListsList = data.data;

            if (readingListsList.length <= 0) {
                readingLists = false;
                return;
            }

            let readingListContainer = `
            <!-- ---------------reading list from the community---------------- -->
            <div class="iLjsG">
                <div class="_7wY3G" data-testid="swimlane">
                    <div>
                        <header class="By7SK">
                            <div class="I1aID">
                                <h3 class="iA8-j" data-testid="heading">Reading lists from the community</h3>
                            </div>
                        </header>
                        <div class="splide ah4a1 splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized scroll-override" data-testid="carousel" id="splide06" role="region" aria-roledescription="carousel">
                            <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide06-track" aria-live="polite" aria-atomic="true">
                                <ul class="splide__list" id="splide06-list" role="presentation" style="transform: translateX(0px);">
                                    ${readingListsList.map(readingList => `
                                        <li class="splide__slide is-active is-visible" role="group" aria-roledescription="slide" aria-label="1 of 10" style="margin-right: 8px; width: 212px; height: 283.5px">
                                            <div class="mqxgm" data-testid="readingListSlide">
                                                <a aria-label="Contest Winners" data-discover="true" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/reading-list-page.html?readingListId=${readingList.readingListId}">
                                                    <div class="IAzmt MDIEi" style="gap: 6.25px 4px;">
                                                        <div class="zv-c6">
                                                            <div class="coverWrapper__t2Ve8" data-testid="cover">
                                                                <img class="cover__BlyZa flexible__bq0Qp" src="${readingList.storyHomeResponseDTOList[0].coverImagePath}" alt="" data-testid="image">
                                                            </div>
                                                        </div>
                                                        <div class="dyxxG">
                                                            <div class="coverWrapper__t2Ve8" data-testid="cover">
                                                                <img class="cover__BlyZa flexible__bq0Qp" src="${readingList.storyHomeResponseDTOList[1].coverImagePath}" alt="" data-testid="image">
                                                            </div>
                                                        </div>
                                                        <div class="dyxxG">
                                                            <div class="coverWrapper__t2Ve8" data-testid="cover">
                                                                <img class="cover__BlyZa flexible__bq0Qp" src="${readingList.storyHomeResponseDTOList[2].coverImagePath}" alt="" data-testid="image">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a data-discover="true" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/reading-list-page.html?readingListId=${readingList.readingListId}">
                                                    <h4 class="typography-label-large _8Fu-0">${readingList.listName}</h4>
                                                </a>
                                                <div class="Sz3nA _27CVO">
                                                    <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${readingList.userId}" aria-label="">
                                                        <img src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.profilePicPath}" aria-hidden="true" alt="" class="avatar__Ygp0_ avatar_sm__zq5iO">
                                                    </a>
                                                    <div class="af6dp dbtKO">
                                                        <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${readingList.userId}" aria-label="by action. Tap to go to the author's profile page." class="E3lMW">${readingList.username}</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

            $('#scroll-div').append(readingListContainer);

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
// loadReadingLists();




//load story from genre user like
let storiesFromGenreYouLike = true;
let storiesFromGenreYouLikeList = null;
async function loadStoriesFromGenreYouLike() {
    let data = {
        'topPickupStories': topPickupStories,
        'hotWattpadStories': hotWattpadStories
    }

    await fetch('http://localhost:8080/home/storiesFromGenreYouLike', {
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

            storiesFromGenreYouLikeList = data.data;

            if (storiesFromGenreYouLikeList.length <= 0) {
                storiesFromGenreYouLike = false;
                return;
            }

            let storiesFromGenreYouLikeStoryContainer = `
            <!-- ---------------story from genres you like---------------- -->
            <div class="iLjsG">
                <div class="_7wY3G" data-testid="swimlane">
                    <div>
                        <header class="By7SK">
                            <div class="I1aID">
                                <h3 class="iA8-j" data-testid="heading">Stories from genres you like</h3>
                            </div>
                        </header>
                        <div class="splide ah4a1 splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized scroll-override" data-testid="carousel" id="splide07" role="region" aria-roledescription="carousel">
                            <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide07-track" aria-live="polite" aria-atomic="true">
                                <ul class="splide__list" id="splide07-list" role="presentation" style="transform: translateX(0px);">
                                    ${storiesFromGenreYouLikeList.map(story => `
                                        <li class="splide__slide is-active is-visible" role="group" aria-roledescription="slide" aria-label="1 of 10" style="margin-right: 8px; width: 137px; height: 247px;">
                                            <div class="_72Ga-" data-testid="basicStorySlide">
                                                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}" data-testid="coverLink">
                                                    <div class="DWhiV coverWrapper__t2Ve8" data-testid="cover">
                                                        <img class="cover__BlyZa flexible__bq0Qp" src="${story.coverImagePath}" alt="story cover" data-testid="image">
                                                    </div>
                                                </a>
                                                <div class="b5x8I" data-testid="tagContainer">
                                                    <a class="pill__pziVI light-variant__fymht default-size__BJ5Po default-accent__YcamO square-shape__V66Yy clickable__llABU gap-for-default-pill__d6nVx" href="https://www.wattpad.com/stories/coldceojungkook">
                                                        <span class="typography-label-small-semi">${story.storyTags[0]}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

            $('#scroll-div').append(storiesFromGenreYouLikeStoryContainer);

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
// loadStoriesFromGenreYouLike();



//load story from writer like
let storiesFromWritersYouLike = true;
let storiesFromWritersYouLikeList = null;
async function loadStoriesFromWritersYouLike() {
    let data = {
        'topPickupStories': topPickupStories,
        'hotWattpadStories': hotWattpadStories,
        'storiesFromGenreYouLikeList': storiesFromGenreYouLikeList
    }

    await fetch('http://localhost:8080/home/storiesFromWritersYouLike', {
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

            storiesFromWritersYouLikeList = data.data;

            if (storiesFromWritersYouLikeList.length <= 0) {
                storiesFromWritersYouLike = false;
                return;
            }

            let storiesFromWritersYouLikeStoryContainer = `
            <!-- ---------------more stories from you already read authors other stories---------------- -->
            <div class="iLjsG">
                <div class="_7wY3G" data-testid="swimlane">
                    <div>
                        <header class="By7SK">
                            <div class="I1aID">
                                <h3 class="iA8-j" data-testid="heading">Stories from writers you like</h3>
                            </div>
                        </header>
                        <div class="splide ah4a1 is-overflow is-initialized splide--slide splide--ltr splide--draggable is-active scroll-override" data-testid="carousel" id="splide10" role="region" aria-roledescription="carousel">
                            <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide10-track" aria-live="polite" aria-atomic="true">
                                <ul class="splide__list" id="splide10-list" role="presentation" style="transform: translateX(0px);">
                                    ${storiesFromWritersYouLikeList.map(story => `
                                        <li class="splide__slide is-active is-visible" role="group" aria-roledescription="slide" aria-label="1 of 10" style="margin-right: 8px; width: 137px; height: 247px;">
                                            <div class="_72Ga-" data-testid="basicStorySlide">
                                                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}" data-testid="coverLink">
                                                    <div class="DWhiV coverWrapper__t2Ve8" data-testid="cover">
                                                        <img class="cover__BlyZa flexible__bq0Qp" src="${story.coverImagePath}" alt="story cover" data-testid="image">
                                                    </div>
                                                </a>
                                                <div class="b5x8I" data-testid="tagContainer">
                                                    <a class="pill__pziVI light-variant__fymht default-size__BJ5Po default-accent__YcamO square-shape__V66Yy clickable__llABU gap-for-default-pill__d6nVx" href="https://www.wattpad.com/stories/toptaehyung">
                                                        <span class="typography-label-small-semi">${story.storyTags[0]}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

            $('#scroll-div').append(storiesFromWritersYouLikeStoryContainer);

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
// loadStoriesFromWritersYouLike();




//rather use of featured story here use premium pick story when you add premium feature to you project. this is just tempery load
async function loadPremiumPickStories() {

    let premiumPickStoryContainer = `
        <!-- ---------------premium picks---------------- -->
        <div class="iLjsG">
            <div class="_7wY3G" data-testid="swimlane">
                <div>
                    <header class="By7SK">
                        <div class="I1aID">
                            <h3 class="iA8-j" data-testid="heading">Featured story</h3>
                        </div>
                    </header>
                    <div class="JQMJe" data-testid="detailedStorySlide">
                        <div class="g3x-S">
                            <a class="UqXpH" href="https://www.wattpad.com/story/341667763" data-testid="coverLink" style="width: 137px; height: 214px;">
                                <div class="_2l3JC coverWrapper__t2Ve8" data-testid="cover">
                                    <svg class="originalsBadge__DeXoI" width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_9677_33327)"><path d="M0 14.8361C0 14.8361 1.46284 18.251 5.66493 20.5181C9.86701 22.7851 16.9518 23.3303 21.7275 15.654C26.5033 7.97765 31.2647 0 31.2647 0H0V14.8361Z" fill="#FF500A"></path><path d="M8.18883 16.2205C10.5839 16.2205 10.9281 13.2805 12.563 10.656C12.5056 11.5882 12.563 12.42 12.7351 12.9936C13.4522 15.2453 15.9046 15.4174 17.0089 13.137C18.5865 9.91019 19.0311 9.15009 20.623 6.84109C21.6699 5.30654 20.4509 4.31697 19.0454 5.03405C18.3283 5.40693 17.1523 6.31045 15.6895 8.26091C15.9476 6.78372 15.8759 4.28829 13.7534 4.4317C12.6347 4.50341 11.1719 5.77981 9.19274 9.03535C9.3505 7.21397 9.42221 5.90889 8.61908 5.23483C8.0741 4.7759 6.78335 4.58946 6.02325 5.59337C5.26314 6.59728 5.06236 8.56208 5.14841 10.6273C5.30617 14.9441 6.82638 16.2492 8.18883 16.2492V16.2205Z" fill="white"></path></g><defs><clipPath id="clip0_9677_33327"><rect width="32" height="22" fill="white"></rect></clipPath></defs></svg>
                                    <img class="cover__BlyZa flexible__bq0Qp" src="https://img.wattpad.com/cover/341667763-256-k906064.jpg" alt="Stuck with the Enemy cover" data-testid="image">
                                </div>
                            </a>
                            <div class="_6pAAq">
                                <a class="N-8va" href="https://www.wattpad.com/story/341667763">
                                    <h5 class="uVoSO typography-label-large">Stuck with the Enemy</h5>
                                </a>
                                <div class="_1CClm">Everett Holden had sworn to live the rest of his life a single man, but his plans are disrupted when he finds himself sharing an apartment with his best friend's ex--the one woman he detests with every fiber of his being yet simultaneously desires.
                                    Standalone in the My Brother's Best Friend.
                                    ***
                                    Twenty-two-year-old Everett Holden has always had his life figured out. Being the product of wealthy parents, he knows loneliness better than most. He's grown accustomed to being the broody, miserable man desperate for love with impenetrable walls. However, when his best friend requests a favor, he finds himself sharing an apartment with the one girl he both loathes and desires above all else, the one girl he can't have.
                                    Emery Clark isn't one to give up. She's persevered through every obstacle life has thrown her and refuses to accept defeat. That is, until, she's given an eviction notice from her apartment and is forced to live with none other than Everett Holden, her ex's crotchety, grumpy best friend with an attitude licensed to kill.
                                    As she spends more time in his company, she gradually comes to a realization. Perhaps his rude behavior towards her isn't due to her allegedly taking away his closest friend, but rather because his closest friend snatched her away from him.
                                    *** Weekly Updates on Fridays. Wait &amp; read for free, or unlock with coins-the choice is yours!
                                </div>
                                <div class="YRbQ6">
                                    <div class="mDq3M SjKjG typography-paragraph-x-small" data-testid="readCount">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><mask id="path-1-inside-1_11964_339780" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.899048 8.00001C1.71312 4.83709 4.58431 2.5 8.00135 2.5C11.4184 2.5 14.2896 4.83709 15.1037 8.00001C14.2896 11.1629 11.4184 13.5 8.00135 13.5C4.58431 13.5 1.71312 11.1629 0.899048 8.00001Z"></path></mask><path d="M0.899048 8.00001L-0.263077 7.7009L-0.340062 8.00001L-0.263077 8.29912L0.899048 8.00001ZM15.1037 8.00001L16.2658 8.29912L16.3428 8.00001L16.2658 7.7009L15.1037 8.00001ZM2.06117 8.29912C2.7421 5.65351 5.14511 3.7 8.00135 3.7V1.3C4.02351 1.3 0.684146 4.02067 -0.263077 7.7009L2.06117 8.29912ZM8.00135 3.7C10.8576 3.7 13.2606 5.65351 13.9415 8.29912L16.2658 7.7009C15.3186 4.02067 11.9792 1.3 8.00135 1.3V3.7ZM13.9415 7.7009C13.2606 10.3465 10.8576 12.3 8.00135 12.3V14.7C11.9792 14.7 15.3186 11.9793 16.2658 8.29912L13.9415 7.7009ZM8.00135 12.3C5.14511 12.3 2.7421 10.3465 2.06117 7.7009L-0.263077 8.29912C0.684146 11.9793 4.02351 14.7 8.00135 14.7V12.3Z" fill="#121212" fill-opacity="0.64" mask="url(#path-1-inside-1_11964_339780)"></path><circle cx="7.99963" cy="8" r="2.4" stroke="#121212" stroke-opacity="0.64" stroke-width="1.2"></circle></svg>
                                        <span aria-hidden="true">703K</span>
                                        <span class="sr-only">703312 Reads</span>
                                    </div>
                                </div>
                                <div class="tswPf">
                                    <div class="nQb2L">
                                        <button class="scm9L button__Y70Pw primary-variant__NO4pv default-accent__Pc0Pm medium-size__CLqD3 clickable__iYXtN full-width__dXWyx with-padding__cVt72">
                                            <span class="background-overlay__mCEaX"></span>Read now
                                        </button>
                                    </div>
                                    <div class="_8dGFu">
                                        <button aria-label="Add story to..." class="iJAMX">
                                            <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" role="img" aria-labelledby="" aria-hidden="false"><title id="">WpHomeAdd</title><path d="M8 2L8 14" stroke="#121212" stroke-width="1.2" stroke-linecap="round"></path><path d="M14 8L2 8" stroke="#121212" stroke-width="1.2" stroke-linecap="round"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`

    $('#scroll-div').append(premiumPickStoryContainer);
}




// load recommendation stories
let recommendationForYou = true;
let recommendationForYouStoriesList = null;
async function loadRecommendationForYou() {
    let data = {
        'topPickupStories': topPickupStories,
        'hotWattpadStories': hotWattpadStories,
        'storiesFromGenreYouLikeList': storiesFromGenreYouLikeList,
        'storiesFromWritersYouLikeList': storiesFromWritersYouLikeList
    }

    await fetch('http://localhost:8080/home/recommendationForYou', {
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

            recommendationForYouStoriesList = data.data;

            if (recommendationForYouStoriesList.length <= 0) {
                recommendationForYou = false;
                return;
            }

            let recommendationStoryContainer = `
            <!-- ---------------recommendation for you---------------- -->
            <div class="iLjsG">
                <div class="_7wY3G" data-testid="swimlane">
                    <div>
                        <header class="By7SK">
                            <div class="I1aID">
                                <h3 class="iA8-j" data-testid="heading">Recommended for you</h3>
                            </div>
                        </header>
                        <div class="splide ah4a1 splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized scroll-override" data-testid="carousel" id="splide14" role="region" aria-roledescription="carousel">
                            <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide14-track" aria-live="polite" aria-atomic="true">
                                <ul class="splide__list" id="splide14-list" role="presentation" style="transform: translateX(0px);">
                                    ${recommendationForYouStoriesList.map(story => `
                                        <li class="splide__slide is-active is-visible" role="group" aria-roledescription="slide" aria-label="1 of 10" style="margin-right: 8px; width: 137px; height: 247px">
                                            <div class="_72Ga-" data-testid="basicStorySlide">
                                                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}" data-testid="coverLink">
                                                    <div class="DWhiV coverWrapper__t2Ve8" data-testid="cover">
                                                        <img class="cover__BlyZa flexible__bq0Qp" src="${story.coverImagePath}" alt="story cover" data-testid="image">
                                                    </div>
                                                </a>
                                                <div class="b5x8I" data-testid="tagContainer">
                                                    <a class="pill__pziVI light-variant__fymht default-size__BJ5Po default-accent__YcamO square-shape__V66Yy clickable__llABU gap-for-default-pill__d6nVx" href="https://www.wattpad.com/stories/pansyparkinson">
                                                        <span class="typography-label-small-semi">${story.storyTags[0]}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

            $('#scroll-div').append(recommendationStoryContainer);

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
// loadRecommendationForYou();




// load completed stories
let completedStories = true;
let completedStoriesList = null;
async function loadCompletedStories() {
    let data = {
        'topPickupStories': topPickupStories,
        'hotWattpadStories': hotWattpadStories,
        'storiesFromGenreYouLikeList': storiesFromGenreYouLikeList,
        'storiesFromWritersYouLikeList': storiesFromWritersYouLikeList,
        'recommendationForYouStoriesList': recommendationForYouStoriesList
    }

    await fetch('http://localhost:8080/home/completedStories', {
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

            completedStoriesList = data.data;

            if (completedStoriesList.length <= 0) {
                completedStories = false;
                return;
            }

            let completedStoryContainer = `
            <!-- ---------------complete stories---------------- -->
            <div class="iLjsG">
                <div class="_7wY3G" data-testid="swimlane">
                    <div>
                        <header class="By7SK">
                            <h4 class="X2T-d" data-testid="subheading">Binge from start to finish</h4>
                            <div class="I1aID">
                                <h3 class="iA8-j" data-testid="heading">Completed stories</h3>
                            </div>
                        </header>
                        <div class="splide ah4a1 splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized scroll-override" data-testid="carousel" id="splide16" role="region" aria-roledescription="carousel">
                            <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide16-track" aria-live="polite" aria-atomic="true">
                                <ul class="splide__list" id="splide16-list" role="presentation" style="transform: translateX(0px);">
                                    ${completedStoriesList.map(story => `
                                        <li class="splide__slide is-active is-visible" id="splide16-slide01" role="group" aria-roledescription="slide" aria-label="1 of 10" style="margin-right: 8px; width: 137px; height: 247px">
                                            <div class="_72Ga-" data-testid="basicStorySlide">
                                                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}" data-testid="coverLink">
                                                    <div class="DWhiV coverWrapper__t2Ve8" data-testid="cover">
                                                        <img class="cover__BlyZa flexible__bq0Qp" src="${story.coverImagePath}" alt="story cover" data-testid="image">
                                                    </div>
                                                </a>
                                                <div class="b5x8I" data-testid="tagContainer">
                                                    <a class="pill__pziVI light-variant__fymht default-size__BJ5Po default-accent__YcamO square-shape__V66Yy clickable__llABU gap-for-default-pill__d6nVx" href="https://www.wattpad.com/stories/kimnamjoon">
                                                        <span class="typography-label-small-semi">${story.storyTags[0]}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

            $('#scroll-div').append(completedStoryContainer);

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
// loadCompletedStories();




// load try some new stories
let trySomethingNew = true;
let trySomethingNewStoriesList = null;
async function loadTrySomethingNew() {
    let data = {
        'topPickupStories': topPickupStories,
        'hotWattpadStories': hotWattpadStories,
        'storiesFromGenreYouLikeList': storiesFromGenreYouLikeList,
        'storiesFromWritersYouLikeList': storiesFromWritersYouLikeList,
        'recommendationForYouStoriesList': recommendationForYouStoriesList,
        'completedStoriesList': completedStoriesList
    }

    await fetch('http://localhost:8080/home/trySomethingNew', {
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

            trySomethingNewStoriesList = data.data;

            if (trySomethingNewStoriesList.length <= 0) {
                trySomethingNew = false;
                return;
            }

            let trySomethingNewStoryContainer = `
            <!-- ---------------try something new---------------- -->
            <div class="iLjsG">
                <div class="_7wY3G" data-testid="swimlane">
                    <div>
                        <header class="By7SK">
                            <div class="I1aID">
                                <h3 class="iA8-j" data-testid="heading">Try Something New</h3>
                            </div>
                        </header>
                        <div class="splide ah4a1 splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized scroll-override" data-testid="carousel" id="splide21" role="region" aria-roledescription="carousel">
                            <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide21-track" aria-live="polite" aria-atomic="true">
                                <ul class="splide__list" id="splide21-list" role="presentation" style="transform: translateX(0px);">
                                    ${trySomethingNewStoriesList.map(story => `
                                        <li class="splide__slide is-active is-visible" role="group" aria-roledescription="slide" aria-label="1 of 10" style="margin-right: 8px; width: 137px; height: 247px;">
                                            <div class="_72Ga-" data-testid="basicStorySlide">
                                                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.storyId}" data-testid="coverLink">
                                                    <div class="DWhiV coverWrapper__t2Ve8" data-testid="cover">
                                                        <img class="cover__BlyZa flexible__bq0Qp" src="${story.coverImagePath}" alt="story cover" data-testid="image">
                                                    </div>
                                                </a>
                                                <div class="b5x8I" data-testid="tagContainer">
                                                    <a class="pill__pziVI light-variant__fymht default-size__BJ5Po default-accent__YcamO square-shape__V66Yy clickable__llABU gap-for-default-pill__d6nVx" href="https://www.wattpad.com/stories/netflix">
                                                        <span class="typography-label-small-semi">${story.storyTags[0]}</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;
            $('#scroll-div').append(trySomethingNewStoryContainer);

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
// loadTrySomethingNew();




//load browse genres
async function loadBrowseGenres() {
    let browserGenreContainer = `
        <!-- ---------------browse genres---------------- -->
        <div class="iLjsG">
            <div class="_7wY3G" data-testid="swimlane">
                <div>
                    <header class="By7SK">
                        <div class="I1aID">
                            <h3 class="iA8-j" data-testid="heading">Browse genres</h3>
                        </div>
                    </header>
                    <div class="splide ah4a1 splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized scroll-override" data-testid="carousel" id="splide22" role="region" aria-roledescription="carousel">
                        <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide22-track" aria-live="polite" aria-atomic="true">
                            <ul class="splide__list" id="splide22-list" role="presentation" style="transform: translateX(0px);">
                                <li class="splide__slide LH-JU is-active is-visible" role="group" aria-roledescription="slide" aria-label="1 of 23" style="margin-right: 8px; width: calc(50% - 4px);">
                                    <div class="WS31f">
                                        <a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Romance">
                                            <img src="https://static.wattpad.com/image/romance-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt="">
                                            <span class="typography-label-small-semi">Romance</span>
                                        </a>
                                    </div>
                                </li>
                                <li class="splide__slide LH-JU is-visible is-next" role="group" aria-roledescription="slide" aria-label="2 of 23" style="margin-right: 8px; width: calc(50% - 4px);">
                                    <div class="WS31f">
                                        <a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Fanfiction">
                                            <img src="https://static.wattpad.com/image/fanfic-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt="">
                                            <span class="typography-label-small-semi">Fanfiction</span>
                                        </a>
                                    </div>
                                </li>
                                <li class="splide__slide LH-JU is-visible" role="group" aria-roledescription="slide" aria-label="3 of 23" style="margin-right: 8px; width: calc(50% - 4px);">
                                    <div class="WS31f">
                                        <a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=LGBTQ+">
                                            <img src="https://static.wattpad.com/image/lgbt-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt="">
                                            <span class="typography-label-small-semi">LGBTQ+</span>
                                        </a>
                                    </div>
                                </li>
                                <li class="splide__slide LH-JU is-visible" role="group" aria-roledescription="slide" aria-label="4 of 23" style="margin-right: 8px; width: calc(50% - 4px);">
                                    <div class="WS31f">
                                        <a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Wattpad Originals">
                                            <img src="https://static.wattpad.com/image/paidstories-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt="">
                                            <span class="typography-label-small-semi">Wattpad Originals</span>
                                        </a>
                                    </div>
                                </li>
                                <li class="splide__slide LH-JU" role="group" aria-roledescription="slide" aria-label="5 of 23" style="margin-right: 8px; width: calc(50% - 4px);" aria-hidden="true">
                                    <div class="WS31f">
                                        <a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Werewolf" tabindex="-1">
                                            <img src="https://static.wattpad.com/image/werewolf-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt="">
                                            <span class="typography-label-small-semi">Werewolf</span>
                                        </a>
                                    </div>
                                </li>
                                <li class="splide__slide LH-JU" role="group" aria-roledescription="slide" aria-label="6 of 23" style="margin-right: 8px; width: calc(50% - 4px);" aria-hidden="true">
                                    <div class="WS31f">
                                        <a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=New Adult" tabindex="-1">
                                            <img src="https://static.wattpad.com/image/newadult-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt="">
                                            <span class="typography-label-small-semi">New Adult</span>
                                        </a>
                                    </div>
                                </li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide08" role="group" aria-roledescription="slide" aria-label="8 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Fantasy"><img src="https://static.wattpad.com/image/fantasy-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Fantasy</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide09" role="group" aria-roledescription="slide" aria-label="9 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Short Story"><img src="https://static.wattpad.com/image/shortstory-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Short Story</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible is-next" id="splide21-slide10" role="group" aria-roledescription="slide" aria-label="10 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Teen Fiction"><img src="https://static.wattpad.com/image/teenfic-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Teen Fiction</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide11" role="group" aria-roledescription="slide" aria-label="11 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Historical Fiction"><img src="https://static.wattpad.com/image/historicalfic-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Historical Fiction</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide12" role="group" aria-roledescription="slide" aria-label="12 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Paranormal"><img src="https://static.wattpad.com/image/paranormal-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Paranormal</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide14" role="group" aria-roledescription="slide" aria-label="14 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Humor"><img src="https://static.wattpad.com/image/humor-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Humor</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide15" role="group" aria-roledescription="slide" aria-label="15 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Horror"><img src="https://static.wattpad.com/image/horror-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Horror</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide16" role="group" aria-roledescription="slide" aria-label="16 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Contemporary Lit"><img src="https://static.wattpad.com/image/urban-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Contemporary Lit</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible is-next" id="splide21-slide17" role="group" aria-roledescription="slide" aria-label="17 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Diverse Lit"><img src="https://static.wattpad.com/image/diverselit-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Diverse Lit</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide18" role="group" aria-roledescription="slide" aria-label="18 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Mystery"><img src="https://static.wattpad.com/image/mystery-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Mystery</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide19" role="group" aria-roledescription="slide" aria-label="19 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Thriller"><img src="https://static.wattpad.com/image/thriller-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Thriller</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide20" role="group" aria-roledescription="slide" aria-label="20 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Science Fiction"><img src="https://static.wattpad.com/image/scifi-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Science Fiction</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide21" role="group" aria-roledescription="slide" aria-label="21 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Adventure"><img src="https://static.wattpad.com/image/adventure-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Adventure</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide22" role="group" aria-roledescription="slide" aria-label="22 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Non-Fiction"><img src="https://static.wattpad.com/image/nonfiction-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Non-Fiction</span></a></div></li>
                                <li class="splide__slide LH-JU is-visible" id="splide21-slide23" role="group" aria-roledescription="slide" aria-label="23 of 23" style="margin-right: 8px; width: calc(12.5% - 7px);"><div class="WS31f"><a class="pill__pziVI light-variant__fymht large-size__ZWTBp default-accent__YcamO square-shape__V66Yy clickable__llABU large-size-padding__jHkb8 gap-for-pill-image__lE8v5" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/genre-stories-page.html?genre=Poetry"><img src="https://static.wattpad.com/image/poetry-illo@home.png" class="pillImage__YYWTB pillImage-large__xOiyd" alt=""><span class="typography-label-small-semi">Poetry</span></a></div></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

    $('#scroll-div').append(browserGenreContainer);
}




// load try some new stories
let moreStories = true;
async function loadMoreStories() {
    let data = {
        'topPickupStories': topPickupStories,
        'hotWattpadStories': hotWattpadStories,
        'storiesFromGenreYouLikeList': storiesFromGenreYouLikeList,
        'storiesFromWritersYouLikeList': storiesFromWritersYouLikeList,
        'recommendationForYouStoriesList': recommendationForYouStoriesList,
        'completedStoriesList': completedStoriesList,
        'trySomethingNewStoriesList': trySomethingNewStoriesList
    }

    await fetch('http://localhost:8080/home/moreStories', {
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

            let moreStoriesList = data.data;

            if (moreStoriesList.length <= 0) {
                moreStories = false;
                return;
            }

            let moreStoryContainer = `
        <!-- ---------------more story for you---------------- -->
        <div class="iLjsG">
            <div class="_7wY3G" data-testid="swimlane">
                <div>
                    <header class="By7SK">
                        <div class="I1aID">
                            <h3 class="iA8-j" data-testid="heading">More stories for you</h3>
                        </div>
                    </header>
                    <div class="splide ah4a1 splide--slide splide--ltr splide--draggable is-active is-overflow is-initialized scroll-override" data-testid="carousel" id="splide23" role="region" aria-roledescription="carousel">
                        <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide23-track" aria-live="polite" aria-atomic="true">
                            <ul class="splide__list" id="splide23-list" role="presentation" style="transform: translateX(0px);">
                                ${moreStoriesList.map(storyList => `
                                <li class="splide__slide is-active is-visible" role="group" aria-roledescription="slide" aria-label="1 of 4" style="margin-right: 8px; width: 379px; height: 290px">
                                    <div class="IAzmt" style="gap: 12.5px 8px;">
                                        <a class="zv-c6" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${storyList[0].storyId}">
                                            <div class="coverWrapper__t2Ve8" data-testid="cover">
                                                <img class="cover__BlyZa flexible__bq0Qp" src="${storyList[0].coverImagePath}" alt="Story cover" data-testid="image">
                                            </div>
                                        </a>
                                        <a class="dyxxG" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${storyList[1].storyId}">
                                            <div class="coverWrapper__t2Ve8" data-testid="cover">
                                                <img class="cover__BlyZa flexible__bq0Qp" src="${storyList[1].coverImagePath}" alt="Story cover" data-testid="image">
                                            </div>
                                        </a>
                                        <a class="dyxxG" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${storyList[2].storyId}">
                                            <div class="coverWrapper__t2Ve8" data-testid="cover">
                                                <img class="cover__BlyZa flexible__bq0Qp" src="${storyList[2].coverImagePath}" alt="Story cover" data-testid="image">
                                            </div>
                                        </a>
                                        <a class="dyxxG" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${storyList[3].storyId}">
                                            <div class="coverWrapper__t2Ve8" data-testid="cover">
                                                <img class="cover__BlyZa flexible__bq0Qp" src="${storyList[3].coverImagePath}" alt="Story cover" data-testid="image">
                                            </div>
                                        </a>
                                        <a class="dyxxG" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${storyList[4].storyId}">
                                            <div class="coverWrapper__t2Ve8" data-testid="cover">
                                                <img class="cover__BlyZa flexible__bq0Qp" src="${storyList[4].coverImagePath}" alt="Story cover" data-testid="image">
                                            </div>
                                        </a>
                                    </div>
                                </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;
            $('#scroll-div').append(moreStoryContainer);

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
// loadMoreStories();




async function run() {
    await loadYourStories();
    await loadTopPickupForYou();
    await loadHotWattpadReads();
    await loadReadingLists();
    await loadStoriesFromGenreYouLike();
    await loadStoriesFromWritersYouLike();
    await loadPremiumPickStories();
    await loadRecommendationForYou();
    await loadCompletedStories();
    await loadTrySomethingNew();
    await loadBrowseGenres();
    loadMoreStories();
}

run();






// Initialize and configure the Splide slider for automatic sliding
document.addEventListener('DOMContentLoaded', function () {
    new Splide('#splide01', {
        type: 'loop', // Continuous loop for all slides
        perPage: 1, // One slide at a time
        autoplay: true, // Enable automatic sliding
        interval: 5000, // 5 seconds per slide
        pauseOnHover: false, // Continue sliding on hover
        arrows: false, // Hide arrows
        pagination: false, // Hide pagination dots
        speed: 1000, // Smooth transition speed (1 second)
        easing: 'ease' // Smooth easing effect
    }).mount();
});





document.addEventListener('DOMContentLoaded', function () {
    // Example Splide initialization (adjust based on your code)
    new Splide('.splide', {
        type: 'loop',
        perPage: 1,
        autoplay: true,
        // Add this condition to skip story sections
    }).forEach(slider => {
        if (!slider.root.id.includes('splide03')) {
            slider.mount();
        }
    });
});



























