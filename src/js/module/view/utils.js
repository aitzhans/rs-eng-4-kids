function createAudio(url) {
    const audio = document.createElement('audio');
    audio.setAttribute('src', url);
    return audio;
}

function playAudio(audioElem) {
    const audio = audioElem;
    audio.currentTime = 0;
    audio.play();
}

export {
    createAudio,
    playAudio,
};
