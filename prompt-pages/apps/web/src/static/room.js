const addButtonEl = document.querySelector(".add-post-js");
const postSpawnEl = document.querySelector('.post-spawn-js');

console.log("Running!")
console.log(Date.now())

addButtonEl.addEventListener('click', () => {
    console.log("Clicked!")

    makePost();

})

function loadData(posts) {
    console.log(posts);

    posts.forEach(post => {

    console.log(post);
    const postHTML = ` <div id="box1" class="box" draggable="true">
        <span class="name" contenteditable="true">${post.user}</span>
        <span class="date" id="date">${post.date}</span>

        <div class="image"> 
            <input type="file">     
        </div>
        <div class="caption" contenteditable="true">${post.caption}</div>
    </div>
    
    `

    postSpawnEl.insertAdjacentHTML('beforeend', postHTML);

    const newPost = postSpawnEl.lastElementChild;

    newPost.id = 'post_' + Date.now();

    newPost.style.left = post.x + 'px';
    newPost.style.top = post.y + 'px';

    newPost.ondragstart = drag_start;

});
}

document.addEventListener("DOMContentLoaded", () => {
    loadData(posts)
});



function makePost(postData) {
     const date = new Date();

    const postHTML = `    <div id="box1" class="box" draggable="true">
        <span class="name" contenteditable="true">user</span>
        <span class="date" id="date">${date.toDateString()}</span>

        <div class="image"> 
            <input type="file">     
        </div>
        <div class="caption" contenteditable="true">edit me</div>
    </div>
    `

    postSpawnEl.insertAdjacentHTML('beforeend', postHTML);

    const newPost = postSpawnEl.lastElementChild;

    newPost.id = 'post_' + Date.now();
    newPost.ondragstart = drag_start;
}