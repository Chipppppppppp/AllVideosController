let lastVideo;
function apply(doc) {
    if (!doc.getElementsByTagName) return;
    for (let video of doc.getElementsByTagName("video")) {
        if (video.dataset.allVideosControllerSeen) return;
        video.dataset.allVideosControllerSeen = true;
        video.addEventListener("playing", () => lastVideo = video);
        video.parentElement.style.position = "relative";
        video.playbackRate = parseFloat(sessionStorage.getItem("all-videos-controller-speed"));
        let status = document.createElement("div");
        status.classList.add("all-videos-controller-status");
        video.before(status);
    }
}

if (!sessionStorage.getItem("all-videos-controller-speed")) sessionStorage.setItem("all-videos-controller-speed", "1");
apply(document);

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(apply);
    });
});

observer.observe(document, {
    childList: true,
    subtree: true
});

function showStatus(status, str) {
    status.innerText = str;
    status.style.display = "block";
    if (status.dataset.pending) clearTimeout(status.dataset.pending);
    status.dataset.pending = setTimeout(() => status.style.display = "none", 1000);
}

const oneFrame = 1 / 30;

window.addEventListener("keydown", e => {
    if (!lastVideo) return;
    let target = e.composedPath ? e.composedPath()[0] || e.target : e.target;
    if (/INPUT|TEXTAREA|SELECT|LABEL/.test(target.tagName) || target.getAttribute && target.getAttribute("contenteditable") === "true") return;
    switch (e.key) {
        case "s":
            lastVideo.playbackRate = 1;
            sessionStorage.setItem("all-videos-controller-speed", String(lastVideo.playbackRate));
            showStatus(lastVideo.previousElementSibling, `Speed: ${lastVideo.playbackRate}`);
            e.preventDefault();
            e.stopPropagation();
            return;
        case "d":
            lastVideo.playbackRate += 0.25;
            sessionStorage.setItem("all-videos-controller-speed", String(lastVideo.playbackRate));
            showStatus(lastVideo.previousElementSibling, `Speed: ${lastVideo.playbackRate}`);
            e.preventDefault();
            e.stopPropagation();
            return;
        case "a":
            lastVideo.playbackRate = Math.max(0.25, lastVideo.playbackRate - 0.25);
            sessionStorage.setItem("all-videos-controller-speed", String(lastVideo.playbackRate));
            showStatus(lastVideo.previousElementSibling, `Speed: ${lastVideo.playbackRate}`);
            e.preventDefault();
            e.stopPropagation();
            return;
        case "h":
            lastVideo.currentTime = Math.min(lastVideo.duration, lastVideo.currentTime + oneFrame);
            showStatus(lastVideo.previousElementSibling, "Next Frame");
            e.preventDefault();
            e.stopPropagation();
            return;
        case "g":
            lastVideo.currentTime = Math.max(0, lastVideo.currentTime - oneFrame);
            showStatus(lastVideo.previousElementSibling, "Previous Frame");
            e.preventDefault();
            e.stopPropagation();
            return;
        case "ArrowRight":
            lastVideo.currentTime = Math.min(lastVideo.duration, lastVideo.currentTime + 5);
            showStatus(lastVideo.previousElementSibling, "Forward: 5s");
            e.preventDefault();
            e.stopPropagation();
            return;
        case "ArrowLeft":
            lastVideo.currentTime = Math.max(0, lastVideo.currentTime - 5);
            showStatus(lastVideo.previousElementSibling, "Backward: 5s");
            e.preventDefault();
            e.stopPropagation();
            return;
        case "l":
            lastVideo.currentTime = Math.min(lastVideo.duration, lastVideo.currentTime + 10);
            showStatus(lastVideo.previousElementSibling, "Forward: 10s");
            e.preventDefault();
            e.stopPropagation();
            return;
        case "j":
            lastVideo.currentTime = Math.max(0, lastVideo.currentTime - 10);
            showStatus(lastVideo.previousElementSibling, "Backward: 10s");
            e.preventDefault();
            e.stopPropagation();
            return;
    }
    if (!isNaN(e.key)) {
        lastVideo.currentTime = lastVideo.duration * parseInt(e.key) / 10;
        showStatus(lastVideo.previousElementSibling, `Progress: ${e.key} / 10`);
        e.preventDefault();
        e.stopPropagation();
    }
}, true);
