// Music Player Object
const MusicPlayer = {
    currentTrack: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    isMuted: false,
    tracks: [
        { title: "Sample Track 1", artist: "Artist 1", file: "track1.mp3" },
        { title: "Sample Track 2", artist: "Artist 2", file: "track2.mp3" },
        { title: "Sample Track 3", artist: "Artist 3", file: "track3.mp3" }
    ],

    init() {
        this.cacheDom();
        this.bindEvents();
        this.loadTrack();
        this.updatePlaylist();
    },

    cacheDom() {
        this.playerElement = document.getElementById('player');
        this.playPauseBtn = document.getElementById('play-pause');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.shuffleBtn = document.getElementById('shuffle');
        this.repeatBtn = document.getElementById('repeat');
        this.muteBtn = document.getElementById('mute');
        this.trackTitle = document.getElementById('track-title');
        this.artistName = document.getElementById('artist');
        this.progressBar = document.getElementById('progress');
        this.currentTimeElement = document.getElementById('current-time');
        this.totalTimeElement = document.getElementById('total-time');
        this.volumeSlider = document.getElementById('volume-slider');
        this.trackList = document.getElementById('track-list');
        this.fileUpload = document.getElementById('file-upload');
        this.uploadBtn = document.getElementById('upload-btn');
    },

    bindEvents() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrevTrack());
        this.nextBtn.addEventListener('click', () => this.playNextTrack());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        this.muteBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        this.uploadBtn.addEventListener('click', () => this.uploadTracks());
    },

    loadTrack() {
        const track = this.tracks[this.currentTrack];
        this.trackTitle.textContent = track.title;
        this.artistName.textContent = track.artist;
        // In a real scenario, we would load the audio file here
        console.log(`Loading track: ${track.file}`);
    },

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            console.log('Playing track');
        } else {
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            console.log('Pausing track');
        }
    },

    playPrevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack();
        if (this.isPlaying) {
            console.log('Playing previous track');
        }
    },

    playNextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack();
        if (this.isPlaying) {
            console.log('Playing next track');
        }
    },

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
        console.log(`Shuffle is ${this.isShuffle ? 'ON' : 'OFF'}`);
    },

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.repeatBtn.classList.toggle('active', this.isRepeat);
        console.log(`Repeat is ${this.isRepeat ? 'ON' : 'OFF'}`);
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.muteBtn.classList.toggle('active', this.isMuted);
        this.setVolume(this.isMuted ? 0 : this.volumeSlider.value);
        console.log(`Mute is ${this.isMuted ? 'ON' : 'OFF'}`);
    },

    setVolume(volume) {
        if (!this.isMuted) {
            console.log(`Volume set to ${volume}`);
        }
    },

    uploadTracks() {
        const files = this.fileUpload.files;
        Array.from(files).forEach(file => {
            const track = {
                title: file.name,
                artist: 'Unknown Artist',
                file: URL.createObjectURL(file)
            };
            this.tracks.push(track);
        });
        this.updatePlaylist();
        console.log(`${files.length} track(s) uploaded.`);
    },

    updatePlaylist() {
        this.trackList.innerHTML = '';
        this.tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = `${track.title} - ${track.artist}`;
            li.addEventListener('click', () => {
                this.currentTrack = index;
                this.loadTrack();
                if (this.isPlaying) {
                    console.log('Playing selected track');
                }
            });
            this.trackList.appendChild(li);
        });
    }
};

// Initialize the Music Player
document.addEventListener('DOMContentLoaded', () => MusicPlayer.init());
