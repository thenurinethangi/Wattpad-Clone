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

            $('.liked-reading-list-count-container').html(`${likedReadingLists.length} list<span class="WSJNV"></span>
                                                                <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="" aria-hidden="false">
                                                                   <title id="">WpLock</title>
                                                                   <path d="M6 10H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3h-1V7A6 6 0 0 0 6 7v3Zm2 0V7a4 4 0 1 1 8 0v3H8Zm11 2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h14Z" fill="#121212"></path>
                                                                </svg>
                                                            Hidden from your profile`);

            for (let i = 0; i < likedReadingLists.length; i++) {

                let readingList = likedReadingLists[i];

                let singleReadingList = `
    <!--single reading list-->
    <div class="_6cYXx YOvx3" tabindex="0">
      <div class="lxkLC _8K1w-">
        <div class="jtQrZ">
          <div class="IAzmt MDIEi" style="row-gap:4px;column-gap:4px">
            <div class="zv-c6">
              <div class="coverWrapper__t2Ve8" data-testid="cover" style="height: 100%; display: flex; justify-content: center; align-items: center; background-color: #e2e2e2;">
                ${readingList.threeStoriesCoverImagePath[0] === "wattpad-logo-white.svg"
                    ? `<img class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.threeStoriesCoverImagePath[0]}" alt="" data-testid="image" style="width: 50%;"/>`
                    : `<img style="width: 100%; height: 100%;" class="cover__BlyZa flexible__bq0Qp" src="${readingList.threeStoriesCoverImagePath[0]}" alt="" data-testid="image"/>`
                }
              </div>
            </div>
            <div class="dyxxG">
              <div class="coverWrapper__t2Ve8" data-testid="cover" style="height: 100%; display: flex; justify-content: center; align-items: center; background-color: #e2e2e2;">
                ${readingList.threeStoriesCoverImagePath[1] === "wattpad-logo-white.svg"
                    ? `<img class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.threeStoriesCoverImagePath[1]}" alt="" data-testid="image" style="width: 50%;"/>`
                    : `<img style="width: 100%; height: 100%;" class="cover__BlyZa flexible__bq0Qp" src="${readingList.threeStoriesCoverImagePath[1]}" alt="" data-testid="image"/>`
                }
              </div>
            </div>
            <div class="dyxxG">
              <div class="coverWrapper__t2Ve8" data-testid="cover" style="height: 100%; display: flex; justify-content: center; align-items: center; background-color: #e2e2e2;">
                ${readingList.threeStoriesCoverImagePath[2] === "wattpad-logo-white.svg"
                    ? `<img class="cover__BlyZa flexible__bq0Qp" src="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/assets/image/${readingList.threeStoriesCoverImagePath[2]}" alt="" data-testid="image" style="width: 50%;"/>`
                    : `<img style="width: 100%; height: 100%;" class="cover__BlyZa flexible__bq0Qp" src="${readingList.threeStoriesCoverImagePath[2]}" alt="" data-testid="image"/>`
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
              <img style="object-fit: cover;" src="${readingList.userProfilePicPath}" aria-hidden="true" alt="" class="avatar__Ygp0_ avatar_sm__zq5iO"/>
            </a>
            <div class="af6dp">
              <a href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/user-profile.html?userId=${readingList.userId}" aria-label="by werewolf. Tap to go to the author&#x27;s profile page." class="o3vx0">${readingList.username}</a>
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





















