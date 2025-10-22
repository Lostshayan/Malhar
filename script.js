console.log("This is my first project");

let currentSong = new Audio();
let songs = [];
let currentIndex = 0;
let currFolder = "favs"; // default playlist folder

// ----------------------
// 🎧 Playlists
// ----------------------
const playlists = {
  favs: [
    "Kolaveri - Dhanush.mp3",
    "Apna Bana Le - Arjit Singh.mp3",
    "Phir - Rekha.mp3",
    "ronthon - Shayan.mp3",
  ],
  hindi: ["Meri Banogi Kya - Rito Rabha.mp3", "Satranga - Arjit Singh.mp3"],
  english: [
    "Shape of You - Ed Sheeran.mp3",
    "Car's Outside - James Arthur.mp3",
    "Golden Hour - JVKE.mp3",
    "Those Eyes - New West.mp3",
  ],
  bangla: [
    "Jiya Tui Chara - Arjit Singh.mp3",
    "Beche Thakar Gaan - Anupam Roy.mp3",
  ],
};

// ----------------------
// ⏱ Convert seconds to mm:ss
// ----------------------
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

// ----------------------
// 🟢 Load and optionally play a song
// ----------------------
function playMusic(track, autoplay = true) {
  currentSong.src = `songs/${currFolder}/${track}`;
  let cleanName = track.replace(".mp3", "");
  document.querySelector(".songinfo").innerHTML = cleanName;
  if (autoplay) {
    currentSong.play().catch((e) => console.log("Playback error:", e));
    document.getElementById("play").src = "./img/pause.svg";
  } else {
    document.getElementById("play").src = "./img/play.svg";
  }
}

// ----------------------
// 🧠 Display Playlist Cards
// ----------------------
function displayAlbums() {
  const cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  Object.keys(playlists).forEach((folder) => {
    cardContainer.innerHTML += `
      <div data-folder="${folder}" class="card">
        <div class="play">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
              stroke-linejoin="round" />
          </svg>
        </div>
        <img src="songs/${folder}/cover.jpg" alt="Cover" onerror="this.src='img/default-cover.jpg'">
        <h2>${folder.charAt(0).toUpperCase() + folder.slice(1)} Playlist</h2>
        <p>${playlists[folder].length} Songs</p>
      </div>`;
  });

  // 🖱 Click on a playlist card to load songs
  Array.from(document.getElementsByClassName("card")).forEach((card) => {
    card.addEventListener("click", (e) => {
      currFolder = e.currentTarget.dataset.folder;
      songs = playlists[currFolder];
      currentIndex = 0;
      playMusic(songs[currentIndex], false);
      renderSongList();
    });
  });
}

// ----------------------
// 🎶 Render songs in the song list
// ----------------------
function renderSongList() {
  const songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";

  songs.forEach((song, index) => {
    let parts = song.replace(".mp3", "").split(" - ");
    let songTitle = parts[0];
    let artistName = parts[1] ? parts[1] : "";

    songUL.innerHTML += `
      <li>
        <img class="invert" width="34" src="img/music.svg" alt="">
        <div class="info">
          <div>${songTitle}</div>
          <div style="font-size: 12px; color: #ccc;">${artistName}</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;

    // Click to play this song
    songUL.querySelectorAll("li")[index].addEventListener("click", () => {
      currentIndex = index;
      playMusic(songs[currentIndex]);
    });
  });
}

// ----------------------
// 🚀 Main Function
// ----------------------
function main() {
  songs = playlists[currFolder];
  currentIndex = 0;
  playMusic(songs[currentIndex], false);
  renderSongList();
  displayAlbums();

  // ▶️ Play/Pause toggle
  document.getElementById("play").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("play").src = "./img/pause.svg";
    } else {
      currentSong.pause();
      document.getElementById("play").src = "./img/play.svg";
    }
  });

  // ⏮ Previous
  document.getElementById("previous").addEventListener("click", () => {
    if (songs.length === 0) return;
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playMusic(songs[currentIndex]);
  });

  // ⏭ Next
  document.getElementById("next").addEventListener("click", () => {
    if (songs.length === 0) return;
    currentIndex = (currentIndex + 1) % songs.length;
    playMusic(songs[currentIndex]);
  });

  // ⏱ Update time & progress
  currentSong.addEventListener("timeupdate", () => {
    const duration = currentSong.duration || 0;
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / duration) * 100 + "%";
  });

  // 🔁 Autoplay next song when current song ends
  currentSong.addEventListener("ended", () => {
    if (songs.length === 0) return;
    currentIndex = (currentIndex + 1) % songs.length; // loop back to first song
    playMusic(songs[currentIndex]);
  });

  // 🎚 Seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = e.offsetX / e.target.getBoundingClientRect().width;
    currentSong.currentTime = currentSong.duration * percent;
    document.querySelector(".circle").style.left = percent * 100 + "%";
  });

  // 🔊 Volume control
  document.querySelector(".range input").addEventListener("input", (e) => {
    currentSong.volume = e.target.value / 100;
    document.querySelector(".volume>img").src =
      currentSong.volume > 0 ? "img/volume.svg" : "img/mute.svg";
  });

  // 🔇 Mute toggle
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = "img/mute.svg";
      currentSong.volume = 0;
      document.querySelector(".range input").value = 0;
    } else {
      e.target.src = "img/volume.svg";
      currentSong.volume = 0.1;
      document.querySelector(".range input").value = 10;
    }
  });

  // 🍔 Mobile menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  document.querySelector(".loginbtn").addEventListener("click", (e) => {
    e.preventDefault();
    currFolder = "favs";
    const songToPlay = "ronthon - Shayan.mp3";
    currentIndex = playlists[currFolder].indexOf(songToPlay);
    playMusic(songToPlay);
  });
}

main();
