const MusicPlayer = {
    currentTrack: 0,
    isPlaying: false,
    tracks: [
        { title: "Sample Track 1", artist: "Artist 1", file: "track1.mp3" },
        { title: "Sample Track 2", artist: "Artist 2", file: "track2.mp3" },
        { title: "Sample Track 3", artist: "Artist 3", file: "track3.mp3" }
    ],
    recentTracks: [],
    audio: new Audio(),
    isShuffle: false,
    isRepeat: false,

    init() {
        this.cacheDom();
        this.bindEvents();
        this.loadTrack();
        this.updatePlaylist();
        this.updateRecentTracks();
        this.setupVolumeControl();
        this.setupSpeedControl();
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
        this.shuffleToggle = document.getElementById('shuffle-toggle');
        this.repeatToggle = document.getElementById('repeat-toggle');
        this.trackList = document.getElementById('track-list');
        this.recentList = document.getElementById('recent-list');
        this.uploadBtn = document.getElementById('upload-btn');
        this.fileUpload = document.getElementById('file-upload');
        this.notification = document.getElementById('notification');
        this.albumArt = document.querySelector('#album-art img');
    },

    bindEvents() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrevTrack());
        this.nextBtn.addEventListener('click', () => this.playNextTrack());
        this.volumeSlider.addEventListener('input', () => this.adjustVolume());
        this.speedSlider.addEventListener('input', () => this.adjustSpeed());
        this.themeSwitcher.addEventListener('click', () => this.toggleTheme());
        this.shuffleToggle.addEventListener('click', () => this.toggleShuffle());
        this.repeatToggle.addEventListener('click', () => this.toggleRepeat());
        this.uploadBtn.addEventListener('click', () => this.uploadTracks());
        this.fileUpload.addEventListener('change', (e) => this.handleFileSelect(e));
        this.progressBar.parentElement.addEventListener('click', (e) => this.seekTrack(e));
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.handleTrackEnd());
    },

    loadTrack() {
        const track = this.tracks[this.currentTrack];
        this.trackTitle.textContent = track.title;
        this.artistName.textContent = track.artist;
        this.audio.src = track.file;
        this.audio.load();
        this.updateRecentTracks();
        this.showNotification(`Now playing: ${track.title} by ${track.artist}`);
        this.albumArt.src = `album-art-${this.currentTrack + 1}.jpg`;
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
        if (!this.recentTracks.includes(this.currentTrack)) {
            this.recentTracks.unshift(this.currentTrack);
            if (this.recentTracks.length > 5) {
                this.recentTracks.pop();
            }
        }
        this.recentList.innerHTML = '';
        this.recentTracks.forEach(trackIndex => {
            const track = this.tracks[trackIndex];
            const li = document.createElement('li');
            li.textContent = `${track.title} - ${track.artist}`;
            li.addEventListener('click', () => {
                this.currentTrack = trackIndex;
                this.loadTrack();
                if (this.isPlaying) {
                    this.audio.play();
                }
            });
            this.recentList.appendChild(li);
        });
    },

    adjustVolume() {
        this.audio.volume = this.volumeSlider.value / 100;
        this.volumeLevel.textContent = `${Math.round(this.audio.volume * 100)}%`;
    },

    adjustSpeed() {
        this.audio.playbackRate = parseFloat(this.speedSlider.value);
        this.speedValue.textContent = `${this.audio.playbackRate.toFixed(1)}x`;
    },

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDarkTheme = document.body.classList.contains('dark-theme');
        this.themeSwitcher.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        this.showNotification(isDarkTheme ? 'Dark theme enabled' : 'Light theme enabled');
    },

    showNotification(message, type = 'success') {
        this.notification.textContent = message;
        this.notification.className = `notification ${type}`;
        this.notification.classList.add('show');
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    },

    uploadTracks() {
        this.fileUpload.click();
    },

    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const track = { title: file.name.replace(/\.[^/.]+$/, ""), artist: 'Unknown', file: e.target.result };
                    this.tracks.push(track);
                    this.updatePlaylist();
                    this.showNotification(`Track "${track.title}" uploaded successfully`);
                };
                reader.readAsDataURL(file);
            } else {
                this.showNotification(`File "${file.name}" is not an audio file`, 'error');
            }
        });
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
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    },

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleToggle.classList.toggle('active');
        this.showNotification(this.isShuffle ? 'Shuffle enabled' : 'Shuffle disabled');
    },

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.repeatToggle.classList.toggle('active');
        this.showNotification(this.isRepeat ? 'Repeat enabled' : 'Repeat disabled');
    },

    handleTrackEnd() {
        if (this.isRepeat) {
            this.audio.currentTime = 0;
            this.audio.play();
        } else if (this.isShuffle) {
            let newTrack;
            do {
                newTrack = Math.floor(Math.random() * this.tracks.length);
            } while (newTrack === this.currentTrack && this.tracks.length > 1);
            this.currentTrack = newTrack;
            this.loadTrack();
            this.audio.play();
        } else {
            this.playNextTrack();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => MusicPlayer.init());