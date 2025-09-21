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

            document.body.style.display = 'block';
            document.body.style.visibility = 'visible';
            document.body.style.opacity = 1;

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

            window.location.href = 'login-page.html';
        });


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
            console.log('Success:', data);

            if(data.data.isVerifiedByWattpad===1){
                $('.wattpad-original-form-group').css('display','block');
            }
            else{
                $('.wattpad-original-form-group').css('display','none');
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);


        });
}




const toggle = document.getElementById('storyTypeToggle');
let isWattpadOriginal = 0;

toggle.addEventListener('change', () => {
    if (toggle.checked) {
        $('.coins-form-group').css('display','block');
        isWattpadOriginal = 1;
    }
    else {
        $('.coins-form-group').css('display','none');
        isWattpadOriginal = 0;
    }
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




//when click on next button save the story
$(document).on('click', '.skip-btn', function () {
    let formEl = document.getElementById("story-form");

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


    let cover = formEl.querySelector('input[name="coverImage"]').files[0];
    let title = formEl.querySelector('input[name="title"]').value.trim();
    let description = formEl.querySelector('textarea[name="description"]').value.trim();
    let category = formEl.querySelector('select[name="category"]').value.trim();
    let tags = formEl.querySelector('input[name="tags"]').value.trim().toLowerCase().split(',').map(tag => tag.trim().replace(/\s+/g, ""));
    let targetAudience = formEl.querySelector('select[name="targetAudience"]').value.trim();
    let language = formEl.querySelector('select[name="language"]').value.trim();
    let copyright = formEl.querySelector('select[name="copyright"]').value.trim();
    let isMature = formEl.querySelector('#isMatureInput').value.trim();
    let coinsAmount = formEl.querySelector('input[name="coinsAmount"]').value.trim();

    if(coinsAmount===''){
        coinsAmount = '0';
    }

    if (!title || !description || !category || !targetAudience) {
        alert("All required fields must be filled.");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(cover);

    reader.onload = async () => {
        const base64Image = reader.result.split(",")[1];

        try {
            // upload to imgbb
            const response = await fetch("https://api.imgbb.com/1/upload?key=50b3e812e73f116edbb14b35639f9725", {
                method: "POST",
                body: new URLSearchParams({
                    image: base64Image
                })
            });

            const result = await response.json();

            if (result.success) {
                const imageUrl = result.data.url;
                console.log("Image uploaded:", imageUrl);

                let formData = new FormData();

                formData.append("coverImageUrl", imageUrl);
                formData.append("title", title);
                formData.append("description", description);
                formData.append("category", category);
                formData.append("tags", tags.join(",")); // better as string
                formData.append("targetAudience", targetAudience);
                formData.append("language", language);
                formData.append("copyright", copyright);
                formData.append("isMature", isMature);
                formData.append("isWattpadOriginal", String(isWattpadOriginal));
                formData.append("coinsAmount", coinsAmount);

                characters.forEach(char => {
                    formData.append("mainCharacters", char);
                });

                fetch('http://localhost:8080/api/v1/story', {
                    method: 'POST',
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
                        console.log('Success:', data);

                        let response = data.data;
                        window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/create-chapter-page.html?storyId=${response.storyId}&chapterId=${response.chapterId}`;
                    })
                    .catch(error => {
                        let response = JSON.parse(error.message);
                        console.log(response);
                    });
            } else {
                console.error("Upload failed:", result);
            }

        } catch (err) {
            console.error("Error uploading:", err);
        }
    };
});
























