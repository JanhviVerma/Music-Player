// Music Player Object
const MusicPlayer = {
    currentTrack: 0,
    isPlaying: false,
    tracks: [
        { title: "Sample Track 1", artist: "Artist 1", file: "track1.mp3" },
        { title: "Sample Track 2", artist: "Artist 2", file: "track2.mp3" },
        { title: "Sample Track 3", artist: "Artist 3", file: "track3.mp3" }
    ],
    playlists: {},
    currentPlaylist: 'default',
    recentTracks: [],
    audio: new Audio(),

    init() {
        this.cacheDom();
        this.bindEvents();
        this.loadTrack();
        this.updatePlaylist();
        this.updateRecentTracks();
        this.setupVolumeControl();
        this.setupSpeedControl();
        this.updatePlaylists();
    },

    cacheDom() {
        this.playerElement = document.getElementById('player');
        this.playPauseBtn = document.getElementById('play-pause');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.trackTitle = document.getElementById('track-title');
        this.artistName = document.getElementById('artist');
        this.progressBar = document.getElementById('progress');
        this.currentTimeElement = document.getElementById('current-time');
        this.totalTimeElement = document.getElementById('total-time');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeLevel = document.getElementById('volume-level');
        this.speedSlider = document.getElementById('speed-slider');
        this.speedValue = document.getElementById('speed-value');
        this.themeSwitcher = document.getElementById('theme-switcher');
        this.trackList = document.getElementById('track-list');
        this.recentList = document.getElementById('recent-list');
        this.uploadBtn = document.getElementById('upload-btn');
        this.fileUpload = document.getElementById('file-upload');
        this.notification = document.getElementById('notification');
    },

    bindEvents() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrevTrack());
        this.nextBtn.addEventListener('click', () => this.playNextTrack());
        this.volumeSlider.addEventListener('input', () => this.adjustVolume());
        this.speedSlider.addEventListener('input', () => this.adjustSpeed());
        this.themeSwitcher.addEventListener('click', () => this.toggleTheme());
        this.uploadBtn.addEventListener('click', () => this.uploadTracks());
        this.fileUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        this.progressBar.addEventListener('click', (e) => this.seekTrack(e));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.playNextTrack());
    },

    loadTrack() {
        const track = this.tracks[this.currentTrack];
        this.trackTitle.textContent = track.title;
        this.artistName.textContent = track.artist;
        this.audio.src = track.file;
        this.audio.load();
        this.updateRecentTracks();
        this.showNotification('Loaded track: ' + track.title);
    },

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.audio.play();
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.showNotification('Playing track');
        } else {
            this.audio.pause();
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            this.showNotification('Paused track');
        }
    },

    playPrevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack();
        if (this.isPlaying) {
            this.audio.play();
        }
    },

    playNextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack();
        if (this.isPlaying) {
            this.audio.play();
        }
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
                    this.audio.play();
                }
            });
            this.trackList.appendChild(li);
        });
    },

    updateRecentTracks() {
        this.recentList.innerHTML = '';
        this.recentTracks.forEach(track => {
            const li = document.createElement('li');
            li.textContent = track.title;
            this.recentList.appendChild(li);
        });
    },

    setupVolumeControl() {
        this.volumeSlider.addEventListener('input', () => {
            this.audio.volume = this.volumeSlider.value / 100;
            this.volumeLevel.textContent = `${Math.round(this.audio.volume * 100)}%`;
        });
    },

    setupSpeedControl() {
        this.speedSlider.addEventListener('input', () => {
            this.audio.playbackRate = parseFloat(this.speedSlider.value);
            this.speedValue.textContent = `${this.audio.playbackRate}x`;
        });
    },

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
    },

    showNotification(message, type = 'success') {
        this.notification.textContent = message;
        this.notification.className = `notification ${type}`;
        this.notification.style.display = 'block';
        setTimeout(() => {
            this.notification.style.display = 'none';
        }, 3000);
    },

    uploadTracks() {
        if (this.fileUpload.files.length > 0) {
            Array.from(this.fileUpload.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const track = { title: file.name, artist: 'Unknown', file: e.target.result };
                    this.tracks.push(track);
                    this.updatePlaylist();
                    this.showNotification('Track uploaded successfully');
                };
                reader.readAsDataURL(file);
            });
        }
    },

    handleFileSelect(event) {
        // Handle file selection logic here if needed
    },

    seekTrack(event) {
        const progressBarWidth = this.progressBar.parentElement.clientWidth;
        const clickX = event.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / progressBarWidth) * duration;
    },

    updateProgress() {
        const progressPercent = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progressPercent}%`;
        this.currentTimeElement.textContent = this.formatTime(this.audio.currentTime);
        this.totalTimeElement.textContent = this.formatTime(this.audio.duration);
    },

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    },

    updatePlaylists() {
        // Logic to manage and update playlists can be added here
    }
};

// Initialize the Music Player
document.addEventListener('DOMContentLoaded', () => MusicPlayer.init());
