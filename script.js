// Music Player Object
const MusicPlayer = {
    currentTrack: 0,
    isPlaying: false,
    isRepeat: false,
    isShuffle: false,
    isMuted: false,
    playbackSpeed: 1,
    tracks: [
        { title: "Sample Track 1", artist: "Artist 1", file: "track1.mp3" },
        { title: "Sample Track 2", artist: "Artist 2", file: "track2.mp3" },
        { title: "Sample Track 3", artist: "Artist 3", file: "track3.mp3" }
    ],
    playlists: {},
    recentTracks: [],
    
    init() {
        this.cacheDom();
        this.bindEvents();
        this.loadTrack();
        this.updatePlaylist();
        this.updateRecentTracks();
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
        this.playlistsContainer = document.getElementById('playlist-container');
        this.createPlaylistBtn = document.getElementById('create-playlist');
        this.uploadBtn = document.getElementById('upload-btn');
        this.fileUpload = document.getElementById('file-upload');
        this.notification = document.querySelector('.notification');
    },

    bindEvents() {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrevTrack());
        this.nextBtn.addEventListener('click', () => this.playNextTrack());
        this.volumeSlider.addEventListener('input', () => this.adjustVolume());
        this.speedSlider.addEventListener('input', () => this.adjustPlaybackSpeed());
        this.themeSwitcher.addEventListener('click', () => this.toggleTheme());
        this.uploadBtn.addEventListener('click', () => this.uploadTracks());
        this.createPlaylistBtn.addEventListener('click', () => this.createPlaylist());
        this.progressBar.addEventListener('mousedown', (e) => this.showTooltip(e));
        this.progressBar.addEventListener('mousemove', (e) => this.showTooltip(e));
        this.progressBar.addEventListener('mouseup', () => this.hideTooltip());
        this.progressBar.addEventListener('click', (e) => this.seekTrack(e));
    },

    loadTrack() {
        const track = this.tracks[this.currentTrack];
        this.trackTitle.textContent = track.title;
        this.artistName.textContent = track.artist;
        if (this.audio) {
            this.audio.pause();
            this.audio.src = track.file;
            this.audio.load();
        } else {
            this.audio = new Audio(track.file);
            this.audio.addEventListener('ended', () => this.handleTrackEnd());
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
        }
        this.totalTimeElement.textContent = this.formatTime(this.audio.duration);
    },

    togglePlayPause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.audio.play();
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        this.isPlaying = !this.isPlaying;
    },

    playPrevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack();
        this.audio.play();
    },

    playNextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack();
        this.audio.play();
    },

    adjustVolume() {
        const volume = this.volumeSlider.value / 100;
        this.audio.volume = volume;
        this.volumeLevel.textContent = `${Math.round(volume * 100)}%`;
        this.isMuted = volume === 0;
        this.updateVolumeIcon();
    },

    updateVolumeIcon() {
        const icon = this.isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
        document.getElementById('mute').innerHTML = `<i class="${icon}"></i>`;
    },

    adjustPlaybackSpeed() {
        this.playbackSpeed = this.speedSlider.value;
        this.speedValue.textContent = `${this.playbackSpeed}x`;
        this.audio.playbackRate = this.playbackSpeed;
    },

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
    },

    showTooltip(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const duration = this.audio.duration;
        const tooltip = document.getElementById('duration-tooltip');
        tooltip.textContent = this.formatTime((offsetX / rect.width) * duration);
        tooltip.style.left = `${offsetX}px`;
        tooltip.style.display = 'block';
    },

    hideTooltip() {
        document.getElementById('duration-tooltip').style.display = 'none';
    },

    seekTrack(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const duration = this.audio.duration;
        const newTime = (offsetX / rect.width) * duration;
        this.audio.currentTime = newTime;
    },

    handleTrackEnd() {
        if (this.isRepeat) {
            this.audio.play();
        } else if (this.isShuffle) {
            this.currentTrack = Math.floor(Math.random() * this.tracks.length);
            this.loadTrack();
            this.audio.play();
        } else {
            this.playNextTrack();
        }
    },

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentTimeElement.textContent = this.formatTime(this.audio.currentTime);
    },

    filterTracks() {
        const searchTerm = this.searchInput.value.toLowerCase();
        Array.from(this.trackList.children).forEach(li => {
            const text = li.textContent.toLowerCase();
            li.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    },

    uploadTracks() {
        const files = this.fileUpload.files;
        Array.from(files).forEach(file => {
            const track = {
                title: file.name.split('.')[0],
                artist: 'Unknown',
                file: URL.createObjectURL(file)
            };
            this.tracks.push(track);
            this.updatePlaylist();
            this.showNotification(`Uploaded: ${file.name}`);
        });
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
            li.textContent = `${track.title} - ${track.artist}`;
            this.recentList.appendChild(li);
        });
    },

    createPlaylist() {
        const name = prompt('Enter playlist name:');
        if (name) {
            const playlist = document.createElement('div');
            playlist.classList.add('playlist');
            playlist.innerHTML = `<h4>${name}</h4><ul></ul>`;
            this.playlists[name] = [];
            this.playlistsContainer.appendChild(playlist);
            console.log(`Created playlist: ${name}`);
        }
    },

    showNotification(message) {
        this.notification.textContent = message;
        this.notification.style.display = 'block';
        setTimeout(() => this.notification.style.display = 'none', 3000);
    },

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    }
};

// Initialize the Music Player
document.addEventListener('DOMContentLoaded', () => MusicPlayer.init());
