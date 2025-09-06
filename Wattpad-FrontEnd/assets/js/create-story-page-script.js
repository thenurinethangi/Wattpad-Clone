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
}




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

    if (!title || !description || !category || !targetAudience) {
        alert("All required fields must be filled.");
        return;
    }

    let formData = new FormData();
    if (cover) {
        formData.append("coverImage", cover);
    }
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("targetAudience", targetAudience);
    formData.append("language", language);
    formData.append("copyright", copyright);
    formData.append("isMature", isMature);

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

            let id = data.data;
            window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/create-chapter-page.html?storyId=${id}`;

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

        });
});























