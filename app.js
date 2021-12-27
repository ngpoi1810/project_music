const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');



const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Nhạc của DaLab',
            singer: 'DALAB',
            path: './assets/music/music12.mp3',
            image: './assets/img/anh12.jpg'
        },
        {
            name: 'Một ngày không mưa',
            singer: 'Ngọt Band',
            path: './assets/music/music1.mp3',
            image: './assets/img/anh1.jpg'
        },
        {
            name: 'Beertalks',
            singer: 'Cá hồi hoang',
            path: './assets/music/music2.wav',
            image: './assets/img/anh2.jpg'
        },
        {
            name: 'Điền vào ô trống (250)',
            singer: 'Cá hồi hoang',
            path: './assets/music/music3.wav',
            image: './assets/img/anh3.jpg'
        },
        {
            name: 'Ô cửa',
            singer: 'Pink Frog',
            path: './assets/music/music4.mp3',
            image: './assets/img/anh4.jpg'
        },
        {
            name: 'Thế thôi',
            singer: 'Hi Sam',
            path: './assets/music/music5.mp3',
            image: './assets/img/anh5.jpg'
        },
        {
            name: 'Sao không nói',
            singer: 'Hi Sam',
            path: './assets/music/music6.mp3',
            image: './assets/img/anh6.jpg'
        },
        {
            name: 'Ngtanoise',
            singer: 'VSoul',
            path: './assets/music/music7.mp3',
            image: './assets/img/anh7.jpg'
        },
        {
            name: 'Đìu anh luôn giữ kín trong tym',
            singer: 'RPT MCK ft tlinh & 2pillz',
            path: './assets/music/music8.mp3',
            image: './assets/img/anh8.jpg'
        },
        {
            name: 'Ki niem',
            singer: 'Nger',
            path: './assets/music/music9.mp3',
            image: './assets/img/anh9.jpg'
        },
        {
            name: 'Ngày này năm ấy',
            singer: 'Thành Đồng',
            path: './assets/music/music10.mp3',
            image: './assets/img/anh10.jpg'
        },
        {
            name: 'Tourist',
            singer: 'Bwine ft  V#',
            path: './assets/music/music11.mp3',
            image: './assets/img/anh11.jpg'
        },
    ],
    //load ra danh sách các bài hát
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' :''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        });
        playList.innerHTML = htmls.join('');
    },
    // định nghĩa thuộc tính cho object
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    //scroll xuống thì hình thu nhỏ lại
    handleEvent: function(){
        const cdWidth = cd.offsetWidth; //lấy width của element cd
        const _this = this;
        // gọi hàm onscroll để bắt được sự kiện lăn cuộn chuột
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop; //lăn cuộn chuột theo tọa độ Y
            const newCdWidth = cdWidth - scrollTop; //tạo biến Width mới = width cũ trừ cho tọa độ khi chuột được cuộn
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; // gán biến newWidth đặt điều kiện nếu trừ ra số âm thì cho bằng 0
            cd.style.opacity = newCdWidth / cdWidth; //cho độ mờ opacity của ảnh giảm dần khi cuộn chuột

        }
        // xử lý đĩa quay 360 độ và dừng lại
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        // xử lý nút play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }
        // xử lý thanh progress khi phát nhạc
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        // xử lý khi kéo thanh progress ở đâu thì bài hát phát ở giây đó
        progress.oninput = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // next sang bài hát khác
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
        }
        // prev bài hát khác
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
        }
        // nút ramdom nhạc
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active",_this.isRandom);

        }
        // chuyển bài khi kết thúc một bài hát
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        // lặp lại bài hát
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active",_this.isRepeat);
        }
        // lắng nghe hành vi click vào playlist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                // xử lý khi click vao song
                if(songNode){
                    _this.currentIndex = Number.parseInt(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
            }
        }

    },
    // next bài hát tiếp theo
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.render();
        this.scrollToActiveSong();
    },
    // random bài hát
    randomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    // tải bài hát đầu tiên vào UI
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    scrollToActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        },300)
    },
    start: function(){
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();


        
        this.render();
    }
}
app.start();