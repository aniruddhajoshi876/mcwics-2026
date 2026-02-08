const addButtonEl = document.querySelector(".add-post-js");

const postSpawnEl = document.querySelector('.post-spawn-js');

console.log("Running!")
console.log(Date.now())

addButtonEl.addEventListener('click', () => {
    console.log("Clicked!")

    makePost();

})

function loadData() {
    
}

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