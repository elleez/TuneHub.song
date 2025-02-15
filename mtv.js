let term = '';
let audioElements = [];

const updateTerm = () => {
    term = document.getElementById('searchTerm').value.trim();
    if (!term) {        alert('Please enter a search term');
        return;
    }

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=10`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const artists = data.results;
            const songContainer = document.getElementById('songs');
            songContainer.innerHTML = '';
            audioElements = [];

            if (artists.length === 0) {
                songContainer.innerHTML = '<p>No results found.</p>';
                document.getElementById('playAllBtn').disabled = true;
                return;
            }

            artists.forEach((result, index) => {
                const article = document.createElement('article');
                article.style.border = '1px solid #ccc';
                article.style.padding = '10px';
                article.style.margin = '10px 0';
                
                const artistName = document.createElement('p');
                const songName = document.createElement('h4');
                const img = document.createElement('img');
                const audio = document.createElement('audio');
                const audioSource = document.createElement('source');

                artistName.textContent = `Artist: ${result.artistName}`;
                songName.textContent = `Song: ${result.trackName}`;
                img.src = result.artworkUrl100;
                img.alt = `Album artwork for ${result.trackName}`;
                img.style.width = '100px';
                img.style.height = '100px';
                
                audioSource.src = result.previewUrl;
                audio.controls = true;
                audio.appendChild(audioSource);
                audioElements.push(audio);

                article.appendChild(img);
                article.appendChild(artistName);
                article.appendChild(songName);
                article.appendChild(audio);
                songContainer.appendChild(article);
            });

            document.getElementById('playAllBtn').disabled = audioElements.length === 0;
        })
        .catch(error => {
            console.error('Request failed:', error);
            alert('An error occurred while fetching the songs.');
        });
};

const playAllSongs = () => {
    if (audioElements.length === 0) return;
    let currentIndex = 0;

    const playNext = () => {
        if (currentIndex < audioElements.length) {
            const currentAudio = audioElements[currentIndex];
            currentAudio.play();
            currentAudio.addEventListener('ended', () => {
                currentIndex++;
                playNext();
            }, { once: true });
        }
    };

    playNext();
};

document.getElementById('searchTermBtn').addEventListener('click', updateTerm);
document.getElementById('playAllBtn').addEventListener('click', playAllSongs);

// mtv.js (or newtune.js)

// Function to dynamically load a stylesheet
function loadStyleSheet(href, id) {
    if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.id = id;
        document.head.appendChild(link);
    }
}

// Apply the correct stylesheet for the current page
function applyPageSpecificStyles() {
    const currentPage = window.location.pathname.split('/').pop();
    let stylesheet = currentPage === 'mtv.html' ? 'mtv.css' : 'newtune.css';
    if (stylesheet) {
        loadStyleSheet(stylesheet, `${currentPage}-stylesheet`);
    }
}

// Apply the styles on page load
applyPageSpecificStyles();

// Logout button functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}

  

