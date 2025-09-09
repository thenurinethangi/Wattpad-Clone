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

            $('.main-edit-form').addClass('hidden');
            $('.table-of-contents').removeClass('hidden');

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
                              <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${chapter.chapterId}" class="on-view-as-reader" role="menuitem">
                                View as reader
                              </a>
                            </li>
                            ${chapter.publishedOrDraft===1
                            ? `<li role="none">
                                <a data-chapter-id="${chapter.chapterId}" role="menuitem" href="" data-toggle="modal" class="on-unpublish-part" data-target="#details-modal">Unpublish</a>
                               </li>`
                            : ``
                            }
                            <li role="none">
                              <a data-chapter-id="${chapter.chapterId}" role="menuitem" href="" data-toggle="modal" data-target="#details-modal" class="on-delete-published-part" data-id="1563628382">
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




//load story details when page loading
async function loadStoryDetailsWhenPageLoading() {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if(storyId==null){
        //load story not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/story/data/'+storyId, {
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

            $('.cover.cover-xlg.edit-cover').attr('src',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${data.data.coverImagePath}`);
            $('#story-title-top').text(data.data.title);

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

    await fetch('http://localhost:8080/api/v1/story/data/'+storyId, {
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

            let story = data.data;

            $('.main-edit-form').removeClass('hidden');
            $('.table-of-contents').addClass('hidden');

            $('.table-of-content-tab').removeClass('active');
            $('.story-details-tab').addClass('active');

            $('.cover.cover-xlg.edit-cover').attr('src',`http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${data.data.coverImagePath}`);
            $('#story-title').text(story.title);
            $('.story-description').text(story.description);

            $('.characters-section').empty();
            for (let i = 0; i <story.characters.length ; i++) {

                let ch = story.characters[i];

                if(i===story.characters.length-1){
                    let character = `
                        <div style="width: 100%; display: flex; justify-content: flex-start; align-items: center;">
                          <input value="${ch}" type="text" name="mainCharacters" class="form-input" placeholder="Name" style="flex: 1;" />
                          <button type="button" class="add-character-btn">+</button>
                        </div>`

                    $('.characters-section').append(character);
                }
                else{
                    let character = `
                        <div style="width: 100%; display: flex; justify-content: flex-start; align-items: center;">
                          <input value="${ch}" type="text" name="mainCharacters" class="form-input" placeholder="Name" style="flex: 1;" />
                          <button type="button" class="remove-character-btn">-</button>
                        </div>`

                    $('.characters-section').append(character);
                }

            }

            $("#categoryselect").val(story.category.toLowerCase());
            $("#targetAudience").val(story.targetAudience.toLowerCase());
            $("#language").val(story.language.toLowerCase());
            $('.tags-input').val(story.tags);

            if(story.rating===1){
                $('.rating-toggle').text('ON');
            }
            else {
                $('.rating-toggle').text('OFF');
            }

            if (story.status === 1) {
                $("#complete-switch").prop("checked", true);
            } else {
                $("#complete-switch").prop("checked", false);
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




//click on table of content tab
let tableOfContentTab = $('.table-of-content-tab')[0];
tableOfContentTab.addEventListener('click',function (event) {

    loadAllChapters();
});




//click on story details tab
let storyDetailsTab = $('.story-details-tab')[0];
storyDetailsTab.addEventListener('click',function (event) {

    loadStoryDetails();
});




//when click on save button edit the story
$(document).on('click', '.on-edit-save', function () {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if (storyId == null) {
        //load story not found page
        return;
    }

    let formEl = document.getElementById("story-form");

    // collect characters
    let characters = [];
    $(formEl).find('input[name="mainCharacters"]').each(function () {
        let value = $(this).val().trim();
        if (value) {
            characters.push(value);
        }
    });

    if (characters.length === 0) {
        alert("All required fields must be filled.");
        return;
    }

    // collect all fields
    let title = formEl.querySelector('#story-title').innerText.trim();
    console.log("Title:", title);

    let description = formEl.querySelector('textarea[name="title"]').value.trim();
    console.log("Description:", description);

    let category = formEl.querySelector('#categoryselect').value.trim();
    console.log("Category:", category);

    let tags = formEl.querySelector('input[name="tags"]').value.trim().toLowerCase().split(',')
        .map(tag => tag.trim().replace(/\s+/g, "")).filter(t => t);
    console.log("Tags:", tags);

    let targetAudience = formEl.querySelector('select[name="targetAudience"]').value.trim();
    console.log("Target Audience:", targetAudience);

    let language = formEl.querySelector('#language').value.trim();
    console.log("Language:", language);

    let copyright = formEl.querySelector('select[name="copyright"]').value.trim();
    console.log("Copyright:", copyright);

    let isMature = formEl.querySelector('#isMatureInput').value.trim();
    console.log("Is Mature:", isMature);

    let isComplete = document.getElementById("complete-switch").checked ? 1 : 0;
    console.log("Is Complete:", isComplete);

    if (!title || !description || !category || !targetAudience) {
        alert("All required fields must be filled.");
        return;
    }

    // Function to send update request
    function sendUpdate(coverUrl) {
        let formData = new FormData();
        formData.append("storyId", storyId);
        formData.append("coverImageUrl", coverUrl);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", tags.join(","));
        formData.append("targetAudience", targetAudience);
        formData.append("language", language);
        formData.append("copyright", copyright);
        formData.append("isMature", isMature);
        formData.append("status", isComplete);

        characters.forEach(char => {
            formData.append("mainCharacters", char);
        });

        fetch(`http://localhost:8080/api/v1/story`, {
            method: 'PUT',
            credentials: 'include',
            body: formData
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
                console.log('Story updated:', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Story updated successfully!',
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    window.location.reload();
                });
            })
            .catch(error => {
                let response = JSON.parse(error.message);
                console.log(response);
            });
    }

    // Check for cover image
    let coverInput = document.querySelector('.new-cover-upload input[type="file"]');
    let cover = coverInput.files.length > 0 ? coverInput.files[0] : null;

    if (cover) {
        // upload to imgbb
        const reader = new FileReader();
        reader.readAsDataURL(cover);
        reader.onload = async () => {
            const base64Image = reader.result.split(",")[1];
            try {
                const response = await fetch("https://api.imgbb.com/1/upload?key=50b3e812e73f116edbb14b35639f9725", {
                    method: "POST",
                    body: new URLSearchParams({ image: base64Image })
                });

                const result = await response.json();
                if (result.success) {
                    const imageUrl = result.data.url;
                    console.log("New cover uploaded:", imageUrl);
                    sendUpdate(imageUrl);
                } else {
                    console.error("Upload failed:", result);
                }
            } catch (err) {
                console.error("Error uploading:", err);
            }
        };
    } else {
        // No new cover uploaded → use existing <img> src
        let existingCover = document.querySelector(".cover.edit-cover").src;
        sendUpdate(existingCover);
    }
});




async function run() {
    await loadAllChapters();
    loadStoryDetailsWhenPageLoading()

}

run();




document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.querySelector('#picture-sidebar input[type="file"]');
    const imgElement = document.querySelector('#picture-sidebar img.cover');

    fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgElement.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});




//add characters
$(document).on('click', '.add-character-btn', function () {
    let input = $(this).siblings('input');

    // check if input is empty
    if (!input.val().trim()) {
        return;
    }

    // change this button to minus
    $(this)
        .removeClass('add-character-btn')
        .addClass('remove-character-btn')
        .text('-');

    // add new row
    let newRow = `
        <div style="width: 100%; display: flex; justify-content: flex-start; align-items: center; margin-top: 8px;">
            <input type="text" name="mainCharacters" class="form-input" placeholder="Name" style="flex: 1;" />
            <button type="button" class="add-character-btn">+</button>
        </div>
    `;
    $(this).closest('.characters-section').append(newRow);
});

// remove character row
$(document).on('click', '.remove-character-btn', function () {
    $(this).closest('div').remove();
});




//click on mature btn
$(document).on('click', '.rating-toggle', function () {
    let hiddenInput = $('#isMatureInput');
    let button = $(this);

    if (hiddenInput.val() === "0") {
        hiddenInput.val("1");
        button.text("ON");
        button.addClass("active");
    } else {
        hiddenInput.val("0");
        button.text("OFF");
        button.removeClass("active");
    }

    console.log("isMature:", hiddenInput.val());
});




// click on cancel btn
$(document).on('click', '.on-edit-cancel', function () {
    window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/mywork-page.html`;
});



// click on view as a reader btn
$(document).on('click', '#on-view-as-reader', function () {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if (storyId == null) {
        //load story not found page
        return;
    }

    window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/story-overview-page.html?storyId=${storyId}`;
});




// toggle dropdown on 3-dot click
$(document).on('click', '.dropdown-toggle', function (e) {
    e.preventDefault();
    e.stopPropagation();

    let dropdownMenu = $(this).siblings('.dropdown-menu');

    // hide others
    $('.dropdown-menu').not(dropdownMenu).removeClass('show');

    // toggle current
    dropdownMenu.toggleClass('show');
});

// close dropdown if clicked outside
$(document).on('click', function () {
    $('.dropdown-menu').removeClass('show');
});




// Unpublish chapter
$(document).on('click', '.on-unpublish-part', function (e) {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if (storyId == null) {
        //load story not found page
        return;
    }

    e.preventDefault();
    let chapterId = $(this).data('chapter-id');

    confirmAction(
        'Unpublish Chapter?',
        'This chapter will no longer be visible to readers.',
        'Yes, Unpublish',
        () => {

            fetch('http://localhost:8080/api/v1/chapter/unpublish/'+chapterId+'/'+storyId, {
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

                    loadAllChapters();

                })
                .catch(error => {
                    let response = JSON.parse(error.message);
                    console.log(response);
                });

        }
    );
});




// Delete chapter
$(document).on('click', '.on-delete-published-part', function (e) {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if (storyId == null) {
        //load story not found page
        return;
    }

    e.preventDefault();
    let chapterId = $(this).data('chapter-id');

    confirmAction(
        'Delete Chapter?',
        'This action cannot be undone.',
        'Yes, Delete',
        () => {

            fetch('http://localhost:8080/api/v1/chapter/delete/'+chapterId+'/'+storyId, {
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

                    loadAllChapters();

                })
                .catch(error => {
                    let response = JSON.parse(error.message);
                    console.log(response);
                });
        }
    );
});



// SweetAlert helper
function confirmAction(title, text, confirmButton, callback) {
    Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#aaa',
        confirmButtonText: confirmButton
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}












