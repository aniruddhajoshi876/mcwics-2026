const saveEl = document.querySelector('.save-js');

const postsDiv = document.querySelectorAll('.post-spawn-js');

saveEl.addEventListener('click', () => {
    console.log("Saving room state!");
    saveRoom();


});

function saveRoom() {
    const posts = postsDiv.children;
    console.log(posts);

}