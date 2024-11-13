
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return 'Invalid input';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;

    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);

    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName('a');

    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith('.mp3')) {
            songs.push(decodeURIComponent(element.href.split(`/${folder}/`)[1]));
        }
    }
   
    let songUl = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUl.innerHTML = '';
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song}</div>
                                <div>Song Artists</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span> 
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                            
         </li>`;
    }

    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            console.log(e.querySelector('.info').firstElementChild.innerHTML);
            playMusic(e.querySelector('.info').firstElementChild.innerHTML);
        })
    })

    return songs;
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio('/songs/' + track);
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = 'img/pause.svg';
    }
    document.querySelector('.songinfo').innerHTML = track;
    document.querySelector('.songtime').innerHTML = '00:00 / 00:00';
}

async function displayAlbums () {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName('a');
    let cardContainer = document.querySelector('.cardContainer');

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes('/songs/')) {
            let folder = e.href.split('/').slice(-1)[0]
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="12" fill="#5bf54d" />
                                <path fill="black" transform="scale(0.5) translate(12, 12)"
                                    d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                                </path>
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jfif" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async item => { 
            console.log('Fetching Songs')
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    })
}

async function main() {

    await getSongs('songs/cs');

    playMusic(songs[0], true)

    displayAlbums()


    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = 'img/pause.svg';
        } else {
            currentSong.pause();
            play.src = 'img/play.svg';
        }
    })

    currentSong.addEventListener('timeupdate', () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector('.songtime').innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';
    })

    document.querySelector('.seekbar').addEventListener('click', e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = percent + '%';
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';
    })

    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-120%';
    })

    previous.addEventListener('click', () => {
        currentSong.pause();
        console.log('Previous Clicked');

        // let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);

        // if ((index - 1) >= 0) {
        //     playMusic(songs[index - 1]);
        // }

        let decodedSrc = decodeURIComponent(currentSong.src.split('/').slice(-1)[0]);

        let index = songs.indexOf(decodedSrc);

        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    next.addEventListener('click', () => {
        currentSong.pause();
        console.log('Next Clicked');
        // let index = songs.indexOf(currentSong.src.split('/').slice(-1))
        // console.log(currentSong)
        // console.log(songs)
        // console.log(index)
        // console.log(songs.indexOf(currentSong));
        // let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        // console.log(index);

        // Extract the filename from the full src URL (e.g., '/songs/Bruno Mars - That’s What I Like.mp3')
        // let currentSongFilename = currentSong.src.split('/').pop();

        // Now find the index of that filename in the songs array
        // let index = songs.indexOf(currentSongFilename);

        // console.log(index);  // This should now correctly print the index, e.g., 0 if it's the first song


        // console.log("currentSong.src: ", currentSong.src);
        // console.log("songs array: ", songs);

        let decodedSrc = decodeURIComponent(currentSong.src.split('/').slice(-1)[0]);

        let index = songs.indexOf(decodedSrc);

        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }



        // let currentSongFilename = currentSong.src.split('/').slice(-1)[0];
        // let index = songs.indexOf(currentSongFilename);
        // console.log(index);


        // let index = songs.indexOf(currentSong.src.split('/').slice(-1) [0]);

        // if ((index + 1) > length) {
        //     playMusic(songs[index + 1]);
        // }

    })

    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change', (e) => {
        currentSong.volume = parseInt(e.target.value)/100;
        if (currentSong.volume > 0) {
            document.querySelector('.volume>img').src = document.querySelector('.volume>img').src.replace('mute.svg', 'volume.svg');
        }
    })

    document.querySelector('.volume>img').addEventListener('click', e => {
        if (e.target.src.includes('volume.svg')) {
            e.target.src = e.target.src.replace('volume.svg', 'mute.svg');
            currentSong.volume = 0;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 0;
        } else {
            e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
            currentSong.volume = .10;
            document.querySelector('.range').getElementsByTagName('input')[0].value = 10;
        }
    })

}

main();
