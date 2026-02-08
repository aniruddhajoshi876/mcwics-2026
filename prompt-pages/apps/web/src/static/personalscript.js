function drag_start(event) {
    var style = window.getComputedStyle(event.target, null); // gets all styles of element being dragged
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY) + ',' + event.target.id;
    event.dataTransfer.setData("text/plain", str); // saves as a string
    // index 0 -> horz. offset; 1 -> vertical offset, 2 -> event ID
}

function drop(event) {
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById(offset[2]);
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'; // finds new location
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    return false;
}

function drag_over(event) {
    event.preventDefault(); // allows element to recieve drops
    return false;
}

$("input[type='file']").change(function(e) { // jquery  
    const files = e.target.files; // supports multiple file uploads, loops thru later

    for (let i = 0; i < files.length; i++) {
        const file = files[i]; // current file from list

        const img = document.createElement("img");
        const reader = new FileReader();

        reader.onload = function(event) {
            img.src = event.target.result;
            
            $(e.target).hide(); // hide image upload prompt

            $(e.target).parent().append(img); // appends to img <div>
        };

        reader.readAsDataURL(file);
    }
});

/***********************
 * SOCKET SETUP
 ***********************/
const socket = io();

// join room on load
socket.emit("join", { roomId });

/***********************
 * FRONTEND STATE
 ***********************/
const containers = {}; 
// containers[id] = { x, y, z, content: { image, caption } }

/***********************
 * DRAG & DROP
 ***********************/
function drag_start(event) {
    const style = window.getComputedStyle(event.target, null);
    const offsetX = parseInt(style.getPropertyValue("left")) - event.clientX;
    const offsetY = parseInt(style.getPropertyValue("top")) - event.clientY;
    const str = offsetX + ',' + offsetY + ',' + event.target.id;
    event.dataTransfer.setData("text/plain", str);
}

function drop(event) {
    const offset = event.dataTransfer.getData("text/plain").split(',');
    const id = offset[2];
    const el = document.getElementById(id);

    const x = event.clientX + parseInt(offset[0], 10);
    const y = event.clientY + parseInt(offset[1], 10);

    // local update (optimistic)
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    containers[id].x = x;
    containers[id].y = y;

    // realtime sync
    socket.emit("move_container", {
        roomId,
        container_id: id,
        x,
        y
    });

    event.preventDefault();
    return false;
}

function drag_over(event) {
    event.preventDefault();
    return false;
}

/***********************
 * IMAGE UPLOAD → ADD CONTAINER
 ***********************/
$("input[type='file']").change(function (e) {
    const files = e.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (event) {
            const id = crypto.randomUUID();
            const imgSrc = event.target.result;

            // create container
            const wrapper = document.createElement("div");
            wrapper.id = id;
            wrapper.className = "container";
            wrapper.draggable = true;
            wrapper.ondragstart = drag_start;
            wrapper.style.position = "absolute";
            wrapper.style.left = "100px";
            wrapper.style.top = "100px";

            const img = document.createElement("img");
            img.src = imgSrc;

            const caption = document.createElement("input");
            caption.placeholder = "caption...";
            caption.onchange = () => {
                containers[id].content.caption = caption.value;

                socket.emit("container_update", {
                    roomId,
                    container_id: id,
                    content: containers[id].content
                });
            };

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style.marginTop = "5px";
            deleteBtn.onclick = () => {
                socket.emit("container_delete", {
                    roomId,
                    container_id: id
                });
            };

            wrapper.appendChild(img);
            wrapper.appendChild(caption);
            wrapper.appendChild(deleteBtn);
            document.body.appendChild(wrapper);

            // update frontend state
            containers[id] = {
                x: 100,
                y: 100,
                z: 1,
                content: {
                    image: imgSrc,
                    caption: ""
                }
            };

            // realtime add
            socket.emit("container_add", {
                roomId,
                container_id: id,
                content: containers[id].content
            });

            $(e.target).hide();
        };

        reader.readAsDataURL(file);
    }
});

/***********************
 * REALTIME LISTENERS
 ***********************/
socket.on("container_added", data => {
    if (containers[data.container_id]) return;

    const id = data.container_id;
    const content = data.content;

    const wrapper = document.createElement("div");
    wrapper.id = id;
    wrapper.className = "container";
    wrapper.draggable = true;
    wrapper.ondragstart = drag_start;
    wrapper.style.position = "absolute";
    wrapper.style.left = "100px";
    wrapper.style.top = "100px";

    const img = document.createElement("img");
    img.src = content.image;

    const caption = document.createElement("input");
    caption.value = content.caption || "";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginTop = "5px";
    deleteBtn.onclick = () => {
        socket.emit("container_delete", {
            roomId,
            container_id: id
        });
    };

    wrapper.appendChild(img);
    wrapper.appendChild(caption);
    wrapper.appendChild(deleteBtn);
    document.body.appendChild(wrapper);

    containers[id] = {
        x: 100,
        y: 100,
        z: 1,
        content
    };
});

socket.on("container_updated", data => {
    const id = data.container_id;
    if (!containers[id]) return;

    containers[id].content = data.content;

    const el = document.getElementById(id);
    el.querySelector("img").src = data.content.image;
    el.querySelector("input").value = data.content.caption;
});

socket.on("container_deleted", data => {
    const id = data.container_id;
    delete containers[id];
    document.getElementById(id)?.remove();
});

socket.on("container_moved", data => {
    const el = document.getElementById(data.container_id);
    if (!el) return;

    el.style.left = data.x + "px";
    el.style.top = data.y + "px";

    containers[data.container_id].x = data.x;
    containers[data.container_id].y = data.y;
});

/***********************
 * SAVE FULL STATE
 ***********************/
function saveRoom() {
    socket.emit("save_state", {
        roomId,
        state: {
            containers
        }
    });
}

