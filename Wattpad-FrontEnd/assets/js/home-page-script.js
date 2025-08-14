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
};



//load your stories
let yourStoryExist = true;
function loadYourStories() {

    fetch('http://localhost:8080/home/yourStories', {
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

            if(libraryStories.length<=0){
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
                    <div class="splide ah4a1 is-overflow is-initialized splide--slide splide--ltr splide--draggable is-active" data-testid="carousel" id="splide02" role="region" aria-roledescription="carousel">
                        <!--you story section stories place container-->
                        <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide02-track" style="padding-left: 0px; padding-right: 0px;" aria-live="polite" aria-atomic="true">
                            <ul class="splide__list" id="splide02-list" role="presentation" style="transform: translateX(0px);">
                                ${libraryStories.map(libraryStory => `
                                    <!--single library story-->
                                    <li class="splide__slide is-active is-visible" style="margin-right: 8px; width: 125px; height: 238px">
                                        <a class="CJILD" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${libraryStory.lastReadChapterId}">
                                        <div class="F0IAU">
                                            <div class="W-SYx coverWrapper__t2Ve8" data-testid="cover">
                                                <img class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${libraryStory.coverImagePath}" alt="𝕃𝕠𝕧𝕖 𝔼𝕞𝕓𝕣𝕒𝕔𝕖 ᵒⁿʰᵒˡᵈ cover" data-testid="image">
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
        </div>`

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
loadYourStories();




//load your stories
let topPickupForYou = true;
function loadTopPickupForYou() {

    fetch('http://localhost:8080/home/topPickupForYou', {
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

            if(libraryStories.length<=0){
                topPickupForYou = false;
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
                    <div class="splide ah4a1 is-overflow is-initialized splide--slide splide--ltr splide--draggable is-active" data-testid="carousel" id="splide02" role="region" aria-roledescription="carousel">
                        <!--you story section stories place container-->
                        <div class="splide__track SWer4 splide__track--slide splide__track--ltr splide__track--draggable" id="splide02-track" style="padding-left: 0px; padding-right: 0px;" aria-live="polite" aria-atomic="true">
                            <ul class="splide__list" id="splide02-list" role="presentation" style="transform: translateX(0px);">
                                ${libraryStories.map(libraryStory => `
                                    <!--single library story-->
                                    <li class="splide__slide is-active is-visible" style="margin-right: 8px; width: 125px; height: 238px">
                                        <a class="CJILD" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${libraryStory.lastReadChapterId}">
                                        <div class="F0IAU">
                                            <div class="W-SYx coverWrapper__t2Ve8" data-testid="cover">
                                                <img class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${libraryStory.coverImagePath}" alt="𝕃𝕠𝕧𝕖 𝔼𝕞𝕓𝕣𝕒𝕔𝕖 ᵒⁿʰᵒˡᵈ cover" data-testid="image">
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
        </div>`

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
// loadTopPickupForYou();


















































