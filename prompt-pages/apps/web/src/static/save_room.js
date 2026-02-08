const saveEl = document.querySelector('.save-js');



saveEl.addEventListener('click', () => {
    console.log("Saving room state!");
    saveRoom();


});

function saveRoom() {
    const postsDiv = document.querySelectorAll('.post-spawn-js');
    allPosts = [];


    //console.log(postsDiv)
    postsDiv.forEach(postElement => {
        const caption = postElement.querySelector('.caption').innerText;
        const name = postElement.querySelector('.name').innerText;
        const date = postElement.querySelector('.date').innerText;
        const id = postElement.querySelector('.box').id;
        const top = postElement.querySelector('.box').style.top;
        const left = postElement.querySelector('.box').style.left; 

        //console.log(post.innerHTML);
        //console.log(caption, name, date, id, top, left);

        post = {
            caption,
            name, 
            date,
            id,
            top,
            left
        };
        allPosts.push(post);
        console.log(allPosts);
    })

    console.log(allPosts);

    // fetch('/process_data', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(allPosts)
    // })
}

