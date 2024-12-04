document.getElementById("play");
let songs;
let currfolder;

let createplaylist = document.getElementById("createplaylist");
let currentsong = new Audio();
// let currsongindex ;

function formatTimeNoDecimal(seconds) {
  if (!seconds) {
    return `00:00`;
  }
  const minutes = Math.floor(seconds / 60); // Calculate whole minutes
  const remainingSeconds = Math.floor(seconds % 60); // Calculate remaining whole seconds
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currfolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  return songs;
}
const playmusic = (track, pause = false) => {
  currentsong.src = `/${currfolder}/` + track ;
  if (!pause) {
    currentsong.play();
    play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  }
  document.querySelector(".songtime").innerHTML = `00:00/00:00`;
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
    .replaceAll(".mp3", "")
    .replaceAll("/", "");
};

async function main() {
  songs = await getsongs("songs/karanaujla");
  console.log(songs);
  playmusic(songs[0], true);

  createplaylist.addEventListener("click", () => {
    let first = document.getElementById("first");
    let second = document.getElementById("second");
    let formalities = document.querySelector(".formalities");

    first.remove();
    second.remove();

    let div = document.createElement("div");
    div.classList = "myallsongs";
    div.classList.add("width");
    div.classList.add("max-height");
    formalities.before(div);
    div.style.borderRadius = "8px";
    div.style.overflowY = "scroll";
    div.style.backgroundColor = "#1f1f1f";
    div.style.marginLeft = "0.5rem";
    div.style.marginRight = "0.5rem";
    div.style.marginTop = "2.5rem";
    div.style.color = "white";
    div.innerText = "";
    let ul = document.createElement("ul");
    ul.classList = "myul"
    
    div.prepend(ul);
    ul.style.padding = "7px 7px";
    ul.style.display = "flex";
    ul.style.flexDirection = " column";
    ul.style.gap = "7px";

    for (const song of songs) {
      let li = document.createElement("li");
      li.classList = "allli";
      ul.prepend(li);
      li.innerHTML = `
      <div class="iconandinfo">
      <i class="fa-solid fa-music"></i>
      <div class = "info">
      <div id="saregaane" songId="${song.replaceAll("%20", " ")}" >${song
        .replaceAll("%20", " ")
        .replaceAll(".mp3", "")
        .replaceAll("/", "")}</div>
        <div>artist name</div>
        </div>
        </div>
        <div class="playnow">
      <span>Play Now</span>
      <i class="fa-solid fa-circle-play"></i>
      </div>
      `;
      li.style.padding = "3px";
      li.style.listStyle = "none";
      li.style.cursor = "pointer";  
      li.style.padding = "7px";
      li.style.border = "2px solid white";
      li.style.borderRadius = "8px";
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.gap = "10px";

      Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
        // console.log(ul)
          songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
          console.log(songs)
          for (const song of songs) {
            
      li.innerHTML = `
      <div class="iconandinfo">
      <i class="fa-solid fa-music"></i>
      <div class = "info">
      <div id="saregaane" songId="${song.replaceAll("%20", " ")}" >${song
        .replaceAll("%20", " ")
        .replaceAll(".mp3", "")
        .replaceAll("/", "")}</div>
        <div>artist name</div>
        </div>
        </div>
        <div class="playnow">
      <span>Play Now</span>
      <i class="fa-solid fa-circle-play"></i>
      </div>` 
          }
         
        });
      });

    

      Array.from(document.querySelectorAll(".allli")).forEach((e) => {
        e.addEventListener("click", (element) => {
          playmusic(
            e
              .getElementsByTagName("div")[1]
              .firstElementChild.attributes["songId"].nodeValue
          );
          play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
        });
      });
    }
  });
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    } else {
      currentsong.pause();
      play.innerHTML = `<i class="fa-solid fa-play"></i>`;
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTimeNoDecimal(
      currentsong.currentTime
    )}/${formatTimeNoDecimal(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (`${currentsong.currentTime}` / `${currentsong.duration}`) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });
}

main();

document.querySelector(".searchimg").addEventListener("click", () => {
  let input = document.querySelector(".input");
  input.style.position = "relative";
  input.style.left = "-204pxpx";
  input.style.width = "14rem";
  let searchimg = document.querySelector(".searchimg");
  searchimg.style.left = "-7px";
  let likho = document.querySelector(".likho");
  likho.style.opacity = "1";
  likho.style.width = "11rem";
  likho.style.position = "absolute";
  likho.style.left = "35px";
  likho.style.fontSize = "14px";
  likho.style.border = "none";
});

document.querySelector(".spotifylogo").addEventListener("click", () => {
  let left = document.querySelector(".left");
  left.style.left = "-9px";
  let allmysong = document.querySelector(".myallsongs");
  allmysong.classList.add("width2");
  allmysong.classList.add("max-height2");
});

document.querySelector(".cross").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-105%";
});

let privious = document.getElementById("privious");
let next = document.getElementById("next");

privious.addEventListener("click", () => {
  console.log("previous click");
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
  console.log(index, songs);
  if (index - 1 >= 0) {
    playmusic(songs[index - 1]);
  }
});

next.addEventListener("click", () => {
  currentsong.pause();
  play.innerHTML = `<i class="fa-solid fa-play"></i>`;
  console.log("next click");
  let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

  console.log(index, songs);
  if (index + 1 < songs.length) {
    playmusic(songs[index + 1]);
  }
});

document
  .querySelector(".volume")
  .getElementsByTagName("input")[0]
  .addEventListener("change", (e) => {
    currentsong.volume = e.target.value / 100;
  });

let vol = true;
document.querySelector(".vol-icon i").addEventListener("click", () => {
  console.log("click");
  vol = !vol;
  document.querySelector(".vol-icon i").classList.toggle("fa-volume-xmark");
  document.querySelector(".vol-icon i").classList.toggle("fa-volume-high");
  currentsong.volume = vol ? 0.5 : 0;
});
