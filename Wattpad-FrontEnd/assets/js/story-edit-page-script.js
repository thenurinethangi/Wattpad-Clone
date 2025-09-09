//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/story', {
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

            if (params.has("storyId")) {

                let storyId = params.get("storyId");

                fetch('http://localhost:8080/api/v1/story/isCurrentUser/'+storyId, {
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
                            document.body.style.display = 'block';
                            document.body.style.visibility = 'visible';
                            document.body.style.opacity = 1;
                        }
                        else {
                            //set alert saying you have no access to this
                            window.location.href = 'home-page.html';
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




//load all chapters
async function loadAllChapters() {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if(storyId==null){
        //load story not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/story/chapters/'+storyId, {
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

            $('.table-of-content-tab').addClass('active');
            $('.story-details-tab').removeClass('active');

            $('.chapters-container').empty();
            for (let i = 0; i < data.data.length; i++) {

                let chapter = data.data[i];

                let singleChapter = `<!--a single chapter-->
                      <div class="story-part drag-item">
                        <div class="drag-handle vcenter">
                          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <path d="M4 6h16" />
                                <path d="M4 12h16" />
                                <path d="M4 18h16" />
                            </g>
                          </svg>
                        </div>
                        <div class="part-meta vcenter">
                          <div class="part-name col-xs-12">
                            <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/create-chapter-page.html?storyId=${storyId}" class="auto-shorten on-navigate">${chapter.chapterTitle}</a>
                          </div>
                          <div class="part-detail">
                            <div class="col-xs-10 col-sm-5">
                                ${chapter.publishedOrDraft===1
                                ? `<span class="publish-state text-body-sm published">Published</span>`
                                : `<span class="publish-state text-body-sm">Draft</span>`
                                }
                              <span> - ${chapter.publishedDate}</span>
                            </div>
                            <div class="col-xs-10 col-sm-5">
                              <div class="meta">
                                <div class="col-xs-4">
                                    <svg style="transform: translateY(2px);" width="13" height="13" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg>
                                    ${chapter.views}
                                </div>
                                <div class="col-xs-4">
                                    <svg style="transform: translateY(2px);" width="13" height="13" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg>
                                    ${chapter.likes}
                                </div>
                                <div class="col-xs-4">
                                   <svg style="transform: translateY(2px);" 
     width="13" height="13" viewBox="0 0 24 24" 
     fill="none" 
     stroke="rgba(18, 18, 18, 0.64)" 
     stroke-width="2" 
     stroke-linecap="round" 
     stroke-linejoin="round" 
     aria-hidden="true" 
     class="stats-label__icon">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>
                                    ${chapter.comments}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!--3 dots btn-->
                        <div class="button-group vcenter dropdown">
                          <button class="btn btn-white dropdown-toggle" data-toggle="dropdown" aria-controls="profile-more-options-1563628382" aria-expanded="false" aria-label="More options button.">
                            <i style="transform: rotate(90deg);" class="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                          <!--when click on 3 dots this will show-->
                          <ul id="works-more-options-1563628382" class="dropdown-menu align-right" role="menu">
                            <li role="none">
                              <a target="_blank" href="/1563628382-temp-2-temp-part-1" data-url="/1563628382-temp-2-temp-part-1" class="on-view-as-reader" data-id="1563628382" data-attr="wid-toc" role="menuitem">
                                View as reader
                              </a>
                            </li>
                            <li role="none">
                              <a role="menuitem" href="" data-toggle="modal" class="on-unpublish-part" data-target="#details-modal" data-id="1563628382">Unpublish</a>
                            </li>
                            <li role="none">
                              <a role="menuitem" href="" data-toggle="modal" data-target="#details-modal" class="on-delete-published-part" data-id="1563628382">
                                Delete Part
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>`;

                $('.chapters-container').append(singleChapter);
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




//load story details
async function loadStoryDetails() {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if(storyId==null){
        //load story not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/story/chapters/'+storyId, {
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

            $('.table-of-content-tab').addClass('active');
            $('.story-details-tab').removeClass('active');

            $('.chapters-container').empty();
            for (let i = 0; i < data.data.length; i++) {

                let chapter = data.data[i];

                let singleChapter = `<!--a single chapter-->
                      <div class="story-part drag-item">
                        <div class="drag-handle vcenter">
                          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <path d="M4 6h16" />
                                <path d="M4 12h16" />
                                <path d="M4 18h16" />
                            </g>
                          </svg>
                        </div>
                        <div class="part-meta vcenter">
                          <div class="part-name col-xs-12">
                            <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${chapter.chapterId}" class="auto-shorten on-navigate">${chapter.chapterTitle}</a>
                          </div>
                          <div class="part-detail">
                            <div class="col-xs-10 col-sm-5">
                                ${chapter.publishedOrDraft===1
                    ? `<span class="publish-state text-body-sm published">Published</span>`
                    : `<span class="publish-state text-body-sm">Draft</span>`
                }
                              <span> - ${chapter.publishedDate}</span>
                            </div>
                            <div class="col-xs-10 col-sm-5">
                              <div class="meta">
                                <div class="col-xs-4">
                                    <svg style="transform: translateY(2px);" width="13" height="13" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M0.0703819 7.70186C0.164094 7.51443 0.339978 7.20175 0.596224 6.80498C1.02033 6.1483 1.52075 5.49201 2.09698 4.87737C3.77421 3.08833 5.7468 2 8 2C10.2532 2 12.2258 3.08833 13.903 4.87737C14.4792 5.49201 14.9797 6.1483 15.4038 6.80498C15.66 7.20175 15.8359 7.51443 15.9296 7.70186C16.0235 7.88954 16.0235 8.11046 15.9296 8.29814C15.8359 8.48557 15.66 8.79825 15.4038 9.19502C14.9797 9.8517 14.4792 10.508 13.903 11.1226C12.2258 12.9117 10.2532 14 8 14C5.7468 14 3.77421 12.9117 2.09698 11.1226C1.52075 10.508 1.02033 9.8517 0.596224 9.19502C0.339978 8.79825 0.164094 8.48557 0.0703819 8.29814C-0.0234606 8.11046 -0.0234606 7.88954 0.0703819 7.70186ZM1.71632 8.47165C2.0995 9.06496 2.55221 9.65868 3.06973 10.2107C4.5175 11.755 6.16991 12.6667 8.00004 12.6667C9.83017 12.6667 11.4826 11.755 12.9304 10.2107C13.4479 9.65868 13.9006 9.06496 14.2838 8.47165C14.3925 8.30325 14.489 8.14509 14.5729 8C14.489 7.85491 14.3925 7.69675 14.2838 7.52835C13.9006 6.93504 13.4479 6.34132 12.9304 5.78929C11.4826 4.24501 9.83017 3.33333 8.00004 3.33333C6.16991 3.33333 4.5175 4.24501 3.06973 5.78929C2.55221 6.34132 2.0995 6.93504 1.71632 7.52835C1.60756 7.69675 1.5111 7.85491 1.42718 8C1.5111 8.14509 1.60756 8.30325 1.71632 8.47165ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM8 9.33333C8.73638 9.33333 9.33333 8.73638 9.33333 8C9.33333 7.26362 8.73638 6.66667 8 6.66667C7.26362 6.66667 6.66667 7.26362 6.66667 8C6.66667 8.73638 7.26362 9.33333 8 9.33333Z"></path></g></svg>
                                    ${chapter.views}
                                </div>
                                <div class="col-xs-4">
                                    <svg style="transform: translateY(2px);" width="13" height="13" viewBox="0 0 16 16" fill="rgba(18, 18, 18, 0.64)" stroke="#222222" stroke-width="0" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="stats-label__icon"><g><path fill-rule="evenodd" clip-rule="evenodd" d="M6.53792 5.80206C6.44089 5.99863 6.25344 6.13493 6.03653 6.16664L2.76572 6.64472L5.13194 8.94941C5.28919 9.10257 5.36096 9.32332 5.32385 9.53968L4.76557 12.7948L7.68982 11.2569C7.88407 11.1548 8.11616 11.1548 8.31042 11.2569L11.2347 12.7948L10.6764 9.53968C10.6393 9.32332 10.711 9.10257 10.8683 8.94941L13.2345 6.64472L9.9637 6.16664C9.74679 6.13493 9.55934 5.99863 9.46231 5.80206L8.00012 2.83982L6.53792 5.80206ZM5.49723 4.89797L7.40227 1.03858C7.64683 0.543131 8.35332 0.543131 8.59788 1.03858L10.5029 4.89797L14.7632 5.52067C15.3098 5.60056 15.5276 6.27246 15.1319 6.6579L12.0498 9.6599L12.7771 13.901C12.8706 14.4456 12.2989 14.8609 11.8098 14.6037L8.00007 12.6002L4.19038 14.6037C3.70129 14.8609 3.12959 14.4456 3.223 13.901L3.95039 9.6599L0.868253 6.6579C0.472524 6.27246 0.690379 5.60056 1.23699 5.52067L5.49723 4.89797Z"></path></g></svg>
                                    ${chapter.likes}
                                </div>
                                <div class="col-xs-4">
                                   <svg style="transform: translateY(2px);" 
     width="13" height="13" viewBox="0 0 24 24" 
     fill="none" 
     stroke="rgba(18, 18, 18, 0.64)" 
     stroke-width="2" 
     stroke-linecap="round" 
     stroke-linejoin="round" 
     aria-hidden="true" 
     class="stats-label__icon">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>
                                    ${chapter.comments}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!--3 dots btn-->
                        <div class="button-group vcenter dropdown">
                          <button class="btn btn-white dropdown-toggle" data-toggle="dropdown" aria-controls="profile-more-options-1563628382" aria-expanded="false" aria-label="More options button.">
                            <i style="transform: rotate(90deg);" class="fa-solid fa-ellipsis-vertical"></i>
                          </button>
                          <!--when click on 3 dots this will show-->
                          <ul id="works-more-options-1563628382" class="dropdown-menu align-right" role="menu">
                            <li role="none">
                              <a target="_blank" href="/1563628382-temp-2-temp-part-1" data-url="/1563628382-temp-2-temp-part-1" class="on-view-as-reader" data-id="1563628382" data-attr="wid-toc" role="menuitem">
                                View as reader
                              </a>
                            </li>
                            <li role="none">
                              <a role="menuitem" href="" data-toggle="modal" class="on-unpublish-part" data-target="#details-modal" data-id="1563628382">Unpublish</a>
                            </li>
                            <li role="none">
                              <a role="menuitem" href="" data-toggle="modal" data-target="#details-modal" class="on-delete-published-part" data-id="1563628382">
                                Delete Part
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>`;

                $('.chapters-container').append(singleChapter);
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




//click new part btn
let onNewPartBtn = $('.on-new-part')[0];
onNewPartBtn.addEventListener('click',function (event) {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if(storyId==null){
        //load story not found page
        return;
    }

    window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/create-chapter-page.html?storyId=${storyId}`;
});




async function run() {
    await loadAllChapters();

}

run();











