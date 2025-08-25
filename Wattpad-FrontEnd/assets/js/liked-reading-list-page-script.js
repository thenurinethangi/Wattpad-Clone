//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/api/v1/readingList', {
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




//load all liked reading lists from backend
async function loadAllLikedReadingLists() {

    await fetch('http://localhost:8080/api/v1/readingList/liked/all', {
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

            let likedReadingLists = data.data;

            for (let i = 0; i < likedReadingLists.length; i++) {

                let readingList = likedReadingLists[i];

                let singleReadingList = `
    <!--single reading list-->
    <div class="_6cYXx YOvx3" tabindex="0">
      <div class="lxkLC _8K1w-">
        <div class="jtQrZ">
          <div class="IAzmt MDIEi" style="row-gap:4px;column-gap:4px">
            <div class="zv-c6">
              <div class="coverWrapper__t2Ve8" data-testid="cover">
                ${readingList.threeStoriesCoverImagePath[0] === "wattpad-logo-white.svg"
                    ? `<img class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.threeStoriesCoverImagePath[0]}" alt="" data-testid="image"/>`
                    : `<img style="width: 100%; height: 100%;" class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.threeStoriesCoverImagePath[0]}" alt="" data-testid="image"/>`
                }
              </div>
            </div>
            <div class="dyxxG">
              <div class="coverWrapper__t2Ve8" data-testid="cover">
                ${readingList.threeStoriesCoverImagePath[1] === "wattpad-logo-white.svg"
                    ? `<img class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.threeStoriesCoverImagePath[1]}" alt="" data-testid="image"/>`
                    : `<img style="width: 100%; height: 100%;" class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.threeStoriesCoverImagePath[1]}" alt="" data-testid="image"/>`
                }
              </div>
            </div>
            <div class="dyxxG">
              <div class="coverWrapper__t2Ve8" data-testid="cover">
                ${readingList.threeStoriesCoverImagePath[2] === "wattpad-logo-white.svg"
                    ? `<img class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.threeStoriesCoverImagePath[2]}" alt="" data-testid="image"/>`
                    : `<img style="width: 100%; height: 100%;" class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.threeStoriesCoverImagePath[2]}" alt="" data-testid="image"/>`
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rII7T IFR-s">
        <div class="_5kbPA FLZzq">
          <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/single-reading-list-page.html?readingListId=${readingList.readingListId}">${readingList.readingListName}</a>
        </div>
        <div class="L7Od7">
          <div class="Sz3nA TBzDA">
            <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${readingList.userId}" aria-label="">
              <img src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.userProfilePicPath}" aria-hidden="true" alt="" class="avatar__Ygp0_ avatar_sm__zq5iO"/>
            </a>
            <div class="af6dp">
              <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${readingList.userId}" aria-label="by werewolf. Tap to go to the author&#x27;s profile page." class="o3vx0">werewolf</a>
            </div>
          </div>
        </div>
        <div class="_1Ge0J heGj1">${readingList.storyCount} stories</div>
      </div>
      <div class="_6yJ1L"></div>
    </div>`;

                $('#liked-reading-lists-container').append(singleReadingList);
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

loadAllLikedReadingLists();





















