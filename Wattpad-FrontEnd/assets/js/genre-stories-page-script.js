//check user register or not
window.onload = function () {

    fetch('http://localhost:8080/genre', {
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

            if (params.has("genre")) {
                document.body.style.display = 'block';
                document.body.style.visibility = 'visible';
                document.body.style.opacity = 1;
            }
            else {
                //here instead of redirect to login page display model for login
                window.location.href = 'login-page.html';
            }

        })
        .catch(error => {
            let response = JSON.parse(error.message);
            console.log(response);

            window.location.href = 'login-page.html';
        });
}




//load first 10 stories in selected genre
async function loadAllStoriesInSelectedGenre(data) {

    let genre = null;
    const params = new URLSearchParams(window.location.search);

    if (params.has("genre")) {
        genre = params.get("genre");
    }

    if(genre==null){
        //load chapter not found page
        return;
    }

    let genreTitle = $('#genre-title');
    if(genre==='Romance'){
        genreTitle.text('Romance Stories');
    }
    else if(genre==='FanFiction'){
        genreTitle.text('FanFiction Stories');
    }
    else if(genre==='LGBTQ+'){
        genreTitle.text('LGBTQ+ Stories');
    }
    else if(genre==='Wattpad Originals'){
        genreTitle.text('Wattpad Originals Stories');
    }
    else if(genre==='Werewolf'){
        genreTitle.text('Werewolf Stories');
    }
    else if(genre==='New Adult'){
        genreTitle.text('New Adult Stories');
    }
    else if(genre==='Fantasy'){
        genreTitle.text('Fantasy Stories');
    }
    else if(genre==='Short Story'){
        genreTitle.text('Short Story Stories');
    }
    else if(genre==='Teen Fiction'){
        genreTitle.text('Teen Fiction Stories');
    }
    else if(genre==='Historical Fiction'){
        genreTitle.text('Historical Fiction Stories');
    }
    else if(genre==='Paranormal'){
        genreTitle.text('Paranormal Stories');
    }
    else if(genre==='Teen Fiction'){
        genreTitle.text('Editor\'s Picks Stories');
    }
    else if(genre==='Humor'){
        genreTitle.text('Humor Stories');
    }
    else if(genre==='Horror'){
        genreTitle.text('Horror Stories');
    }
    else if(genre==='Contemporary Lit'){
        genreTitle.text('Contemporary Lit Stories');
    }
    else if(genre==='Diverse Lit'){
        genreTitle.text('Diverse Lit Stories');
    }
    else if(genre==='Mystery'){
        genreTitle.text('Mystery Stories');
    }
    else if(genre==='Thriller'){
        genreTitle.text('Thriller Stories');
    }
    else if(genre==='Science Fiction'){
        genreTitle.text('Science Fiction Stories');
    }
    else if(genre==='The Wattys'){
        genreTitle.text('The Wattys Stories');
    }
    else if(genre==='Adventure'){
        genreTitle.text('Adventure Stories');
    }
    else if(genre==='Non Fiction'){
        genreTitle.text('Non Fiction Stories');
    }
    else if(genre==='Poetry'){
        genreTitle.text('Poetry Stories');
    }
    else {
        window.location.href = '../../home-page.html'
    }

    await fetch('http://localhost:8080/genre/'+genre, {
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

let storyCount = 16;
let tags = ['loyalty'];
let sortBy = 0;

let data = {
    'storyCount': storyCount,
    'tags': tags,
    'sortBy': sortBy
};
loadAllStoriesInSelectedGenre(data);



















