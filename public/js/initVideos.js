"use strict";
// init video streams
function initVideo(video, url) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
        });
    }
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = "https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8";
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
    }
}
// urls of video streams
function getUrl(path) {
    if (document.location) {
        return encodeURIComponent(`${document.location.protocol}//${document.location.hostname}:${document.location.port}/streams/${path}/master.m3u8`);
    }
}
const video1 = document.querySelector("#video-1");
const video2 = document.querySelector("#video-2");
const video3 = document.querySelector("#video-3");
const video4 = document.querySelector("#video-4");
if (video1) {
    initVideo(video1, `http://localhost:9191/master?url=${getUrl("sosed")}`);
}
if (video2) {
    initVideo(video2, `http://localhost:9191/master?url=${getUrl("cat")}`);
}
if (video3) {
    initVideo(video3, `http://localhost:9191/master?url=${getUrl("dog")}`);
}
if (video4) {
    initVideo(video4, `http://localhost:9191/master?url=${getUrl("hall")}`);
}
