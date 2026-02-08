const saveEl = document.querySelector('.save-js');

const postsDiv = document.querySelectorAll('.post-spawn-js');

saveEl.addEventListener('click', () => {
    console.log("Saving room state!");
    saveRoom();


});

function saveRoom() {
    console.log(postsDiv)
    postsDiv.forEach(post => {
        const caption = post.querySelector('.caption').innerText;
        const name = post.querySelector('.name').innerText;
        const date = post.querySelector('.date').innerText;
        const id = post.querySelector('.box').id;
        const top = post.querySelector('.box').style.top;
        const left = post.querySelector('.box').style.left; 
        
        console.log(post.innerHTML);
        console.log(caption, name, date, id, top, left);
    }
    //console.log(posts.innerHTML);
)
}