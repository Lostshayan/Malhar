console.log("This is my first project");

let currentSong = new Audio();
let songs = [];
let currFolder = "";
let currentIndex = 0;
let lastPlayed = { folder: "", song: "", index: 0 }; // store last played info
let isSpecialSong = false; // track if "Click me" song is playing

const playlists = {
    hindi: [
        "Apna Bana Le - Arjit Singh.mp3",
        "Satranga - Arjit Singh.mp3",
        "Kesariya - Arjit Singh.mp3"
    ],
    english: [
        "Night Changes - One Direction.mp3",
        "Let Me Love You - Justin Bieber.mp3",
        "Perfect - Ed Sheeran.mp3"
    ],
    bangla: [
        "Tomake Chai - Arijit Singh.mp3",
        "Ei Mon Tomake Dilam - Anupam Roy.mp3",
        "Ekla Cholo Re - Rabindranath Tagore.mp3"
    ],
    favs: [
        "ronthon - Shayan.mp3",
        "Sunflower - Post Malone.mp3",
        "Stay - The Kid LAROI.mp3"
    ]
};

// Convert seconds to mm:ss
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Play song
function playMusic(track, pause = false) {
    currentSong.src = `songs/${currFolder}/${track}`;
    if (!pause) {
        currentSong.play();
        document.querySelector("#play").classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
    }
    document.querySelector(".songinfo").innerText = track.replaceAll("%20", " ");
    document.querySelector(".songtime").innerText = "00:00 / 00:00";
}

// Load playlist
async function loadSongs(folder) {
    currFolder = folder;
    let songList = document.querySelector(".songList ul");
    songList.innerHTML = "";

    playlists[folder].forEach((song, index) => {
        let songItem = document.createElement("li");
        songItem.innerHTML = `
            <div class="song-info">
                <img src="songs/${folder}/cover.jpeg" alt="cover" />
                <div class="song-name">${song}</div>
            </div>
            <button class="playnow">Play Now</button>
        `;
        songList.appendChild(songItem);

        // each button plays its own song
        songItem.querySelector(".playnow").addEventListener("click", () => {
            currentIndex = index;
            currFolder = folder;
            isSpecialSong = false;
            lastPlayed = { folder, song, index };
            playMusic(song);
        });
    });
}

// When song ends
currentSong.addEventListener("ended", () => {
    if (isSpecialSong) {
        // if "Click me" song just ended → go back to last played
        isSpecialSong = false;
        if (lastPlayed.folder && lastPlayed.song) {
            currFolder = lastPlayed.folder;
            currentIndex = lastPlayed.index;
            playMusic(lastPlayed.song);
        }
    } else {
        // otherwise autoplay next in same playlist
        if (currentIndex < playlists[currFolder].length - 1) {
            currentIndex++;
            playMusic(playlists[currFolder][currentIndex]);
        } else {
            currentSong.pause();
            currentSong.currentTime = 0;
            document.querySelector("#play").classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
        }
    }
});

// Play/Pause button
document.querySelector("#play").addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        document.querySelector("#play").classList.replace("bi-play-circle-fill", "bi-pause-circle-fill");
    } else {
        currentSong.pause();
        document.querySelector("#play").classList.replace("bi-pause-circle-fill", "bi-play-circle-fill");
    }
});

// "Click me :)" button logic
document.querySelector(".loginbtn").addEventListener("click", (e) => {
    e.preventDefault();

    // save current song before switching
    if (currFolder && playlists[currFolder] && playlists[currFolder][currentIndex]) {
        lastPlayed = {
            folder: currFolder,
            song: playlists[currFolder][currentIndex],
            index: currentIndex
        };
    }

    // play the special song
    currFolder = "favs";
    const songToPlay = "ronthon - Shayan.mp3";
    currentIndex = playlists[currFolder].indexOf(songToPlay);
    isSpecialSong = true;
    playMusic(songToPlay);
});

// Initialize default playlist
loadSongs("hindi");