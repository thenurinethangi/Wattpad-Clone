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

loadChapterData();