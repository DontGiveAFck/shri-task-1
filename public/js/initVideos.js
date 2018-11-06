// init video streams
function initVideo(video, url) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    }
}

// urls of video streams
function getUrl(path) {
    return encodeURIComponent(
        `${document.location.protocol}//${document.location.hostname}:${
            document.location.port
        }/streams/${path}/master.m3u8`,
    );
}
initVideo(
    document.getElementById('video-1'),
    `http://localhost:9191/master?url=${getUrl('sosed')}`,
);

initVideo(
    document.getElementById('video-2'),
    `http://localhost:9191/master?url=${getUrl('cat')}`,
);

initVideo(
    document.getElementById('video-3'),
    `http://localhost:9191/master?url=${getUrl('dog')}`,
);

initVideo(
    document.getElementById('video-4'),
    `http://localhost:9191/master?url=${getUrl('hall')}`,
);
