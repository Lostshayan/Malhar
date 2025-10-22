console.log("This is my first project");

let currentSong = new Audio();
let songs = [];
let currFolder = "";

// ----------------------
// 🎧 Playlists
// ----------------------
const playlists = {
  "favs": [
    "Kolaveri - Dhanush.mp3",
    "Apna Bana Le - Arjit Singh.mp3",
    "Phir - Rekha.mp3",
    "ronthon - Shayan.mp3"
  ],
  "hindi": [
    "Meri Banogi Kya - Rito Rabha.mp3",
    "Satranga - Arjit Singh.mp3"
  ],
  "english": [
    "Shape of You - Ed Sheeran.mp3",
    "Car's Outside - James Arthur.mp3",
    "Golden Hour - JVKE.mp3",
    "Those Eyes - New West.mp3"
  ],
  "bangla": [
    "Jiya Tui Chara - Arjit Singh.mp3",
    "Beche Thakar Gaan - Anupam Roy.mp3"
  ]
};

// ----------------------
// ⏱ Convert seconds to mm:ss
// ----------------------
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

// ----------------------
// 🎶 Load songs from playlist
// ----------------------
async function getSongs(folder) {
  currFolder = folder;
  const folderName = folder.split("/").pop();
  songs = playlists[folderName] || [];

  const songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";

  for (const song of songs) {
    let cleanName = decodeURI(song.replace(".mp3", ""));
    let parts = cleanName.split(" - ");
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
  }

  // 🎵 Click on a song to play it
  Array.from(songUL.getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      let title = e.querySelector(".info div").innerHTML.trim();
      let songToPlay = songs.find(s => decodeURI(s).startsWith(title));
      if (songToPlay) playMusic(songToPlay);
    });
  });

  return songs;
}

// ----------------------
// ▶️ Play Music Function
// ----------------------
function playMusic(track, pause = false) {
  currentSong.src = `${currFolder}/${track}`;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }

  let cleanName = decodeURI(track.replace(".mp3", ""));
  let parts = cleanName.split(" - ");

  if (parts.length === 2) {
    document.querySelector(".songinfo").innerHTML = `${parts[0]}<br><small>${parts[1]}</small>`;
  } else {
    document.querySelector(".songinfo").innerHTML = cleanName;
  }

  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// ----------------------
// 🧠 Display Playlist Cards
// ----------------------
async function displayAlbums() {
  const cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  Object.keys(playlists).forEach(folder => {
    cardContainer.innerHTML += `
      <div data-folder="songs/${folder}" class="card">
        <div class="play">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
              stroke-linejoin="round" />
          </svg>
        </div>
        <img src="songs/${folder}/cover.jpg" alt="">
        <h2>${folder.charAt(0).toUpperCase() + folder.slice(1)} Playlist</h2>
        <p>${playlists[folder].length} Songs</p>
      </div>`;
  });

  // 🖱 Click on a playlist card to load songs
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(item.currentTarget.dataset.folder);
      playMusic(songs[0], true); // load first song but do NOT autoplay
    });
  });
}

// ----------------------
// 🚀 Main Function
// ----------------------
async function main() {
  await getSongs("songs/favs");
  playMusic(songs[0], true); // load first song but don't auto-play
  displayAlbums();

  // ▶️ Play/Pause toggle
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // ⏱ Update time & progress
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // 🎚 Seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // 🍔 Mobile menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // ⏮ Previous (FIXED)
  previous.addEventListener("click", () => {
    let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
    let index = songs.findIndex(s => s === currentFile);
    if (index > 0) {
      playMusic(songs[index - 1]);
    }
  });

  // ⏭ Next (FIXED)
  next.addEventListener("click", () => {
    let currentFile = decodeURIComponent(currentSong.src.split("/").pop());
    let index = songs.findIndex(s => s === currentFile);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // 🔊 Volume control
  document.querySelector(".range input").addEventListener("change", e => {
    currentSong.volume = parseInt(e.target.value) / 100;
    document.querySelector(".volume>img").src =
      currentSong.volume > 0 ? "img/volume.svg" : "img/mute.svg";
  });

  // 🔇 Mute toggle
  document.querySelector(".volume>img").addEventListener("click", e => {
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

  // 🧍‍♂️ Login button demo (plays sample)
  document.querySelector(".loginbtn").addEventListener("click", e => {
    e.preventDefault();
    let folder = "songs/favs";
    let songToPlay = "ronthon - Shayan.mp3";
    currentSong.src = `${folder}/${songToPlay}`;
    currentSong.play();
    play.src = "img/pause.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(songToPlay);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
  });
}

main();