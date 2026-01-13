// Simultaneous video playback controller
(function() {
  'use strict';

  let videos = [];

  function initSimultaneousPlayback() {
    console.log('Initializing simultaneous video playback...');

    // Find all videos with data-sequence attribute
    const videoElements = document.querySelectorAll('video[data-sequence]');
    videos = Array.from(videoElements);

    console.log('Found', videos.length, 'videos for simultaneous playback');

    if (videos.length === 0) {
      console.warn('No videos found with data-sequence attribute');
      return;
    }

    // Preload all videos
    videos.forEach((video, index) => {
      video.preload = 'auto';
      video.load();

      // Add event listeners
      video.addEventListener('ended', function() {
        console.log('Video', index, 'ended - restarting');
        this.currentTime = 0;
        this.play().catch(error => {
          console.error('Error replaying video', index, ':', error);
        });
      });

      video.addEventListener('error', (e) => {
        console.error('Video', index, 'error:', e);
      });

      video.addEventListener('loadedmetadata', () => {
        console.log('Video', index, 'loaded. Duration:', video.duration);
      });
    });

    // Start playing all videos immediately
    playAllVideos();
  }

  function playAllVideos() {
    console.log('Starting all videos simultaneously...');

    videos.forEach((video, index) => {
      video.currentTime = 0;

      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video', index, 'playing successfully');
          })
          .catch(error => {
            console.error('Error playing video', index, ':', error);
          });
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimultaneousPlayback);
  } else {
    initSimultaneousPlayback();
  }

})();
