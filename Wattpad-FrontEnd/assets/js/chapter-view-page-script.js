//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/chapter', {
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

            if (params.has("chapterId")) {

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
async function loadChapterData() {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/chapter/'+chapterId, {
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

            let chapter = data.data;

            //set data attribute
            $('#chapter-text-body').attr('data-story-id',chapter.storyId);

            //top bar left
            $('#story-cover-image').attr('src', `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${chapter.storyCoverImagePath}`);
            $('#story-title').text(chapter.storyTitle);
            $('#author').text('by '+chapter.username);

            //top bar right
            if (chapter.isLiked === 1) {
                $('#vote-icon').css('color', '#ff6122');
            }

            //chapter cover image
            if(chapter.coverImagePath!=null){

                $('#media-container').empty();

                let chapterCoverImageContainer = `
          <!--hidden attribute should remove if chapter have cover image-->
          <div class="media-wrapper">
            <div class="hover-wrapper" style="background-image: url(https://img.wattpad.com/bcover/353771202-1920-k85442.jpg);">
              <div class="background-lg media background" style="display: flex; justify-content: center; align-items: center;">
                <span class="fa fa-left fa-wp-neutral-5 btn btn-link on-prev-media hidden-xs invisible" aria-hidden="true" style="font-size:24px;"></span>
                <div class="media-item image   on-full-size-banner ">
                  <img id="chapter-cover-image" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${chapter.coverImagePath}" alt="">
                </div>
                <span class="fa fa-right fa-wp-neutral-5 btn btn-link on-next-media hidden-xs invisible" aria-hidden="true" style="font-size:24px;"></span>
              </div>
            </div>
          </div>`

                $('#media-container').append(chapterCoverImageContainer);

            }

            //stats and title
            $('#chapter-title').text(chapter.title);
            $('.reads').html(`<i class="fa-solid fa-star fa-wp-neutral-2" style="font-size: 12px;"></i> ` + chapter.views);
            $('.votes').html(`<i class="fa-solid fa-star fa-wp-neutral-2" style="font-size: 12px;"></i> ` + chapter.likes);
            $('.comments').html(`<i class="fa-solid fa-star fa-wp-neutral-2" style="font-size: 12px;"></i> ` + chapter.comments);
            $('#author-profile-pic').attr('src', `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${chapter.userProfilePicPath}`);
            $('#author-profile-link').attr('href', `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${chapter.userId}`);
            $('#author-username').text(chapter.username);

            for (let i = 0; i < chapter.paragraphDTOList.length; i++) {

                let paragraph = chapter.paragraphDTOList[i];

                if (paragraph.contentType === 'text') {
                    let para = `
                                    <div style="margin-bottom: 15px; position: relative; padding-right: 20px;">
                                        <p>${paragraph.content}</p>
        
                                        ${paragraph.commentCount !== "0"
                                        ? `<div style="position: absolute; right: 0; bottom: 0; text-align: center; width: 24px;">
                                                <span style="position: absolute; top: -4px; right: 2px; left: 50%; transform: translate(-50%); font-size: 12px; font-weight: 700; color: #fff;">
                                                ${paragraph.commentCount}
                                                </span>
                                                <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;"></i>
                                        </div>`
                                        : `<div style="opacity: 0; position: absolute; right: 0; bottom: 0; text-align: center; width: 24px;">
                                                <i class="fa-solid fa-square-plus" style="position: absolute; top: 6px; right: 2px; left: 50%; transform: translate(-50%); font-size: 10px; font-weight: 700; color: #fff;"></i>
                                                <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;"></i>
                                           </div>
                                        `
                                        }
                                    </div>`;

                    $('#chapter-body').append(para);
                }
                else if(paragraph.contentType==='image'){
                    let para = `<div style="margin-bottom: 30px; margin-top: 30px">
                                        <img src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${paragraph.content}" style="width: 100%;" alt="content image">
                                        
                                        ${paragraph.commentCount !== "0"
                                        ? `<div style="position: absolute; right: 0; bottom: 0; text-align: center; width: 24px;">
                                               <span style="position: absolute; top: -4px; right: 2px; left: 50%; transform: translate(-50%); font-size: 12px; font-weight: 700; color: #fff;">
                                               ${paragraph.commentCount}
                                               </span>
                                               <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;"></i>
                                        </div>`
                                        : `<div style="opacity: 0; position: absolute; right: 0; bottom: 0; text-align: center; width: 24px;">
                                                <i class="fa-solid fa-square-plus" style="position: absolute; top: 6px; right: 2px; left: 50%; transform: translate(-50%); font-size: 10px; font-weight: 700; color: #fff;"></i>
                                                <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;"></i>
                                           </div>
                                        `}
                                       </div>`

                    $('#chapter-body').append(para);

                }
                else if(paragraph.contentType==='link'){
                    let para = `<div style="margin-bottom: 30px; margin-top: 30px;">
                                        <iframe width="100%" height="320" src="${paragraph.content}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                        
                                        ${paragraph.commentCount !== "0"
                                        ? `<div style="position: absolute; right: 0; bottom: 0; text-align: center; width: 24px;">
                                               <span style="position: absolute; top: -4px; right: 2px; left: 50%; transform: translate(-50%); font-size: 12px; font-weight: 700; color: #fff;">
                                               ${paragraph.commentCount}
                                               </span>
                                               <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;"></i>
                                        </div>`
                                        : `<div style="opacity: 0; position: absolute; right: 0; bottom: 0; text-align: center; width: 24px;">
                                                <i class="fa-solid fa-square-plus" style="position: absolute; top: 6px; right: 2px; left: 50%; transform: translate(-50%); font-size: 10px; font-weight: 700; color: #fff;"></i>
                                                <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;"></i>
                                           </div>
                                        `}
                                        
                                       </div>`

                    $('#chapter-body').append(para);
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

// loadChapterData();




//load recommendation stories for chapter bottom
let recommendationStoriesIds = [];
async function loadRecommendationStories() {

    await fetch('http://localhost:8080/api/v1/chapter/recommendations', {
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
                $('#bottom-container').css('display','none');
                return;
            }

            $('#recommendation-story-container').empty();
            for (let i = 0; i < data.data.length; i++) {

                let story = data.data[i];

                recommendationStoriesIds.push(story.id);

                let recStoryContainer = ` 
                        <!--single recommendation story-->
                        <div style="margin-right: 5px;" class="discover-module-stories-large on-discover-module-item">
                          <a class="send-cover-event on-story-preview cover cover-home" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.id}">
                            <div class="fixed-ratio fixed-ratio-cover">
                              <img src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${story.coverImagePath}" alt="Story cover">
                            </div>
                          </a>
                          <div class="content">
                            <a class="title meta on-story-preview" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.id}" style="font-size: 18px; font-weight: 600; color: #222;">
                              ${story.title}
                            </a>
                            <a class="username meta on-navigate" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${story.userId}" style="font-size: 15px; color: #222;">
                              by ${story.username}
                            </a>
                            <div class="meta social-meta">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg>
                              <span class="read-count" style="margin-left: 5px;">${story.views}</span>
                                                          
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg>
                              <span class="vote-count" style="margin-left: 5px;">${story.likes}</span>
                                                           
                              <svg width="19" height="19" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M3.33366 4.66634C3.70185 4.66634 4.00033 4.36786 4.00033 3.99967C4.00033 3.63148 3.70185 3.33301 3.33366 3.33301C2.96547 3.33301 2.66699 3.63148 2.66699 3.99967C2.66699 4.36786 2.96547 4.66634 3.33366 4.66634ZM4.00033 7.99967C4.00033 8.36786 3.70185 8.66634 3.33366 8.66634C2.96547 8.66634 2.66699 8.36786 2.66699 7.99967C2.66699 7.63148 2.96547 7.33301 3.33366 7.33301C3.70185 7.33301 4.00033 7.63148 4.00033 7.99967ZM4.00033 11.9997C4.00033 12.3679 3.70185 12.6663 3.33366 12.6663C2.96547 12.6663 2.66699 12.3679 2.66699 11.9997C2.66699 11.6315 2.96547 11.333 3.33366 11.333C3.70185 11.333 4.00033 11.6315 4.00033 11.9997ZM6.00033 7.99967C6.00033 8.36786 6.2988 8.66634 6.66699 8.66634H12.667C13.0352 8.66634 13.3337 8.36786 13.3337 7.99967C13.3337 7.63148 13.0352 7.33301 12.667 7.33301H6.66699C6.2988 7.33301 6.00033 7.63148 6.00033 7.99967ZM6.66699 12.6663C6.2988 12.6663 6.00033 12.3679 6.00033 11.9997C6.00033 11.6315 6.2988 11.333 6.66699 11.333H12.667C13.0352 11.333 13.3337 11.6315 13.3337 11.9997C13.3337 12.3679 13.0352 12.6663 12.667 12.6663H6.66699ZM6.00033 3.99967C6.00033 4.36786 6.2988 4.66634 6.66699 4.66634H12.667C13.0352 4.66634 13.3337 4.36786 13.3337 3.99967C13.3337 3.63148 13.0352 3.33301 12.667 3.33301H6.66699C6.2988 3.33301 6.00033 3.63148 6.00033 3.99967Z"></path></g></svg>
                              <span class="part-count" style="margin-left: 5px;"> ${story.parts} </span>
                              
                            </div>
                            <div class="description">${story.description}</div>
                            <div class="tag-meta clearfix">
                              <ul class="tag-items">
                                ${story.tags.slice(0, 3).map(tag => `<li style="padding-right: 0; width: fit-content;"><a class="tag-item on-navigate" href="/stories/ricciardo">${tag}</a></li>`).join('')}
                                
                                ${story.tags.length-3>0
                                ? `<li><span class="num-not-shown on-story-preview">+${story.tags.length-3} more</span></li>`
                                : ``}
                              </ul>
                            </div>
                          </div>
                        </div>`;

                $('#recommendation-story-container').append(recStoryContainer);
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

// loadRecommendationStories();




//load recommendation stories for chapter bottom
async function loadAlsoYouWillLikeStories() {

    let storyId = $('#chapter-text-body').data('story-id');
    recommendationStoriesIds.push(storyId);

    let data = {
        'storiesIdList': recommendationStoriesIds,
    };

    await fetch('http://localhost:8080/api/v1/chapter/alsoYouWillLikeStories', {
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

// loadAlsoYouWillLikeStories();




async function run() {
    await loadChapterData();
    await loadRecommendationStories();
    loadAlsoYouWillLikeStories();
}

run();
























