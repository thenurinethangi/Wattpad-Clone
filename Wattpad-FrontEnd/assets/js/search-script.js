let form = document.getElementById('search-form');
//when submit the search input navigate to search result page
form.addEventListener('submit', function (event) {

    event.preventDefault();

    let inputValue = $('#search-input')[0].value.trim();
    if(inputValue===''){
        return;
    }

    window.location.href = `http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search-stories-page.html?search=${inputValue}`;
});




//when enter input to the search bar get top stories suggestions
let searchInput = $('#search-input')[0];
searchInput.addEventListener('keyup',function (event) {

    let inputValue = searchInput.value.trim();

    if(inputValue.length>=3) {

        fetch('http://localhost:8080/api/v1/search/'+inputValue, {
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

                let ar = data.data;

                if(ar.length>0){
                    $('#search-suggestions-container').css('display','block');
                    $('#search-suggestions-list').empty();

                    for (let i = 0; i < ar.length; i++) {
                        let title = `<li class="_2fMQj "><a class="_8oV22" href="http://localhost:63342/Wattpad-Clone/Wattpad-FrontEnd/search-stories-page.html?search=${ar[i]}"><svg width="13px" height="13px" viewBox="0 0 24 24" fill="none" stroke="#eee" stroke-width="2" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round"><g><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></g></svg><span class="UO9bH">${ar[i]}</span></a></li>`;
                        $('#search-suggestions-list').append(title);
                    }
                }
                else{
                    $('#search-suggestions-container').css('display','none');
                }

            })
            .catch(error => {
                let response = JSON.parse(error.message);
                console.log(response);

                window.location.href = 'login-page.html';
            });
    }
    else{
        $('#search-suggestions-list').empty();
        $('#search-suggestions-container').css('display','none');
    }
});


















