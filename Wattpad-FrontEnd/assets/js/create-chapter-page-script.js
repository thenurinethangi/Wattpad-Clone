// robust auto-resize
function autoResizeTextarea(el) {
    if (!el) return;
    // reset, let browser recalc scrollHeight
    el.style.height = 'auto';
    // add a tiny extra to avoid 1px clipping on some browsers
    el.style.height = (el.scrollHeight + 2) + 'px';
}

// wait until element (and its ancestors) are visible, then call cb
function waitUntilVisibleAndThen(el, cb, attempts = 0) {
    if (!el) return;
    const style = window.getComputedStyle(el);
    const visible = style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0;
    if (visible || attempts > 40) {
        // double rAF + small timeout for safety
        requestAnimationFrame(() => requestAnimationFrame(() => {
            cb();
            // one more fallback tick
            setTimeout(cb, 50);
        }));
    } else {
        // try again shortly (will stop after ~1s with attempts cap)
        setTimeout(() => waitUntilVisibleAndThen(el, cb, attempts + 1), 25);
    }
}




document.addEventListener("DOMContentLoaded", function () {

    // === Helpers ===
    function autoResizeTextarea(el) {
        if (!el) return;
        el.style.height = "auto";
        el.style.height = (el.scrollHeight + 2) + "px"; // +2px avoids clipping
    }

    function waitUntilVisibleAndThen(el, cb, attempts = 0) {
        if (!el) return;
        const style = window.getComputedStyle(el);
        const visible =
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            el.offsetWidth > 0 &&
            el.offsetHeight > 0;

        if (visible || attempts > 40) {
            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    cb();
                    setTimeout(cb, 50); // fallback tick
                })
            );
        } else {
            setTimeout(() => waitUntilVisibleAndThen(el, cb, attempts + 1), 50);
        }
    }

    // === Run for all existing .paragraph-textarea ===
    document.querySelectorAll(".paragraph-textarea").forEach((ta) => {
        waitUntilVisibleAndThen(ta, () => autoResizeTextarea(ta));
        ta.addEventListener("input", function () {
            autoResizeTextarea(this);
        });
    });

});




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

            if (params.has("storyId")) {
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




//load story details
async function loadStoryDetails() {

    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("storyId")) {
        storyId = params.get("storyId");
    }

    if(storyId==null){
        //load chapter not found page
        return;
    }

    await fetch('http://localhost:8080/api/v1/story/get/'+storyId, {
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

            $('.story-cover').find('img').attr('src', story.coverImagePath);
            $('#story-title').text(story.title);

            if(story.chapterSimpleDTOList.length<=1){
                $('#chapter-title').text('Untitled Part 1');
                $('#chapterTitleEdit').text('Untitled Part 1');
            }
            else {
                $('#chapter-title').text('Untitled Part ' + (story.chapterSimpleDTOList.length + 1));
                $('#chapterTitleEdit').text('Untitled Part ' + (story.chapterSimpleDTOList.length + 1));
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
}
loadStoryDetails();




//when click on add cover image or yt url
function insertMedia2(type) {
    const container = document.querySelector('.media-buttons');

    // Remove previous media if exists
    const oldMedia = container.querySelector('img, iframe');
    if (oldMedia) oldMedia.remove();

    if (type === 'image') {
        // Create file input dynamically
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.style.objectFit = 'contain';
                    img.style.maxHeight = '340px';
                    img.style.width = '100%';

                    // Insert into container
                    container.prepend(img);
                    localStorage.setItem("isSaved", "false");
                    $('.saved-indicator').text('Unsaved');

                    // Hide add buttons after setting media
                    container.querySelectorAll('.media-btn').forEach(btn => btn.style.display = 'none');
                };
                reader.readAsDataURL(file);
            }
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);

    } else if (type === 'video') {
        const url = prompt("Enter YouTube video URL:");
        if (url) {
            const videoId = extractYouTubeID(url);
            if (videoId) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                iframe.width = "100%";
                iframe.height = "340";
                iframe.style.border = "none";

                // Insert into container
                container.prepend(iframe);
                localStorage.setItem("isSaved", "false");
                $('.saved-indicator').text('Unsaved');

                // Hide add buttons after setting media
                container.querySelectorAll('.media-btn').forEach(btn => btn.style.display = 'none');
            } else {
                alert("Invalid YouTube URL");
            }
        }
    }
}

// Extract YouTube video ID from URL
function extractYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}




// when clicking the cover image or url edit button
$(document).on('click','.edit-media',function (event) {
    Swal.fire({
        title: 'Update Cover',
        text: 'Choose a new cover type',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Image',
        cancelButtonText: 'Cancel',
        showDenyButton: true,
        denyButtonText: 'YouTube Video',
    }).then((result) => {
        if (result.isConfirmed) {
            // If Image selected -> open file input
            let input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
                let file = e.target.files[0];
                if (file) {
                    let reader = new FileReader();
                    reader.onload = (ev) => {
                        document.querySelector(".media-buttons").innerHTML =
                            `<img src="${ev.target.result}" style="object-fit:contain;">
                            <div style="background-color: rgba(0,0,0,0.87); width: 39px; height: 39px; border-radius: 100%; display: flex; justify-content: center; align-items: center; position: absolute; right: 12px; bottom: 10px;">
                                <svg fill="#222222" stroke="#ffffff" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="fa-4x edit-media on-show-media-menu">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                </svg>
                            </div>`;
                    };
                    localStorage.setItem("isSaved", "false");
                    $('.saved-indicator').text('Unsaved');
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        } else if (result.isDenied) {
            // If YouTube Video selected -> ask URL
            Swal.fire({
                title: 'Enter YouTube Video URL',
                input: 'url',
                inputPlaceholder: 'https://www.youtube.com/watch?v=xxxxxxx',
                showCancelButton: true,
            }).then((urlResult) => {
                if (urlResult.value) {
                    const videoId = extractYouTubeId(urlResult.value);
                    if (videoId) {
                        document.querySelector(".media-buttons").innerHTML =
                            `<iframe width="100%" height="340" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                            <div style="background-color: rgba(0,0,0,0.87); width: 39px; height: 39px; border-radius: 100%; display: flex; justify-content: center; align-items: center; position: absolute; right: 12px; bottom: 10px;">
                                <svg fill="#222222" stroke="#ffffff" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="fa-4x edit-media on-show-media-menu">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                </svg>
                            </div>`;
                        localStorage.setItem("isSaved", "false");
                        $('.saved-indicator').text('unsaved');
                    }
                    else {
                        Swal.fire('Invalid URL', 'Please enter a valid YouTube link', 'error');
                    }
                }
            });
        }
    });
});

// Helper: extract video ID
function extractYouTubeId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}




// Function to collect all content and prepare for form submission
async function collectAndPrepareContentForForm() {

    const chapterTitle = document.getElementById('chapterTitleEdit').textContent.trim();
    document.getElementById('chapterTitleInput').value = chapterTitle;

    let chapterCover = $('.media-buttons').find('img, iframe');

    let url = '';
    if (chapterCover.is('img')) {
        let imageUrl = chapterCover.attr('src');
        console.log("Image URL:", imageUrl);

        // Convert URL to File object
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        let file = new File([blob], "cover-image.jpg", { type: blob.type });
        console.log("Image File:", file);

        url = await uploadImageToImgbb(file);

    } else if (chapterCover.is('iframe')) {
        let videoUrl = chapterCover.attr('src');
        url = videoUrl;
        console.log("Video URL:", videoUrl);
    }

    const editor = document.getElementById('contentEditor');
    const contentStructure = {
        paragraphs: []
    };

    editor.querySelectorAll('.paragraph-container').forEach((container) => {
        const textarea = container.querySelector('.paragraph-textarea');
        const media = container.querySelector('.embedded-media');

        const paragraphData = {
            type: 'text',
            value: textarea ? textarea.value.trim() : "",
            media: null
        };

        if (media) {
            const mediaType = media.getAttribute('data-media-type');

            if (mediaType === 'image') {
                const imageUniqueId = media.getAttribute('data-image-unique-id');
                const storedImage = attachedImageFiles.get(imageUniqueId);

                if (storedImage) {
                    paragraphData.media = {
                        type: 'image',
                        file: storedImage instanceof File ? storedImage : storedImage.file
                    };
                }

            } else if (mediaType === 'video') {
                const videoUrl = media.getAttribute('data-video-url');
                const videoId = media.getAttribute('data-video-id');
                paragraphData.media = {
                    type: 'video',
                    url: videoUrl,
                    videoId: videoId
                };
            }
        }

        contentStructure.paragraphs.push(paragraphData);
    });

    $('#save-spinner').removeClass('hidden');

    let paragraphAr = await buildParagraphArray(contentStructure);

    let chapterId = null;
    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId") && params.has("storyId")) {
        chapterId = params.get("chapterId");
        storyId = params.get("storyId");

        let data = {
            'chapterTitle': chapterTitle,
            'chapterCoverUrl': url,
            'content': paragraphAr
        };

        console.log("Final payload:", data);

        // fetch(`http://localhost:8080/api/v1/chapter/save/${chapterId}/${storyId}`, {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             return response.json().then(errData => {
        //                 throw new Error(JSON.stringify(errData));
        //             });
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('Success:', data);
        //         localStorage.setItem("isSaved", "true");
        //         $('.saved-indicator').text('Saved');
        //         $('#save-spinner').addClass('hidden');
        //     })
        //     .catch(error => {
        //         let response = JSON.parse(error.message);
        //         console.log(response);
        //     });
    }
    else if (!params.has("chapterId") && params.has("storyId") && !localStorage.getItem('chapterId')) {
        storyId = params.get("storyId");

        let data = {
            'chapterTitle': chapterTitle,
            'chapterCoverUrl': url,
            'content': paragraphAr
        };

        console.log("Final payload:", data);

        // fetch(`http://localhost:8080/api/v1/chapter/createAndSave/${storyId}`, {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             return response.json().then(errData => {
        //                 throw new Error(JSON.stringify(errData));
        //             });
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('Success:', data);
        //         localStorage.setItem("chapterId", data.data);
        //         localStorage.setItem("isSaved", "true");
        //         $('.saved-indicator').text('Saved');
        //         $('#save-spinner').addClass('hidden');
        //     })
        //     .catch(error => {
        //         let response = JSON.parse(error.message);
        //         console.log(response);
        //     });
    }
    else if (!params.has("chapterId") && params.has("storyId") && localStorage.getItem('chapterId')) {
        storyId = params.get("storyId");
        chapterId = localStorage.getItem('chapterId');

        let data = {
            'chapterTitle': chapterTitle,
            'chapterCoverUrl': url,
            'content': paragraphAr
        };

        console.log("Final payload:", data);

        // fetch(`http://localhost:8080/api/v1/chapter/save/${chapterId}/${storyId}`, {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(response => {
        //         if (!response.ok) {
        //             return response.json().then(errData => {
        //                 throw new Error(JSON.stringify(errData));
        //             });
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('Success:', data);
        //         localStorage.setItem("isSaved", "true");
        //         $('.saved-indicator').text('Saved');
        //         $('#save-spinner').addClass('hidden');
        //     })
        //     .catch(error => {
        //         let response = JSON.parse(error.message);
        //         console.log(response);
        //     });
    }
}


async function buildParagraphArray(contentStructure) {

    console.log("-------")
    console.log(contentStructure)

    let paragraphAr = [];

    for (let i = 0; i < contentStructure.paragraphs.length; i++) {
        let para = contentStructure.paragraphs[i];
        let text = para.value.trim();

        if (text !== '') {
            paragraphAr.push({
                type: 'text',
                content: text
            });
        }

        if (para.media !== null) {
            if (para.media.type === 'image') {
                let imageUrl = await uploadImageToImgbb(para.media.file);
                if (imageUrl) {
                    paragraphAr.push({
                        type: 'image',
                        content: imageUrl
                    });
                }
            } else if (para.media.type === 'video') {
                paragraphAr.push({
                    type: 'video',
                    content: para.media.url
                });
            }
        }
    }

    return paragraphAr;
}


async function uploadImageToImgbb(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async () => {
            const base64Image = reader.result.split(",")[1];

            try {
                const response = await fetch("https://api.imgbb.com/1/upload?key=50b3e812e73f116edbb14b35639f9725", {
                    method: "POST",
                    body: new URLSearchParams({ image: base64Image })
                });

                const result = await response.json();

                if (result.success) {
                    resolve(result.data.url);
                } else {
                    reject("Upload failed");
                }
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}




//click on preview button
function previewChapter() {

    if(localStorage.getItem('isSaved')==='false'){
        Swal.fire({
            title: 'Warning!',
            text: 'Save first to view the preview.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    let cId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId")) {
        cId = params.get("chapterId");
    }

    if(!localStorage.getItem('chapterId') && cId==null){
        Swal.fire({
            title: 'Warning!',
            text: 'Save first to view the preview.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    let x;
    if(params.has("chapterId")){
        x = params.get("chapterId");
    }
    else{
        x = localStorage.getItem('chapterId');
    }

    window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${x}`;
}




//click on publish button
async function publish() {

    const chapterTitle = document.getElementById('chapterTitleEdit').textContent.trim();
    document.getElementById('chapterTitleInput').value = chapterTitle;

    let chapterCover = $('.media-buttons').find('img, iframe');

    let url = '';
    if (chapterCover.is('img')) {
        let imageUrl = chapterCover.attr('src');
        console.log("Image URL:", imageUrl);

        const res = await fetch(imageUrl);
        const blob = await res.blob();
        let file = new File([blob], "cover-image.jpg", { type: blob.type });
        console.log("Image File:", file);

        url = await uploadImageToImgbb(file);

    } else if (chapterCover.is('iframe')) {
        let videoUrl = chapterCover.attr('src');
        url = videoUrl;
        console.log("Video URL:", videoUrl);
    }

    const editor = document.getElementById('contentEditor');
    const contentStructure = {
        paragraphs: []
    };

    editor.querySelectorAll('.paragraph-container').forEach((container) => {
        const textarea = container.querySelector('.paragraph-textarea');
        const media = container.querySelector('.embedded-media');

        const paragraphData = {
            type: 'text',
            value: textarea ? textarea.value.trim() : "",
            media: null
        };

        if (media) {
            const mediaType = media.getAttribute('data-media-type');

            if (mediaType === 'image') {
                const imageUniqueId = media.getAttribute('data-image-unique-id');
                const storedImage = attachedImageFiles.get(imageUniqueId);

                if (storedImage) {
                    paragraphData.media = {
                        type: 'image',
                        file: storedImage instanceof File ? storedImage : storedImage.file
                    };
                }

            } else if (mediaType === 'video') {
                const videoUrl = media.getAttribute('data-video-url');
                const videoId = media.getAttribute('data-video-id');
                paragraphData.media = {
                    type: 'video',
                    url: videoUrl,
                    videoId: videoId
                };
            }
        }

        contentStructure.paragraphs.push(paragraphData);
    });

    $('#save-spinner').removeClass('hidden');

    let paragraphAr = await buildParagraphArray(contentStructure);

    let chapterId = null;
    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId") && params.has("storyId")) {
        chapterId = params.get("chapterId");
        storyId = params.get("storyId");

        let data = {
            'chapterTitle': chapterTitle,
            'chapterCoverUrl': url,
            'content': paragraphAr
        };

        console.log("Final payload:", data);

        fetch(`http://localhost:8080/api/v1/chapter/publishAndSave/${chapterId}/${storyId}`, {
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

                window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${chapterId}`;

            })
            .catch(error => {
                let response = JSON.parse(error.message);
                console.log(response);
            });
    }
    else if (!params.has("chapterId") && params.has("storyId") && !localStorage.getItem('chapterId')) {
        storyId = params.get("storyId");

        let data = {
            'chapterTitle': chapterTitle,
            'chapterCoverUrl': url,
            'content': paragraphAr
        };

        console.log("Final payload:", data);

        fetch(`http://localhost:8080/api/v1/chapter/createPublishAndSave/${storyId}`, {
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

                window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${data.data}`;

            })
            .catch(error => {
                let response = JSON.parse(error.message);
                console.log(response);
            });
    }
    else if (!params.has("chapterId") && params.has("storyId") && localStorage.getItem('chapterId')) {
        storyId = params.get("storyId");
        chapterId = localStorage.getItem('chapterId');

        let data = {
            'chapterTitle': chapterTitle,
            'chapterCoverUrl': url,
            'content': paragraphAr
        };

        console.log("Final payload:", data);

        fetch(`http://localhost:8080/api/v1/chapter/publishAndSave/${chapterId}/${storyId}`, {
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

                window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/chapter-view-page.html?chapterId=${chapterId}`;

            })
            .catch(error => {
                let response = JSON.parse(error.message);
                console.log(response);
            });
    }
}




function check() {

    const params = new URLSearchParams(window.location.search);

    let cId = null;
    let storyId = null;
    let isEdit = null;

    if (params.has("chapterId") && params.has("storyId") && params.has("isEdit")) {
        cId = params.get("chapterId");
        storyId = params.get("storyId");
        isEdit = params.get("isEdit");

        loadChapterData();
        loadChapterContent();
    }
}
check();




//load chapter content(paragraph) if the chapter going to edit
function loadChapterContent() {
    let cId = null;
    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId") && params.has("storyId")) {
        cId = params.get("chapterId");
        storyId = params.get("storyId");
    }

    fetch(`http://localhost:8080/api/v1/chapter/paragraph/${cId}/${storyId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
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

            const editor = document.getElementById('contentEditor');
            // clear initial dummy paragraph if editing existing chapter
            editor.innerHTML = "";

            data.data.forEach(paragraph => {
                const paragraphId = generateUniqueId("paragraph_container");
                const textareaId = generateUniqueId("textarea");
                const popupId = generateUniqueId("popup");

                // wrapper
                const container = document.createElement("div");
                container.className = "paragraph-container";
                container.setAttribute("id", paragraphId);
                container.setAttribute("data-paragraph-id", paragraphId);

                // textarea (always included)
                const textarea = document.createElement("textarea");
                textarea.className = "paragraph-textarea";
                textarea.id = textareaId;
                textarea.placeholder = "Type your text";
                textarea.value = (paragraph.contentType === "text" ? paragraph.content : "");
                textarea.setAttribute("onkeydown", "handleKeyDown(event, this)");
                textarea.setAttribute("oninput", "updateWordCount()");
                container.appendChild(textarea);

                autoResizeTextarea(textarea);

                requestAnimationFrame(() => autoResizeTextarea(textarea));

                textarea.addEventListener("input", function () {
                    autoResizeTextarea(this);
                });

                // if media exists
                if (paragraph.contentType === "image") {
                    const mediaDiv = document.createElement("div");
                    mediaDiv.className = "embedded-media";
                    mediaDiv.setAttribute("data-media-type", "image");
                    mediaDiv.innerHTML = `
                        <img src="${paragraph.content}" alt="image">
                        <button class="media-remove-btn" onclick="removeMedia(this)">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    container.appendChild(mediaDiv);
                } else if (paragraph.contentType === "link") {
                    const videoId = extractYouTubeId(paragraph.content);
                    if (videoId) {
                        const mediaDiv = document.createElement("div");
                        mediaDiv.className = "embedded-media";
                        mediaDiv.setAttribute("data-media-type", "video");
                        mediaDiv.setAttribute("data-video-url", paragraph.content);
                        mediaDiv.setAttribute("data-video-id", videoId);
                        mediaDiv.innerHTML = `
                            <iframe src="https://www.youtube.com/embed/${videoId}" 
                                frameborder="0" allowfullscreen></iframe>
                            <button class="media-remove-btn" onclick="removeMedia(this)">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        container.appendChild(mediaDiv);
                    }
                }

                // popup (must always exist for new additions)
                const popup = document.createElement("div");
                popup.className = "add-media-popup";
                popup.id = popupId;
                popup.innerHTML = `
                    <div class="media-option" onclick="addMediaToCurrentParagraph('image')">
                        <i class="fas fa-image"></i>
                        <span>Add Image</span>
                    </div>
                    <div class="media-option" onclick="addMediaToCurrentParagraph('video')">
                        <i class="fas fa-video"></i>
                        <span>Add Video</span>
                    </div>
                    <div class="media-option" onclick="hideMediaPopup()">
                        <i class="fas fa-times"></i>
                        <span>Continue Writing</span>
                    </div>
                `;
                container.appendChild(popup);

                editor.appendChild(container);

                // 1) ensure textarea is resized once it becomes visible
                waitUntilVisibleAndThen(textarea, () => {
                    autoResizeTextarea(textarea);
                });

                // 2) also resize on input so it grows as user types
                textarea.addEventListener("input", function () {
                    autoResizeTextarea(this);
                });
            });

            updateWordCount();
        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
}




//load chapter details if the chapter going to edit
function loadChapterData() {

    let cId = null;
    let storyId = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("chapterId") && params.has("storyId")) {
        cId = params.get("chapterId");
        storyId = params.get("storyId");
    }

    fetch(`http://localhost:8080/api/v1/chapter/${cId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }

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

            $('#chapter-title').text(chapter.title);
            $('#chapterTitleEdit').text(chapter.title);

            if (chapter && chapter.coverImagePath) {

                if (/\.(jpg|jpeg|png|gif|webp)$/i.test(chapter.coverImagePath)) {
                    document.querySelector(".media-buttons").innerHTML = `
            <img src="${chapter.coverImagePath}" style="object-fit:contain;">
            <div style="background-color: rgba(0,0,0,0.87); width: 39px; height: 39px; border-radius: 100%; display: flex; justify-content: center; align-items: center; position: absolute; right: 12px; bottom: 10px;">
                <svg fill="#222222" stroke="#ffffff" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="fa-4x edit-media on-show-media-menu">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
            </div>`;
                }
                else if (chapter.coverImagePath.includes("youtube.com/embed/") || chapter.coverImagePath.includes("youtu.be/")) {
                    let videoId = null;

                    // Extract video ID
                    if (chapter.coverImagePath.includes("embed/")) {
                        videoId = chapter.coverImagePath.split("embed/").pop();
                    } else if (chapter.coverImagePath.includes("youtu.be/")) {
                        videoId = chapter.coverImagePath.split("youtu.be/").pop();
                    }

                    if (videoId) {
                        document.querySelector(".media-buttons").innerHTML = `
                <iframe width="100%" height="340" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                <div style="background-color: rgba(0,0,0,0.87); width: 39px; height: 39px; border-radius: 100%; display: flex; justify-content: center; align-items: center; position: absolute; right: 12px; bottom: 10px;">
                    <svg fill="#222222" stroke="#ffffff" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round" class="fa-4x edit-media on-show-media-menu">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                </div>`;
                    }
                }
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);
        });
}






















