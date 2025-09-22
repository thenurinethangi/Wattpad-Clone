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

                let chapterId = params.get('chapterId');

                fetch('http://localhost:8080/api/v1/chapter/check/restricted/'+chapterId, {
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

                        if(data.data===true){
                            window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-restricted-page.html';
                        }
                        else{
                            document.body.style.display = 'block';
                            document.body.style.visibility = 'visible';
                            document.body.style.opacity = 1;
                        }

                    })
                    .catch(error => {
                        let response = JSON.parse(error.message);
                        console.log(response);

                    });
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

            if(chapter.isFromCurrentUser===0){
                $('.writer-button-group').remove();
            }
            $('.writer-button-group').find('a').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/create-chapter-page.html?chapterId=${chapter.id}&storyId=${chapter.storyId}&isEdit=true`);

            //set data attribute
            $('#chapter-text-body').attr('data-story-id',chapter.storyId);

            //top bar left
            $('#story-cover-image').attr('src', `${chapter.storyCoverImagePath}`);
            $('#story-title').text(chapter.storyTitle);
            $('#story-title-02').text(chapter.storyTitle);
            $('#author').text('by '+chapter.username);
            $('.navigate-to-story').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${chapter.storyId}`);
            $('.chap-title').text(chapter.storyTitle);

            if(chapter.isWattpadOriginal===1){
                $('#wattpad-original-tag').css('display','block');
            }
            else {
                $('#wattpad-original-tag').css('display','none');
            }

            if(chapter.isUnlocked===1){
                $('.paywall-container').css('display','none');
                $('#sticky-end').css('display','block');
                $('.footer-comment').css('display','block');
            }
            else{
                if(chapter.chapterCoins===0 || chapter.isFromCurrentUser===1){
                    $('.paywall-container').css('display','none');
                    $('#sticky-end').css('display','block');
                    $('.footer-comment').css('display','block');
                }
                else{
                    $('.paywall-container').css('display','block');
                    $('#sticky-end').css('display','none');
                    $('.footer-comment').css('display','none');

                    $('#story-coins').text(chapter.storyCoins);
                    $('#chapter-coins').text(chapter.chapterCoins);
                }
            }

            //set all chapters - dropdown
            $('#chapters-list').empty();

            for (let i = 0; i < data.data.chapterSimpleDTOList.length; i++) {

                let c = data.data.chapterSimpleDTOList[i];

                let singleChapter = null;
                if(c.id==chapter.id){
                    singleChapter = `
<li style="overflow: hidden; padding: 10px 0px; font-size: 14px; font-weight: 600; color: #222; width: 100%; border-left: 4px solid #ff6122;">
  <a style="color: #ff6122" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${c.id}">
    ${c.title}
  </a>
  ${c.isPublishedOrDraft === 0
                        ? `<p style="color: gray; padding-left: 10px;">Draft</p>`
                        : ``}
  ${chapter.chapterCoins === 0
                        ? ``
                        : (chapter.isWattpadOriginal=== 1 && chapter.isUnlocked === 1
                            ? `<i style="opacity: 0.9;" class="fa-solid fa-lock-open"></i>`
                            : (chapter.isWattpadOriginal=== 1 && chapter.isUnlocked === 0 ? `<i style="opacity: 0.9;" class="fa-solid fa-lock"></i>` : ``))}
</li>
`;

                }
                else {
                    singleChapter = `<li style="overflow: hidden; padding: 10px 0px; font-size: 14px; font-weight: 600; color: #222; width: 100%;"><a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${c.id}">${c.title}</a>${c.isPublishedOrDraft===0 ? `<p style="color: gray; padding-left: 10px;">Draft</p>` : ``} 
${chapter.chapterCoins === 0
                        ? ``
                        : (chapter.isWattpadOriginal=== 1 && chapter.isUnlocked === 1
                            ? `<i style="opacity: 0.9;" class="fa-solid fa-lock-open"></i>`
                            :(chapter.isWattpadOriginal=== 1 && chapter.isUnlocked === 0 ? `<i style="opacity: 0.9;" class="fa-solid fa-lock"></i>` : ``))}</li>`;
                }
                $('#chapters-list').append(singleChapter);
            }

            //top bar right
            if (chapter.isLiked === 1) {
                $('#vote-icon').css('color', '#ff6122');
            }
            else{
                $('#vote-icon').css('color', '#6f6f6f');
            }

            //chapter cover
            if (chapter.coverImagePath != null) {
                $('#media-container').empty();

                let chapterCoverMediaContainer = "";

                if (chapter.coverImagePath.includes("youtube.com/embed")) {
                    chapterCoverMediaContainer = `
          <div class="media-wrapper">
            <div class="hover-wrapper" style="background-color: #000;">
              <div class="background-lg media background" style="display: flex; justify-content: center; align-items: center;">
                <iframe id="chapter-cover-video"
                        src="${chapter.coverImagePath}"
                        frameborder="0"
                        allowfullscreen
                        style="width: 100%; height: 370px; border-radius: 8px;">
                </iframe>
              </div>
            </div>
          </div>`;
                } else {
                    chapterCoverMediaContainer = `
          <div class="media-wrapper">
            <div class="hover-wrapper" style="background-image: url(https://w0.peakpx.com/wallpaper/410/412/HD-wallpaper-plain-black-black.jpg);">
              <div class="background-lg media background" style="display: flex; justify-content: center; align-items: center;">
                <span class="fa fa-left fa-wp-neutral-5 btn btn-link on-prev-media hidden-xs invisible" aria-hidden="true" style="font-size:24px;"></span>
                <div class="media-item image on-full-size-banner">
                  <img id="chapter-cover-image" src="${chapter.coverImagePath}" alt="">
                </div>
                <span class="fa fa-right fa-wp-neutral-5 btn btn-link on-next-media hidden-xs invisible" aria-hidden="true" style="font-size:24px;"></span>
              </div>
            </div>
          </div>`;
                }

                $('#media-container').append(chapterCoverMediaContainer);
            }
            else {
                $('#media-container').css('display','none');
            }

            //stats and title
            if(chapter.isPublishedOrDraft===1){
                $('#chapter-title').text(chapter.title);
            }
            else{
                $('#chapter-title').html(`${chapter.title} <span style="display: inline; visibility: visible; opacity: 1; color: #c3d8dc; padding-left: 12px;" class="draft-tag">(Draft)</span>`);
            }
            $('.reads').html(`<i class="fa-solid fa-eye" style="font-size: 12px;"></i> ` + chapter.views);
            $('.votes').html(`<i class="fa-solid fa-star fa-wp-neutral-2" style="font-size: 12px;"></i> ` + chapter.likes);
            $('.comments').html(`<i class="fa-solid fa-comment" style="font-size: 12px;"></i> ` + chapter.comments);
            if(chapter.userProfilePicPath!=null){
                $('#author-profile-pic').attr('src', `${chapter.userProfilePicPath}`);
            }
            else{
                $('#author-profile-pic').attr('src', `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnFRPx77U9mERU_T1zyHcz9BOxbDQrL4Dvtg&s`);
            }
            $('.author-profile-link').attr('href', `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${chapter.userId}`);
            $('#author-username').text(chapter.username);

            $('#chapter-body').empty();
            if(chapter.paragraphDTOList.length<=0){
                let p = `<p>This chapter contains no content.</p>`
                $('#chapter-body').append(p);
            }
            for (let i = 0; i < chapter.paragraphDTOList.length; i++) {

                let paragraph = chapter.paragraphDTOList[i];

                if (paragraph.contentType === 'text') {
                    let para = `
                                    <div class="chapter-content" data-comment-count="${paragraph.commentCount}" style="margin-bottom: 15px; position: relative; padding-right: 20px;">
                                        <p>${paragraph.content}</p>
        
                                        ${paragraph.commentCount !== "0"
                                        ? `<div class="comment-icon" data-paragraph-id="${paragraph.id}" style="position: absolute; right: 0; bottom: 0; text-align: center; width: 30px;">
                                                <span style="position: absolute; top: -4px; right: 2px; left: 50%; transform: translate(-50%); font-size: 12px; font-weight: 700; color: #fff;">
                                                ${paragraph.commentCount}
                                                </span>
                                                <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"></i>
                                        </div>`
                                        : `<div class="comment-icon" data-paragraph-id="${paragraph.id}" style="opacity: 0; position: absolute; right: 0; bottom: 0; text-align: center; width: 25px;">
                                                <i class="fa-solid fa-square-plus" style="position: absolute; top: 6px; right: 2px; left: 50%; transform: translate(-50%); font-size: 10px; font-weight: 700; color: #fff;"></i>
                                                <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;"></i>
                                           </div>
                                        `
                                        }
                                    </div>`;

                    $('#chapter-body').append(para);
                }
                else if(paragraph.contentType==='image'){
                    let para = `<div class="chapter-content" data-comment-count="${paragraph.commentCount}" style="margin-bottom: 47px; margin-top: 30px; position: relative;">
                                        <img class="chapter-content" src="${paragraph.content}" style="width: 100%;" alt="content image">
                                        
                                         ${paragraph.commentCount !== "0"
                                         ? `<div class="comment-icon" data-paragraph-id="${paragraph.id}" style="position: absolute; right: 0; bottom: -37px;; text-align: center; width: 24px;">
                                                <span style="position: absolute; top: -4px; right: 2px; left: 50%; transform: translate(-50%); font-size: 12px; font-weight: 700; color: #fff;">
                                                ${paragraph.commentCount}
                                                </span>
                                                <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"></i>
                                           </div>`
                                        : `<div class="comment-icon" data-paragraph-id="${paragraph.id}" style="opacity: 0; position: absolute; right: 0; bottom: -37px; text-align: center; width: 24px;">
                                                <i class="fa-solid fa-square-plus" style="position: absolute; top: 6px; right: 2px; left: 50%; transform: translate(-50%); font-size: 10px; font-weight: 700; color: #fff;"></i>
                                                <i class="fa-solid fa-message" style="color: #6f6f6f; font-size: 20px;"></i>
                                           </div>
                                        `
                                        }
                                       </div>`

                    $('#chapter-body').append(para);

                }
                else if (paragraph.contentType === 'link') {
                    let ytUrl = paragraph.content;

                    if (ytUrl.includes("youtu.be")) {
                        const videoId = ytUrl.split("youtu.be/")[1].split("?")[0];
                        ytUrl = `https://www.youtube.com/embed/${videoId}`;
                    }

                    else if (ytUrl.includes("watch?v=")) {
                        const videoId = ytUrl.split("watch?v=")[1].split("&")[0];
                        ytUrl = `https://www.youtube.com/embed/${videoId}`;
                    }

                    let para = `
                                     <div class="chapter-content" data-comment-count="${paragraph.commentCount}" style="margin-bottom: 30px; margin-top: 30px;">
                                             <iframe width="100%" height="320" src="${ytUrl}" 
                                                title="YouTube video player" frameborder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                                referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>
                                             </iframe>
                                        ...
                                        </div>`;

                    $('#chapter-body').append(para);
                }

            }

        })
        .catch(error => {
            try {
                let errorResponse = JSON.parse(error.message);
                console.error('Error:', errorResponse);

                if(errorResponse.status===404 && errorResponse.message==='Chapter not found./Draft'){
                    window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-restricted-page.html';
                }
            } catch (e) {
                console.error('Error:', error.message);
            }
        });


    //increase views
    fetch('http://localhost:8080/api/v1/chapter/increase/views/'+chapterId, {
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

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });


    //update last read chapter
    fetch('http://localhost:8080/api/v1/chapter/increase/views/'+chapterId, {
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

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
}

// loadChapterData();



//unlock story btn
let unlockStoryBtn = $('.unlock-story')[0];
unlockStoryBtn.addEventListener('click',function (event) {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: 'Would you like to unlock this story?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, unlock',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'modern-swal',
            confirmButton: 'swal2-confirm',
            cancelButton: 'swal2-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {

            fetch('http://localhost:8080/api/v1/chapter/unlock/story/'+chapterId, {
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

                    if(data.data===true){
                        location.reload(true);
                        window.location.href = window.location.href;

                        Swal.fire({
                            title: 'Success',
                            text: 'Congratulations! You\'ve unlocked the full story. Enjoy reading!',
                            icon: 'success',
                            customClass: {
                                popup: 'modern-swal-wide-short',
                                title: 'swal-title',
                                htmlContainer: 'swal-text'
                            },
                            timer: 3000,
                            timerProgressBar: false,
                            showConfirmButton: false
                        });
                    }
                    else{
                        window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/coins-page.html';

                        Swal.fire({
                            title: 'Fail',
                            text: 'Insufficient coin amount!',
                            icon: 'fail',
                            customClass: {
                                popup: 'modern-swal-wide-short',
                                title: 'swal-title',
                                htmlContainer: 'swal-text'
                            },
                            timer: 3000,
                            timerProgressBar: false,
                            showConfirmButton: false
                        });
                    }

                })
                .catch(error => {
                    let response = JSON.parse(error.message);
                    console.log(response);

                    Swal.fire({
                        title: 'Fail',
                        text: 'Fail to unlocked the story, please try later!',
                        icon: 'fail',
                        customClass: {
                            popup: 'modern-swal-wide-short',
                            title: 'swal-title',
                            htmlContainer: 'swal-text'
                        },
                        timer: 3000,
                        timerProgressBar: false,
                        showConfirmButton: false
                    });

                });
        }
        else {
            // console.log('still activate');
        }
    });

});




//unlock chapter btn
let unlockPartBtn = $('.unlock-part')[0];
unlockPartBtn.addEventListener('click',function (event) {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: 'Would you like to unlock this part?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, unlock',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'modern-swal',
            confirmButton: 'swal2-confirm',
            cancelButton: 'swal2-cancel'
        }
    }).then((result) => {
        if (result.isConfirmed) {

            fetch('http://localhost:8080/api/v1/chapter/unlock/chapter/'+chapterId, {
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

                    if(data.data===true){
                        location.reload(true);
                        window.location.href = window.location.href;

                        Swal.fire({
                            title: 'Success',
                            text: 'Congratulations! You\'ve unlocked this part. Enjoy reading!',
                            icon: 'success',
                            customClass: {
                                popup: 'modern-swal-wide-short',
                                title: 'swal-title',
                                htmlContainer: 'swal-text'
                            },
                            timer: 3000,
                            timerProgressBar: false,
                            showConfirmButton: false
                        });
                    }
                    else{
                        window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/coins-page.html';

                        Swal.fire({
                            title: 'Fail',
                            text: 'Insufficient coin amount!',
                            icon: 'fail',
                            customClass: {
                                popup: 'modern-swal-wide-short',
                                title: 'swal-title',
                                htmlContainer: 'swal-text'
                            },
                            timer: 3000,
                            timerProgressBar: false,
                            showConfirmButton: false
                        });
                    }

                })
                .catch(error => {
                    let response = JSON.parse(error.message);
                    console.log(response);

                    Swal.fire({
                        title: 'Fail',
                        text: 'Fail to unlocked the part, please try later!',
                        icon: 'fail',
                        customClass: {
                            popup: 'modern-swal-wide-short',
                            title: 'swal-title',
                            htmlContainer: 'swal-text'
                        },
                        timer: 3000,
                        timerProgressBar: false,
                        showConfirmButton: false
                    });

                });
        }
        else {
            // console.log('still activate');
        }
    });

});




//load recommendation stories for chapter bottom
let recommendationStoriesIds = [];
async function loadRecommendationStories() {

    let storyId = $('#chapter-text-body').data('story-id');
    let list = [storyId];

    let data = {
        'storiesIdList': list,
    };

    await fetch('http://localhost:8080/api/v1/chapter/recommendations', {
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
                              <img src="${story.coverImagePath}" alt="Story cover">
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
                                ${story.tags.slice(0, 3).map(tag => `<li style="padding-right: 0; width: fit-content;"><a class="tag-item on-navigate" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/tag-stories-page.html?tag=${tag}">${tag}</a></li>`).join('')}
                                
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

            $('#also-you-like-story-container').empty();

            if(data.data.length<=0){
                $('#also-you-like-story-main-container').css('display','none');
            }

            for (let i = 0; i < data.data.length; i++) {

                let story = data.data[i];

                let singleStory = `
                        <!--single story-->
                          <div class="story-item clearfix">
                            <div class="component-wrapper" id="component-storyitem-332542111-%2f1491714881-broken-doll-taekook-%25e2%259c%2594%25ef%25b8%258f-chapter-55">
                              <a class="clearfix on-story-preview" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${story.id}" data-story-id="332542111" data-author-name="thelittleblackghost">
                                <div class="send-story-cover-event cover cover-sm">
                                  <img src="${story.coverImagePath}" alt="Wednesday by thelittleblackghost">
                                </div>
                                <div class="left-container">
                                  <div class="story-item-title-and-badge">
                                    <div class="title" aria-hidden="true">${story.title}</div>
                                  </div>
                                  <div class="meta" style="transform: translateY(-5px);">
                                    <svg width="13" height="13" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg>
                                    <span class="read-count" style="margin-left: 5px;">${story.views}</span>

                                    <svg style="transform: translateX(-6px);" width="13" height="13" viewBox="0 0 16 16" fill="var(--wp-neutral-31)" stroke="var(--ds-neutral-80)" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="MAVbp"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg>
                                    <span class="vote-count" style="margin-left: 5px; transform: translateX(-6px);">${story.likes}</span>
                                  </div>
                                  <div class="small story-item-description" style="transform: translateY(-10px);">${story.description}</div>
                                </div>
                              </a>
                            </div>
                          </div>`;

                $('#also-you-like-story-container').append(singleStory)
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

// loadAlsoYouWillLikeStories();




async function loadNextChapter() {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/chapter/next/'+chapterId, {
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

            if(chapter==null){
                $('.continue-next-chapter').remove();
            }
            else {
                $('.parts-end').remove();
                $('.next-chapter-link').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${chapter.id}`);
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




async function run() {
    await loadChapterData();
    await loadRecommendationStories();
    await loadAlsoYouWillLikeStories();
    await loadFirstTwoCommentsOfChapter();
    loadNextChapter();
}

run();




//when click on dropdown button chapter list appear
let chapterListDropDown = $('#funbar-part-details')[0];
chapterListDropDown.addEventListener('click',function (event) {

    $('#chapters-list-container').css({
        'display': 'block',
        'visibility': 'visible',
        'opacity': 1
    });

});


//when click on the document chapter list disappear
$(document).on('click', function (e) {
    if (
        $(e.target).closest('#funbar-part-details').length > 0 ||
        $(e.target).closest('#chapters-list-container').length > 0
    ) {

        $('#chapters-list-container').css({
            'display': 'block',
            'visibility': 'visible',
            'opacity': 1
        });
    }
    else {
        $('#chapters-list-container').css({
            'display': 'none',
            'visibility': 'hidden',
            'opacity': 0
        });
    }
});




//when click on vote button add or remove the vote
let voteBtn = $('#vote-btn')[0];
voteBtn.addEventListener('click',function (event) {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    fetch('http://localhost:8080/api/v1/chapter/vote/'+chapterId, {
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

            loadChapterData();

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });

});




//when mouse enter the paragraph show comment icon(for uncommented paragraph)
$(document).on('mouseenter', '.chapter-content', function () {
    let commentCount = $(this).data('comment-count');
    if (commentCount === 0) {
        $(this).children('div').last().css('opacity', 1);
    }
});


//when mouse leave the paragraph hide comment icon(for uncommented paragraph)
$(document).on('mouseleave', '.chapter-content', function () {
    let commentCount = $(this).data('comment-count');
    if (commentCount === 0) {
        $(this).children('div').last().css('opacity', 0);
    }
});




//click on comment icon comment model appear
$(document).on('click','.comment-icon',function (event) {

    let paragraphId = $(this).data('paragraph-id');
    paragraphCommentsSetToTheModel(paragraphId);
});



// function paragraphCommentsSetToTheModel(paragraphId) {
function paragraphCommentsSetToTheModel(paragraphId) {
    fetch('http://localhost:8080/api/v1/paragraph/all/comments/' + paragraphId, {
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

            $('body').find('.paragraph-comments-drawer').remove();

            let response = data.data;

            let commentsModelContainer = `
<div class="paragraph-comments-drawer">
  <div role="presentation" class="modal-backdrop fade in" style="width: calc(100vw - 455px);"></div>
  <div class="drawer-content open" style="width: 440px;">
    <header class="drawer-header">
      <h1 class="drawer-title">${response.chapterTitle}</h1>
      <button class="close-btn" aria-label="Close">
        <i class="fa-solid fa-xmark" style="color: #222;"></i>
      </button>
    </header>
    <div class="drawer-body">
      <div class="paragraph-content">
        ${response.contentType === 'text'
                ? `<pre>${response.content}</pre>`
                : response.contentType === 'image'
                    ? `<img src="${response.content}" alt="image" style="width: 100%;">`
                    : `<iframe width="100%" height="320" src="${response.content}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
            }
        
      </div>
      <div class="comments-list">
        <div class="new-comment-field sticky">
          <div>
            <div class="textboxContainer__mbQss">
              <textarea placeholder="Write a comment..." class="text-body-sm defaultHeight__PP_LO" aria-label="Post new comment" style="height: 48px;"></textarea>
              <button class="direct-comment-send-btn" data-paragraph-id="${response.paragraphId}" type="button" disabled="" aria-label="send">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.2424 13.7576L1.59386 9.91382C0.766235 9.54598 0.81481 8.35534 1.66965 8.05615L21.6485 1.06354C21.6779 1.05253 21.7077 1.04296 21.7378 1.03481C22.096 0.935758 22.4419 1.04489 22.6811 1.26776C22.6899 1.27595 22.6985 1.28433 22.7071 1.29289C22.7157 1.30146 22.7241 1.31014 22.7322 1.31893C22.9554 1.55835 23.0645 1.90478 22.9649 2.26344C22.9568 2.29301 22.9474 2.32229 22.9366 2.35116L15.9439 22.3304C15.6447 23.1852 14.454 23.2338 14.0862 22.4061L10.2424 13.7576ZM18.1943 4.39148L4.71107 9.11061L10.7785 11.8073L18.1943 4.39148ZM12.1927 13.2215L14.8894 19.2889L19.6085 5.80568L12.1927 13.2215Z" fill="#111111"></path></svg>
              </button>
            </div>
          </div>
        </div>
        ${response.singleCommentDTOList.map(comment => `
        <div class="comment-card-container" data-comment-id="${comment.id}">
          <div>
            <div class="dsContainer__RRG6K commentCardContainer__P0qWo">
              <div class="dsColumn__PqDUP">
                <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${comment.userId}" aria-label="Jeon_Taeshu">
                  <img style="object-fit: cover;" src="${comment.userProfilePic}" aria-hidden="true" alt="Jeon_Taeshu" class="avatar__Ygp0_ comment_card_avatar__zKv1t">
                </a>
              </div>
              <div class="dsColumn__PqDUP commentCardContentContainer__F9gGk gap8__gx3K6">
                <div class="dsRow__BXK6n gap8__gx3K6 authorProfileRow__GMsIH">
                  <h3 aria-hidden="true" class="dsMargin__Gs6Tj title-action">${comment.username}</h3>
                  <div class="dsRow__BXK6n badgeRow__bzi6i">
                    ${comment.isCommentByAuthor === 1
                ? `<div class="pill__HVTvX text-caption" style="color: rgb(255, 255, 255); background-color: rgb(169, 62, 25);">Writer</div>`
                : ``
            }
                  </div> 
                </div>
                <div class="dsRow__BXK6n commentCardContent__Vc9vg">
                  <pre class="text-body-sm">${comment.commentMessage}</pre>
                </div>
                <div class="dsRow__BXK6n commentCardContent__Vc9vg commentCardMeta__Xy9U9">
                  <p class="postedDate__xcq5D text-caption">${comment.time}</p>
                  <button class="replyButton__kdyts button__Meavz title-action reply-btn" data-paragraph-comment-id="${comment.id}" aria-label="Reply to comment">Reply</button>
                </div>
                <div class="dsRow__BXK6n viewRepliesRow__nKbo7 gap4__udBQg">
                ${comment.replyCount !== '0'
                ? `<button class="replyButton__kdyts button__Meavz title-action view-replies-btn" data-paragraph-comment-id="${comment.id}" aria-label="View replies">View ${comment.replyCount} Reply</button>`
                : ``
            }
                </div>
              </div>
              <div class="dsColumn__PqDUP likeColumn__bveEu">
                <button data-id="${comment.id}" data-type="comment" class="button__Meavz more-options-unique" aria-label="More options">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z" fill="#686868"></path></svg>
                </button>
                <div class="dsColumn__PqDUP">
                  <button class="button__Meavz like-btn" data-paragraph-comment-id="${comment.id}" data-paragraph-id="${response.paragraphId}" aria-label="Like this comment">
                    ${comment.isCurrentUserLiked === 1
                ? `<svg width="16" height="14" viewBox="0 0 16 14" fill="#ff6122" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#ff6122" fill="#ff6122" stroke-width="1.5" stroke-linecap="round"></path></svg>`
                : `<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#121212" stroke-width="1.5" stroke-linecap="round"></path></svg>`
            }
                  </button>
                    ${comment.likes !== '0'
                ? `<span class="text-caption" style="font-weight: 700; font-size: 12px; color: #121212;">${comment.likes}</span>`
                : ``
            }
                </div>
              </div>
            </div>
          </div>
          <!--here place the comment input field-->
          
          <!--here add replies-->
          <div class="comments-list reply-container">
          </div>
        </div>`).join('')}
       
        <div class=""></div>
      </div>
    </div>
  </div>
</div>`;

            $('body').append(commentsModelContainer);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
}


$(document).on('click','.close-btn',function (event) {

    loadChapterData();
    $('.paragraph-comments-drawer').css('display','none');

});


// $(document).on('click', function (e) {
//
//     if ($(e.target).closest('.paragraph-comments-drawer').length > 0 || $(e.target.closest('.comment-icon').length > 0)) {
//         // $('.paragraph-comments-drawer').css('display','block');
//     }
//     else {
//         $('.paragraph-comments-drawer').css('display','none');
//     }
// });

$(document).on('click', function (e) {
    const isInDrawer = $(e.target).closest('.paragraph-comments-drawer').length > 0;
    const isCommentIcon = $(e.target).closest('.comment-icon').length > 0;

    if (isInDrawer || isCommentIcon) {
        // $('.paragraph-comments-drawer').css('display','block');
    } else {
        $('.paragraph-comments-drawer').css('display','none');
    }
});




$(document).on('input', '.new-comment-field textarea', function () {
    let btn = $(this).closest('.new-comment-field').find('.direct-comment-send-btn');
    if ($(this).val().trim().length > 0) {
        btn.prop('disabled', false);
    } else {
        btn.prop('disabled', true);
    }
});


//when click on the send comment btn add new comment to the paragraph
$(document).on('click','.direct-comment-send-btn',function (event) {

    let replyText = $(this).closest('.new-comment-field').find('textarea').val();
    let paragraphId = $(this).data('paragraph-id');

    let data = {
        'replyMessage': replyText
    }

    fetch('http://localhost:8080/api/v1/paragraph/comment/'+paragraphId, {
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

            $(this).closest('.new-comment-field').find('textarea').val('');
            paragraphCommentsSetToTheModel(paragraphId);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });

});




//when click on like icon on comment add or remove like
$(document).on('click','.like-btn',function (event) {

    let paragraphCommentId = $(this).data('paragraph-comment-id');
    let paragraphId = $(this).data('paragraph-id');

    fetch('http://localhost:8080/api/v1/paragraph/comment/like/'+paragraphCommentId, {
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

            if(data.data==='Liked'){
                $(this).find('svg').attr('fill','#ff6122');
                $(this).find('svg').find('path').attr('fill','#ff6122');
                $(this).find('svg').find('path').attr('stroke','#ff6122');

                if ($(this).siblings('.text-caption').length) {
                    let value = $(this).siblings('.text-caption').text();
                    let no = Number(value);
                    no+=1;
                    $(this).siblings('.text-caption').text(no);
                }
                else{
                    let newCaption = $('<span class="text-caption" style="font-weight: 700; font-size: 12px ; color: #121212;">1</span>');
                    $(this).after(newCaption);
                }
            }
            else{
                $(this).find('svg').attr('fill','none');
                $(this).find('svg').find('path').attr('fill','none');
                $(this).find('svg').find('path').attr('stroke','#121212');

                if ($(this).siblings('.text-caption').length) {
                    let value = $(this).siblings('.text-caption').text();
                    let no = Number(value);
                    no-=1;

                    if(no<=0){
                        $(this).siblings('.text-caption').remove();
                    }
                    else {
                        $(this).siblings('.text-caption').text(no);
                    }
                }
            }

            // paragraphCommentsSetToTheModel(paragraphId);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });

});



//when click on view reply button see all the replies that comment have
$(document).on('click','.view-replies-btn',function (event) {
    let paragraphCommentId = $(this).data('paragraph-comment-id');
    loadRepliesByParagraphCommentId(paragraphCommentId,$(this));
    $(this).hide();
    $(this)[0].style.setProperty('display', 'none', 'important');
});



// function loadRepliesByParagraphCommentId(paragraphCommentId, thisElement) {
function loadRepliesByParagraphCommentId(paragraphCommentId, thisElement) {
    fetch('http://localhost:8080/api/v1/paragraph/comment/reply/' + paragraphCommentId, {
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

            let replyContainer = thisElement.closest('.comment-card-container').find('.reply-container');
            replyContainer.empty();

            for (let i = 0; i < data.data.length; i++) {
                let reply = data.data[i];
                let singleReply = `
  <div class="comment-card-container reply-card-container" data-paragraph-comment-id="${reply.paragraphCommentId}" data-reply-id="${reply.replyId}">
    <div>
      <div class="dsContainer__RRG6K commentCardContainer__P0qWo replyCard__Ft5hc">
        <div class="dsColumn__PqDUP">
          <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${reply.userId}" aria-label="${reply.username}">
            <img style="object-fit: cover;" src="${reply.userProfilePic}" aria-hidden="true" alt="${reply.username}" class="avatar__Ygp0_ comment_card_reply_avatar__niNAw">
          </a>
        </div>
        <div class="dsColumn__PqDUP commentCardContentContainer__F9gGk gap8__gx3K6">
          <div class="dsRow__BXK6n gap8__gx3K6 authorProfileRow__GMsIH">
            <h3 aria-hidden="true" class="dsMargin__Gs6Tj title-action">${reply.username}</h3>
            <div class="dsRow__BXK6n badgeRow__bzi6i">
                ${reply.isCommentByAuthor === 1
                    ? `<div class="pill__HVTvX text-caption" style="color: rgb(255, 255, 255); background-color: rgb(169, 62, 25);">Writer</div>`
                    : ``
                }
            </div>
          </div>
          <div class="dsRow__BXK6n commentCardContent__Vc9vg">
            <pre class="text-body-sm" style="color: #222;">${reply.replyMessage}</pre>
          </div>
          <div class="dsRow__BXK6n commentCardContent__Vc9vg commentCardMeta__Xy9U9">
            <p class="postedDate__xcq5D text-caption">${reply.time}</p>
            <button class="replyButton__kdyts button__Meavz text-meta reply-reply-btn" style="font-size: 12px; font-weight: 700;" aria-label="Reply to comment">Reply</button>
          </div>
        </div>
        <div class="dsColumn__PqDUP likeColumn__bveEu">
          <button data-id="${reply.replyId}" data-type="reply" class="button__Meavz more-options-unique" aria-label="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 12C17 13.1046 17.8954 14 19 14Z" fill="#686868"></path></svg>
          </button>
          <div class="dsColumn__PqDUP">
            <button class="button__Meavz like-btn-reply" data-reply-id="${reply.replyId}" data-paragraph-comment-id="${reply.paragraphCommentId}" aria-label="Like this comment">
                ${reply.isCurrentUserLiked === 1
                    ? `<svg width="16" height="14" viewBox="0 0 16 14" fill="#ff6122" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#ff6122" fill="#ff6122" stroke-width="1.5" stroke-linecap="round"></path></svg>`
                    : `<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#121212" stroke-width="1.5" stroke-linecap="round"></path></svg>`
                }
            </button>
              ${reply.likes !== '0'
                    ? `<span class="text-caption" style="font-weight: 700; font-size: 12px; color: #121212;">${reply.likes}</span>`
                    : ``
                }
          </div>
        </div>
      </div>
    </div>
  </div>
`;
                replyContainer.append(singleReply);
            }

            // Ensure reply container is visible
            replyContainer.show();
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log('Error:', response);
        });
}


// Close dropdown when clicking outside, but not the model
$(document).on('click', function (event) {
    let $target = $(event.target);
    if (!$target.closest('.comment-options-dropdown').length && !$target.closest('.more-options-unique').length) {
        $('.comment-options-dropdown').remove();
    }
});

// Ensure the close button on the model works as intended
$(document).on('click', '.close-btn', function () {
    $('.paragraph-comments-drawer').remove();
});



$(document).ready(function () {
    // Handle 3 dots click
    $(document).on('click', '.more-options-unique', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Remove old dropdowns
        $('.comment-options-dropdown').remove();

        const $btn = $(this);
        let id = $btn.data('id');
        let type = $btn.data('type');

        let data = {
            'id': id,
            'type': type
        };

        fetch('http://localhost:8080/api/v1/chapter/comment/reply/check', {
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

                let res = data.data;

                // Build dropdown
                const $dropdown = $(`
            <div class="comment-options-dropdown"
                 style="position:absolute; background:#ffffff; border:1px solid rgba(204,204,204,0.87);
                        border-radius:4px; box-shadow:0 2px 6px rgba(0,0,0,0.15);
                        min-width:120px; padding:5px 0; z-index:99999; display: flex; flex-direction: column;">
                        ${res === true ? `<button data-id="${id}" data-type="${type}" class="option delete-option" style="border: none; background-color: #fff; padding-block: 3px; font-size: 14px; border-bottom: 1px solid rgba(128,128,128,0.2);">Delete</button>` : `<button data-id="${id}" data-type="${type}" class="option edit-option" style="border: none; background-color: #fff; padding-block: 3px; font-size: 14px; border-bottom: 1px solid rgba(128,128,128,0.2);">Mute</button>`}
                <button data-id="${id}" data-type="${type}" class="option edit-option" style="border: none; background-color: #fff; padding-block: 3px; font-size: 14px; border-bottom: 1px solid rgba(128,128,128,0.2);">Report</button>
            </div>
        `);

                // Attach to body
                $('body').append($dropdown);

                // Position just below the button
                const rect = $btn[0].getBoundingClientRect();
                const dropdownWidth = $dropdown.outerWidth();
                const windowWidth = $(window).width();

                let left = rect.left + window.scrollX;

                if (left + dropdownWidth > windowWidth - 10) {
                    left = windowWidth - dropdownWidth - 10;
                }

                $dropdown.css({
                    left: left + 'px',
                    top: rect.bottom + window.scrollY + 'px'
                });
            })
            .catch(error => {
                let response = JSON.parse(error.message);
                console.log(response);
            });
    });

    // Close on outside click
    $(document).on('click', function (event) {
        let $target = $(event.target);
        if (!$target.closest('.comment-options-dropdown').length && !$target.closest('.more-options-unique').length) {
            $('.comment-options-dropdown').remove();
        }
    });
});



// Click on delete option
$(document).on('click', '.delete-option', function (event) {
    event.preventDefault();
    event.stopPropagation();

    let $button = $(this);
    let id = $button.data('id');
    let type = $button.data('type');

    console.log('Delete clicked - ID:', id, 'Type:', type, 'Button:', $button);

    let data = {
        'id': id,
        'type': type
    };

    fetch('http://localhost:8080/api/v1/chapter/comment/reply/delete', {
        method: 'DELETE',
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

            // Debug the DOM path
            let $cardToRemove = $button.closest(type === 'comment' ? '.comment-card-container' : '.reply-card-container');
            console.log('Closest card found:', $cardToRemove);

            // Fallback: Search by data-id if closest fails
            if ($cardToRemove.length === 0) {
                console.log('Closest failed, searching by data-id');
                if (type === 'comment') {
                    $cardToRemove = $(`.comment-card-container[data-comment-id="${id}"]`);
                } else {
                    $cardToRemove = $(`.reply-card-container[data-reply-id="${id}"]`);
                }
                console.log('Searched card:', $cardToRemove);
            }

            if ($cardToRemove.length > 0) {
                $cardToRemove.remove();
                console.log(`Removed ${type} with ID: ${id}`);
            } else {
                console.log(`No ${type} found with ID: ${id} to remove`);
            }

            // Remove the dropdown
            $('.comment-options-dropdown').remove();
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log('Error:', response);
        });
});

// Close model when clicking the close button
$(document).on('click', '.close-btn', function () {
    $('.paragraph-comments-drawer').remove();
});




//when click on like icon on reply add or remove like
$(document).on('click','.like-btn-reply',function (event) {
    let replyId = $(this).data('reply-id');
    let paragraphCommentId = $(this).data('paragraph-comment-id');

    fetch('http://localhost:8080/api/v1/paragraph/comment/reply/like/'+replyId, {
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

            if(data.data==='Liked'){
                $(this).find('svg').attr('fill','#ff6122');
                $(this).find('svg').find('path').attr('fill','#ff6122');
                $(this).find('svg').find('path').attr('stroke','#ff6122');

                if ($(this).siblings('.text-caption').length) {
                    let value = $(this).siblings('.text-caption').text();
                    let no = Number(value);
                    no+=1;
                    $(this).siblings('.text-caption').text(no);
                } else {
                    let newCaption = $('<span class="text-caption" style="font-weight: 700; font-size: 12px; color: #121212;">1</span>');
                    $(this).after(newCaption);
                }
            } else {
                $(this).find('svg').attr('fill','none');
                $(this).find('svg').find('path').attr('fill','none');
                $(this).find('svg').find('path').attr('stroke','#121212');

                if ($(this).siblings('.text-caption').length) {
                    let value = $(this).siblings('.text-caption').text();
                    let no = Number(value);
                    no-=1;

                    if(no<=0){
                        $(this).siblings('.text-caption').remove();
                    } else {
                        $(this).siblings('.text-caption').text(no);
                    }
                }
            }
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log('Error:', response);
        });
});


//when click on reply btn show the input field
$(document).on('click','.reply-btn',function (event) {
    let paragraphCommentId = $(this).data('paragraph-comment-id');
    let replyContainer = $(this).closest(".comment-card-container").find(".reply-container");

    if (replyContainer.prev(".reply-input-field").length === 0) {
        let inputField = `
<div class="new-comment-field reply reply-input-field">
    <div>
        <div class="textboxContainer__mbQss">
            <textarea placeholder="Write a reply..." class="text-body-sm defaultHeight__PP_LO" aria-label="Write a reply" spellcheck="false" style="height: 48px;"></textarea>
            <button class="send-reply-btn" data-paragraph-comment-id="${paragraphCommentId}" type="button" disabled="" aria-label="send">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.2424 13.7576L1.59386 9.91382C0.766235 9.54598 0.81481 8.35534 1.66965 8.05615L21.6485 1.06354C21.6779 1.05253 21.7077 1.04296 21.7378 1.03481C22.096 0.935758 22.4419 1.04489 22.6811 1.26776C22.6899 1.27595 22.6985 1.28433 22.7071 1.29289C22.7157 1.30146 22.7241 1.31014 22.7322 1.31893C22.9554 1.55835 23.0645 1.90478 22.9649 2.26344C22.9568 2.29301 22.9474 2.32229 22.9366 2.35116L15.9439 22.3304C15.6447 23.1852 14.454 23.2338 14.0862 22.4061L10.2424 13.7576ZM18.1943 4.39148L4.71107 9.11061L10.7785 11.8073L18.1943 4.39148ZM12.1927 13.2215L14.8894 19.2889L19.6085 5.80568L12.1927 13.2215Z" fill="#111111"></path></svg>
            </button>
        </div>
    </div>
</div>`;
        replyContainer.before(inputField);
    }
});


$(document).on('input', '.reply-input-field textarea', function () {
    let btn = $(this).closest('.reply-input-field').find('.send-reply-btn');
    if ($(this).val().trim().length > 0) {
        btn.prop('disabled', false);
    } else {
        btn.prop('disabled', true);
    }
});


//click on send btn in reply input field send add a reply to a comment
$(document).on('click','.send-reply-btn',function (event) {
    let thisElement = $(this);
    let card = thisElement.closest('.comment-card-container');
    let replyBtn = card.find('.reply-btn');
    let viewRepliesBtn = card.find('.view-replies-btn');
    let replyContainer = card.find('.reply-container');
    let replyText = $(this).closest('.reply-input-field').find('textarea').val();
    let paragraphCommentId = $(this).data('paragraph-comment-id');

    let data = {
        'replyMessage': replyText
    };

    fetch('http://localhost:8080/api/v1/paragraph/comment/reply/'+paragraphCommentId, {
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
            console.log('Reply added:', data);
            // Remove input field
            thisElement.closest('.reply-input-field').remove();
            // Hide view replies button
            viewRepliesBtn.hide();
            // Ensure reply container is visible
            replyContainer.show();
            // Reload all replies to include the new one
            loadRepliesByParagraphCommentId(paragraphCommentId, replyBtn);
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log('Error:', response);
        });
});


//when click on the reply button in reply add a reply to a reply
$(document).on('click', '.reply-reply-btn', function (event) {
    let thisElement = $(this);
    let replyCard = thisElement.closest('.reply-card-container');
    let paragraphCommentId = replyCard.data('paragraph-comment-id');

    if (replyCard.find('.replyTo.reply').length === 0) {
        let username = thisElement.closest('.comment-card-container').find('h3.title-action').text().trim();
        let inputField = `
        <div class="new-comment-field replyTo reply">
            <div class="reply-to-user">Replying to ${username}</div>
            <div>
                <div class="textboxContainer__mbQss">
                    <textarea placeholder="Write a reply..." 
                              class="text-body-sm defaultHeight__PP_LO" 
                              spellcheck="true" 
                              style="height: 48px;" data-username="${username}">@${username} </textarea>
                    <button data-paragraph-comment-id="${paragraphCommentId}" class="send-reply-reply-btn" type="button" disabled="" aria-label="send">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.2424 13.7576L1.59386 9.91382C0.766235 9.54598 0.81481 8.35534 1.66965 8.05615L21.6485 1.06354C21.6779 1.05253 21.7077 1.04296 21.7378 1.03481C22.096 0.935758 22.4419 1.04489 22.6811 1.26776C22.6899 1.27595 22.6985 1.28433 22.7071 1.29289C22.7157 1.30146 22.7241 1.31014 22.7322 1.31893C22.9554 1.55835 23.0645 1.90478 22.9649 2.26344C22.9568 2.29301 22.9474 2.32229 22.9366 2.35116L15.9439 22.3304C15.6447 23.1852 14.454 23.2338 14.0862 22.4061L10.2424 13.7576ZM18.1943 4.39148L4.71107 9.11061L10.7785 11.8073L18.1943 4.39148ZM12.1927 13.2215L14.8894 19.2889L19.6085 5.80568L12.1927 13.2215Z" fill="#111111"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>`;
        replyCard.append(inputField);
    }
});


$(document).on('input', '.replyTo textarea', function () {
    let btn = $(this).closest('.replyTo').find('.send-reply-reply-btn');
    let replyText = $(this).val().trim();
    let repliedUsername = $(this).data('username');
    repliedUsername = '@' + repliedUsername;
    let usernameLength = repliedUsername.length;
    let actualReply = replyText.substring(usernameLength).trim();
    if (actualReply.length > 0) {
        btn.prop('disabled', false);
    } else {
        btn.prop('disabled', true);
    }
});


//click on send btn in reply reply input field send add a reply to a reply
// $(document).on('click', '.send-reply-reply-btn', function (event) {
//     let thisElement = $(this);
//     let paragraphCommentId = $(this).data('paragraph-comment-id');
//     let replyText = thisElement.closest('.replyTo.reply').find('textarea').val().trim();
//     let repliedUsername = thisElement.closest('.replyTo.reply').find('textarea').data('username');
//     repliedUsername = '@' + repliedUsername;
//     let usernameLength = repliedUsername.length;
//     let actualReply = replyText.substring(usernameLength).trim();
//
//     if (replyText === repliedUsername || replyText.length <= 0 || actualReply.length <= 0) {
//         return;
//     }
//
//     let data = { 'replyMessage': repliedUsername + ' ' + actualReply };
//
//     fetch('http://localhost:8080/api/v1/paragraph/comment/reply/' + paragraphCommentId, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
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
//             console.log('Reply-to-reply added:', data);
//             // Remove input field
//             thisElement.closest('.replyTo.reply').remove();
//             // Find the main comment card
//             let mainCard = thisElement.parents('.comment-card-container').last();
//             let replyBtn = mainCard.find('.reply-btn');
//             let viewRepliesBtn = mainCard.find('.view-replies-btn');
//             let replyContainer = mainCard.find('.reply-container');
//             // Hide view replies button
//             viewRepliesBtn.hide();
//             // Ensure reply container is visible
//             replyContainer.show();
//             // Immediately append the new reply to the UI
//             let newReply = `
//               <div class="comment-card-container reply-card-container" data-paragraph-comment-id="${paragraphCommentId}">
//                 <div>
//                   <div class="dsContainer__RRG6K commentCardContainer__P0qWo replyCard__Ft5hc">
//                     <div class="dsColumn__PqDUP">
//                       <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${data.userId}" aria-label="${data.username}">
//                         <img style="object-fit: cover;" src="${data.userProfilePic || '/default-profile.png'}" aria-hidden="true" alt="${data.username}" class="avatar__Ygp0_ comment_card_reply_avatar__niNAw">
//                       </a>
//                     </div>
//                     <div class="dsColumn__PqDUP commentCardContentContainer__F9gGk gap8__gx3K6">
//                       <div class="dsRow__BXK6n gap8__gx3K6 authorProfileRow__GMsIH">
//                         <h3 aria-hidden="true" class="dsMargin__Gs6Tj title-action">${data.username}</h3>
//                         <div class="dsRow__BXK6n badgeRow__bzi6i">
//                           ${data.isCommentByAuthor === 1
//                 ? `<div class="pill__HVTvX text-caption" style="color: rgb(255, 255, 255); background-color: rgb(169, 62, 25);">Writer</div>`
//                 : ``
//             }
//                         </div>
//                       </div>
//                       <div class="dsRow__BXK6n commentCardContent__Vc9vg">
//                         <pre class="text-body-sm" style="color: #222;">${data.replyMessage}</pre>
//                       </div>
//                       <div class="dsRow__BXK6n commentCardContent__Vc9vg commentCardMeta__Xy9U9">
//                         <p class="postedDate__xcq5D text-caption">${data.time}</p>
//                         <button class="replyButton__kdyts button__Meavz text-meta reply-reply-btn" style="font-size: 12px; font-weight: 700;" aria-label="Reply to comment">Reply</button>
//                       </div>
//                     </div>
//                     <div class="dsColumn__PqDUP likeColumn__bveEu">
//                       <button class="button__Meavz" aria-label="More options">
//                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 12C17 13.1046 17.8954 14 19 14Z" fill="#686868"></path></svg>
//                       </button>
//                       <div class="dsColumn__PqDUP">
//                         <button class="button__Meavz like-btn-reply" data-reply-id="${data.replyId}" data-paragraph-comment-id="${paragraphCommentId}" aria-label="Like this comment">
//                           <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#121212" stroke-width="1.5" stroke-linecap="round"></path></svg>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             `;
//             replyContainer.append(newReply);
//             // Scroll to the new reply
//             replyContainer.find('.reply-card-container').last()[0].scrollIntoView({ behavior: 'smooth' });
//             // Reload all replies to ensure consistency with backend data
//             loadRepliesByParagraphCommentId(paragraphCommentId, replyBtn);
//         })
//         .catch(error => {
//             let response = JSON.parse(error.message);
//             console.log('Error:', response);
//         });
// });


$(document).on('click', '.send-reply-reply-btn', function (event) {
    let thisElement = $(this);
    let paragraphCommentId = $(this).data('paragraph-comment-id');
    let replyText = thisElement.closest('.replyTo.reply').find('textarea').val().trim();
    let repliedUsername = thisElement.closest('.replyTo.reply').find('textarea').data('username');
    repliedUsername = '@' + repliedUsername;
    let usernameLength = repliedUsername.length;
    let actualReply = replyText.substring(usernameLength).trim();

    if (replyText === repliedUsername || replyText.length <= 0 || actualReply.length <= 0) {
        return;
    }

    let data = { 'replyMessage': repliedUsername + ' ' + actualReply };

    fetch('http://localhost:8080/api/v1/paragraph/comment/reply/' + paragraphCommentId, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
            console.log('Reply-to-reply added:', data);
            // Remove input field
            thisElement.closest('.replyTo.reply').remove();
            // Find the main comment card
            let mainCard = thisElement.parents('.comment-card-container').last();
            let replyBtn = mainCard.find('.reply-btn');
            let viewRepliesBtn = mainCard.find('.view-replies-btn');
            let replyContainer = mainCard.find('.reply-container');
            // Hide view replies button
            viewRepliesBtn.hide();
            // Ensure reply container is visible
            replyContainer.show();
            // Find the replied-to reply card (parent of the reply-reply-btn)
            let repliedToCard = thisElement.closest('.reply-card-container');
            // Immediately append the new reply after the replied-to reply
            let newReply = `
              <div class="comment-card-container reply-card-container" data-paragraph-comment-id="${paragraphCommentId}">
                <div>
                  <div class="dsContainer__RRG6K commentCardContainer__P0qWo replyCard__Ft5hc">
                    <div class="dsColumn__PqDUP">
                      <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${data.userId}" aria-label="${data.username}">
                        <img style="object-fit: cover;" src="${data.userProfilePic || '/default-profile.png'}" aria-hidden="true" alt="${data.username}" class="avatar__Ygp0_ comment_card_reply_avatar__niNAw">
                      </a>
                    </div>
                    <div class="dsColumn__PqDUP commentCardContentContainer__F9gGk gap8__gx3K6">
                      <div class="dsRow__BXK6n gap8__gx3K6 authorProfileRow__GMsIH">
                        <h3 aria-hidden="true" class="dsMargin__Gs6Tj title-action">${data.username}</h3>
                        <div class="dsRow__BXK6n badgeRow__bzi6i">
                          ${data.isCommentByAuthor === 1
                ? `<div class="pill__HVTvX text-caption" style="color: rgb(255, 255, 255); background-color: rgb(169, 62, 25);">Writer</div>`
                : ``
            }
                        </div>
                      </div>
                      <div class="dsRow__BXK6n commentCardContent__Vc9vg">
                        <pre class="text-body-sm" style="color: #222;">${data.replyMessage}</pre>
                      </div>
                      <div class="dsRow__BXK6n commentCardContent__Vc9vg commentCardMeta__Xy9U9">
                        <p class="postedDate__xcq5D text-caption">${data.time}</p>
                        <button class="replyButton__kdyts button__Meavz text-meta reply-reply-btn" style="font-size: 12px; font-weight: 700;" aria-label="Reply to comment">Reply</button>
                      </div>
                    </div>
                    <div class="dsColumn__PqDUP likeColumn__bveEu">
                      <button class="button__Meavz" aria-label="More options">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 12C17 13.1046 17.8954 14 19 14Z" fill="#686868"></path></svg>
                      </button>
                      <div class="dsColumn__PqDUP">
                        <button class="button__Meavz like-btn-reply" data-reply-id="${data.replyId}" data-paragraph-comment-id="${paragraphCommentId}" aria-label="Like this comment">
                          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#121212" stroke-width="1.5" stroke-linecap="round"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
            // Append the new reply after the replied-to reply
            repliedToCard.after(newReply);
            // Scroll to the new reply
            $(newReply).find('.reply-card-container')[0].scrollIntoView({ behavior: 'smooth' });
            // Reload all replies to ensure consistency with backend data
            loadRepliesByParagraphCommentId(paragraphCommentId, replyBtn);
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log('Error:', response);
        });
});




//load first two comments of chapter
let commentCount = 2;
async function loadFirstTwoCommentsOfChapter() {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/chapter/comment/'+chapterId+'/'+2, {
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

                $('.bottom-comment-field').after('<div><div class="comments-empty-stage"><img src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/no-comments.svg" id="no-comments-graphics" alt=""><p class="message">Be the first to comment 💬</p></div></div>');

            }
            else{
                let bottomField = $('.bottom-comment-field');
                bottomField.siblings('.comment-card-container').remove();

                let showMoreBtn = `
                <!--show more comment button-->
                <div class="show-more-btn">
                    <button class="button__Y70Pw secondary-variant__KvdoY default-accent__Pc0Pm medium-size__CLqD3 clickable__iYXtN full-width__dXWyx with-padding__cVt72">
                        <span class="background-overlay__mCEaX"></span>Show more
                    </button>
                </div>`;

                if ($('.show-more-btn').length === 0) {
                    bottomField.after(showMoreBtn);
                }

                for (let i = 0; i < data.data.length; i++) {

                    let comment = data.data[i];

                    let singleChapterComment = `
                    <!--single comment-->
                      <div class="comment-card-container" style="padding-inline: 12px;">
                        <div>
                          <div class="dsContainer__RRG6K commentCardContainer__P0qWo">
                            <div class="dsColumn__PqDUP">
                              <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${comment.userId}" aria-label="Lio_tiger007">
                                <img style="object-fit: cover;" src="${comment.userProfilePic}" aria-hidden="true" alt="Lio_tiger007" class="avatar__Ygp0_ comment_card_avatar__zKv1t">
                              </a>
                            </div>
                            <div class="dsColumn__PqDUP commentCardContentContainer__F9gGk gap8__gx3K6">
                              <div class="dsRow__BXK6n gap8__gx3K6 authorProfileRow__GMsIH">
                                <h3 aria-hidden="true" class="dsMargin__Gs6Tj title-action">${comment.username}</h3>
                                <div class="dsRow__BXK6n badgeRow__bzi6i">
                                    ${comment.isCommentByAuthor===1
                                    ? `<div class="pill__HVTvX text-caption" style="color: rgb(255, 255, 255); background-color: rgb(169, 62, 25);">Writer</div>`
                                    : ``
                                    }
                                </div>
                              </div>
                              <div class="dsRow__BXK6n commentCardContent__Vc9vg">
                                <pre class="text-body-sm">${comment.commentMessage}</pre>
                              </div>
                              <div class="dsRow__BXK6n commentCardContent__Vc9vg commentCardMeta__Xy9U9">
                                <p class="postedDate__xcq5D text-caption">${comment.time}</p>
<!--                                <button class="replyButton__kdyts button__Meavz title-action" aria-label="Reply to comment">Reply</button>-->
                              </div>
                            </div>
                            <div class="dsColumn__PqDUP likeColumn__bveEu">
                              <button data-id="${comment.id}" data-type="chapterComment" class="button__Meavz more-options-unique" aria-label="More options">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z" fill="#686868"></path></svg>
                              </button>
                              <div class="dsColumn__PqDUP">
                                <button class="button__Meavz chapter-comment-like-btn" data-chapter-comment-id="${comment.id}" aria-label="Like this comment">
                                    ${comment.isCurrentUserLiked===1
                                    ? `<svg data-chapter-comment-id="${comment.id}" width="16" height="14" viewBox="0 0 16 14" fill="#ff6122" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#ff6122" fill="#ff6122" stroke-width="1.5" stroke-linecap="round"></path></svg>`
                                    : `<svg data-chapter-comment-id="${comment.id}" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#121212" stroke-width="1.5" stroke-linecap="round"></path></svg>`
                                    }
                                </button>
                                ${comment.likes!=='0'
                                ? `<span class="text-caption" style="font-weight: 700; font-size: 12px ; color: #121212;">${comment.likes}</span>`
                                : ``
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
`
                    bottomField.after(singleChapterComment);
                }
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
}




//when click on like icon on comment add or remove like
$(document).on('click','.chapter-comment-like-btn',function (event) {

    let chapterCommentId = $(this).data('chapter-comment-id');
    console.log(chapterCommentId)
    console.log('-------------');

    fetch('http://localhost:8080/api/v1/chapter/comment/like/'+chapterCommentId, {
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

            if(data.data==='Liked'){
                $(this).find('svg').attr('fill','#ff6122');
                $(this).find('svg').find('path').attr('fill','#ff6122');
                $(this).find('svg').find('path').attr('stroke','#ff6122');

                if ($(this).siblings('.text-caption').length) {
                    let value = $(this).siblings('.text-caption').text();
                    let no = Number(value);
                    no+=1;
                    $(this).siblings('.text-caption').text(no);
                }
                else{
                    let newCaption = $('<span class="text-caption" style="font-weight: 700; font-size: 12px ; color: #121212;">1</span>');
                    $(this).after(newCaption);
                }
            }
            else{
                $(this).find('svg').attr('fill','none');
                $(this).find('svg').find('path').attr('fill','none');
                $(this).find('svg').find('path').attr('stroke','#121212');

                if ($(this).siblings('.text-caption').length) {
                    let value = $(this).siblings('.text-caption').text();
                    let no = Number(value);
                    no-=1;

                    if(no<=0){
                        $(this).siblings('.text-caption').remove();
                    }
                    else {
                        $(this).siblings('.text-caption').text(no);
                    }
                }
            }

            // paragraphCommentsSetToTheModel(paragraphId);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });

});




//load more comments
$(document).on('click','.show-more-btn',async function (event) {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    commentCount+=10;

    await fetch('http://localhost:8080/api/v1/chapter/comment/'+chapterId+'/'+commentCount, {
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

                $('.bottom-comment-field').after('<div><div class="comments-empty-stage"><img src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/no-comments.svg" id="no-comments-graphics" alt=""><p class="message">Be the first to comment 💬</p></div></div>');

            }
            else{
                let bottomField = $('.bottom-comment-field');
                bottomField.siblings('.comment-card-container').remove();

                for (let i = 0; i < data.data.length; i++) {

                    let comment = data.data[i];

                    let singleChapterComment = `
                    <!--single comment-->
                      <div class="comment-card-container" style="padding-inline: 12px;">
                        <div>
                          <div class="dsContainer__RRG6K commentCardContainer__P0qWo">
                            <div class="dsColumn__PqDUP">
                              <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${comment.userId}" aria-label="Lio_tiger007">
                                <img style="object-fit: cover;" src="${comment.userProfilePic}" aria-hidden="true" alt="Lio_tiger007" class="avatar__Ygp0_ comment_card_avatar__zKv1t">
                              </a>
                            </div>
                            <div class="dsColumn__PqDUP commentCardContentContainer__F9gGk gap8__gx3K6">
                              <div class="dsRow__BXK6n gap8__gx3K6 authorProfileRow__GMsIH">
                                <h3 aria-hidden="true" class="dsMargin__Gs6Tj title-action">${comment.username}</h3>
                                <div class="dsRow__BXK6n badgeRow__bzi6i">
                                    ${comment.isCommentByAuthor===1
                        ? `<div class="pill__HVTvX text-caption" style="color: rgb(255, 255, 255); background-color: rgb(169, 62, 25);">Writer</div>`
                        : ``
                    }
                                </div>
                              </div>
                              <div class="dsRow__BXK6n commentCardContent__Vc9vg">
                                <pre class="text-body-sm">${comment.commentMessage}</pre>
                              </div>
                              <div class="dsRow__BXK6n commentCardContent__Vc9vg commentCardMeta__Xy9U9">
                                <p class="postedDate__xcq5D text-caption">${comment.time}</p>
<!--                                <button class="replyButton__kdyts button__Meavz title-action" aria-label="Reply to comment">Reply</button>-->
                              </div>
                            </div>
                            <div class="dsColumn__PqDUP likeColumn__bveEu">
                              <button data-id="${comment.id}" data-type="chapterComment" class="button__Meavz more-options-unique" aria-label="More options">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z" fill="#686868"></path></svg>
                              </button>
                              <div class="dsColumn__PqDUP">
                                <button class="button__Meavz chapter-comment-like-btn" data-chapter-comment-id="${comment.id}" aria-label="Like this comment">
                                    ${comment.isCurrentUserLiked===1
                        ? `<svg width="16" height="14" viewBox="0 0 16 14" fill="#ff6122" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#ff6122" fill="#ff6122" stroke-width="1.5" stroke-linecap="round"></path></svg>`
                        : `<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.34234 1.76718L9.34246 1.76706C9.66387 1.44447 10.0454 1.18869 10.4651 1.01423C10.8848 0.839765 11.3345 0.75 11.7887 0.75C12.2429 0.75 12.6926 0.839765 13.1123 1.01423C13.532 1.18869 13.9135 1.44447 14.2349 1.76706L14.2352 1.76731C14.5568 2.08975 14.812 2.47273 14.9862 2.89442C15.1603 3.31611 15.25 3.76819 15.25 4.22479C15.25 4.68139 15.1603 5.13346 14.9862 5.55515C14.812 5.97684 14.5568 6.35982 14.2352 6.68226L14.2351 6.68239L13.4237 7.49635L7.99979 12.9376L2.57588 7.49635L1.76452 6.68239C1.11521 6.031 0.75 5.14702 0.75 4.22479C0.75 3.30255 1.11521 2.41857 1.76452 1.76718C2.41375 1.11588 3.29378 0.750411 4.21089 0.750411C5.128 0.750411 6.00803 1.11588 6.65726 1.76718L7.46862 2.58114L7.9998 3.11402L8.53097 2.58114L9.34234 1.76718Z" stroke="#121212" stroke-width="1.5" stroke-linecap="round"></path></svg>`
                    }
                                </button>
                                ${comment.likes!=='0'
                        ? `<span class="text-caption" style="font-weight: 700; font-size: 12px ; color: #121212;">${comment.likes}</span>`
                        : ``
                    }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
`
                    bottomField.after(singleChapterComment);
                }
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
});




$(document).on('input', '.bottom-comment-field textarea', function () {
    let btn = $(this).closest('.bottom-comment-field').find('.send-chapter-comment-btn');
    if ($(this).val().trim().length > 0) {
        btn.prop('disabled', false);
    } else {
        btn.prop('disabled', true);
    }
});



//click on send btn in reply input field send add a reply to a comment
$(document).on('click','.send-chapter-comment-btn',function (event) {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    let commentText = $(this).closest('.bottom-comment-field').find('textarea').val();

    let data = {
        'replyMessage': commentText
    }

    fetch('http://localhost:8080/api/v1/chapter/comment/'+chapterId, {
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

            $(this).closest('.bottom-comment-field').find('textarea').val('');
            $('.comments-empty-stage').closest('div').remove();

            loadFirstTwoCommentsOfChapter();

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });

});




// Load "My Library"
function loadLibrary($dropdown, chapterId) {

    return fetch('http://localhost:8080/api/v1/library/check/story/' + chapterId, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },

    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(JSON.stringify(errData)); });
            }
            return response.json();
        })
        .then(data => {
            const $ul = $dropdown.find('.lists-menu');
            $ul.empty();

            $ul.append(`
                <li>
                  <a class="on-modify-list my-library" data-list-id="0">
                    <span class="fa fa-library fa-wp-neutral-2"></span>
                    <span class="reading-list-name">My Library (Private)</span>
                    ${data.data === true
                ? `<div class="status" style="transform: translateX(25px);">
                              <i class="fa-regular fa-circle-check" style="color: #00b2b2; font-size: 17px; transform: translateX(27px);"></i>
                           </div>`
                : ``}
                  </a>
                </li>
            `);
        });
}

//add story to library
$(document).on('click','.my-library',function (event) {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    fetch('http://localhost:8080/api/v1/library/add/remove/story/byChapter/'+chapterId, {
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

            let chapterId = new URLSearchParams(window.location.search).get("chapterId");
            const $dropdown = $(this).closest('.add-to-library');
            refreshLists($dropdown, chapterId);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
});


// Load all reading lists
function loadReadingLists($dropdown, chapterId) {

    return fetch('http://localhost:8080/api/v1/readingList/all/check/story/' + chapterId, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },

    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(JSON.stringify(errData)); });
            }
            return response.json();
        })
        .then(data => {
            const $ul = $dropdown.find('.lists-menu');

            data.data.forEach(list => {
                $ul.append(`
                    <li>
                      <a class="on-modify-list my-list" data-list-id="${list.readingListId}">
                        <span class="fa fa-reading-list fa-wp-neutral-2"></span>
                        <span class="reading-list-name">${list.listName}</span>
                        ${list.isStoryExit === 1
                    ? `<div class="status" style="transform: translateX(25px);">
                                  <i class="fa-regular fa-circle-check" style="color: #00b2b2; font-size: 17px; transform: translateX(27px);"></i>
                               </div>`
                    : ``}
                      </a>
                    </li>
                `);
            });
        });
}


//add story to library
$(document).on('click','.my-list',function (event) {

    let chapterId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        chapterId = params.get("chapterId");
    }

    if(chapterId==null){
        //load chapter not found page
        return;
    }

    let listId = $(this).data('list-id');
    console.log(listId);

    fetch('http://localhost:8080/api/v1/readingList/add/remove/story/byChapter/'+listId+'/'+chapterId, {
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

            let chapterId = new URLSearchParams(window.location.search).get("chapterId");
            const $dropdown = $(this).closest('.add-to-library');
            refreshLists($dropdown, chapterId);

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
});


// Wrapper to refresh both Library + Reading Lists
function refreshLists($dropdown, chapterId) {

    return Promise.all([
        loadLibrary($dropdown, chapterId),
        loadReadingLists($dropdown, chapterId)
    ]);
}


// Open dropdown
$(document).on('click', '.on-lists-add-clicked', function (e) {

    e.preventDefault();

    let chapterId = new URLSearchParams(window.location.search).get("chapterId");
    if (!chapterId) return;

    const $dropdown = $(this).closest('.button-group').find('.add-to-library');

    // Reload lists each time before showing
    refreshLists($dropdown, chapterId).then(() => {
        $dropdown.css({
            display: 'block',
            visibility: 'visible',
            opacity: 1
        });
    });
});


// Close dropdown when clicking outside
$(document).on('click', function (e) {

    if (!$(e.target).closest('.button-group').length) {
        $('.add-to-library').css({
            display: 'none',
            visibility: 'hidden',
            opacity: 0
        });
    }
});


// Create new reading list
$(document).on('click', '.on-create-list', function () {

    const listName = $('#new-reading-list').val().trim();
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
                    throw new Error(JSON.stringify(err)); });
            }
            return response.json();
        })
        .then(data => {
            $('#new-reading-list').val('');

            if (data.data === false) {
                alert("Reading list with this name already exists, try another.");
            } else {
                let chapterId = new URLSearchParams(window.location.search).get("chapterId");
                const $dropdown = $(this).closest('.add-to-library');
                refreshLists($dropdown, chapterId);
            }

        })
        .catch(error => {
            console.error("Error creating list:", error);
            alert("Failed to create reading list. Try again.");
        });
});










//header js
let search = $('.search')[0];
search.addEventListener('click',function (event) {

    window.location.href = 'http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search.html';
});

function headerData() {

    fetch('http://localhost:8080/user/current', {
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
            console.log('POST Data:', data);
            const currentUser = data.data;

            $('.your-profile').attr('href',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${currentUser.id}`);
            if(currentUser.profilePicPath!=null){
                $('.user-profile-pic').attr('src',`${currentUser.profilePicPath}`);
            }
            else{
                $('.user-profile-pic').attr('src',`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnFRPx77U9mERU_T1zyHcz9BOxbDQrL4Dvtg&s`);
            }

        })
        .catch(error => {
            console.error('Fetch error:', error.message);
            let response = JSON.parse(error.message);
        });
}
headerData();















