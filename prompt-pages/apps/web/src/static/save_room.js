const saveEl = document.querySelector('.save-js');



saveEl.addEventListener('click', () => {
    console.log("Saving room state!");
    saveRoom();


});

function saveRoom() {
    const postsDiv = document.querySelectorAll('.post-spawn-js');


    const childrenPosts = postsDiv[0].children;

    // console.log(childrenPosts.length);

    // console.log(childrenPosts.length);
    // console.log(childrenPosts);
    let allPosts = [];

    for (let i = 0; i < childrenPosts.length; i++) {
        const postElement = childrenPosts[i];
        // console.log(postElement);

        const caption = postElement.querySelector('.caption').innerText;
        const name = postElement.querySelector('.name').innerText;
        const date = postElement.querySelector('.date').innerText;
        const id = postElement.id;
        const top = postElement.style.top;
        const left = postElement.style.left; 

        post = {
            caption,
            name, 
            date,
            id,
            top,
            left
        };
        allPosts.push(post);
    }



    console.log(allPosts);
    console.log(allPosts.length);

    fetch('/process_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(allPosts)
    })
    // .catch(error => console.error("Error sending posts:", error));
}

