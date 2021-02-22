async function getJSON(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}


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

const stringsSort = direction => (stringA, stringB) => {
    return (direction === 'descending')
        ? stringA.toLowerCase().localeCompare(stringB.toLowerCase())
        : stringB.toLowerCase().localeCompare(stringA.toLowerCase());
};

const numbersSort = direction => (a, b) => ((direction === 'descending') ? b - a : a - b);


export {
    getJSON,
    shuffleArray,
    createAudio,
    playAudio,
    stringsSort,
    numbersSort,
};
