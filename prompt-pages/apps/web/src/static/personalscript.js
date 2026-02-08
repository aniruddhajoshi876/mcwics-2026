function drag_start(event) {
    var style = window.getComputedStyle(event.target, null); // gets all styles of element being dragged
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY) + ',' + event.target.id;
    event.dataTransfer.setData("text/plain", str); // saves as a string
    // index 0 -> horz. offset; 1 -> vertical offset, 2 -> event ID
}

function drop(event) {
    const [offsetX, offsetY, id] = event.dataTransfer
        .getData("text/plain")
        .split(",");

    const el = document.getElementById(id);
    if (!el) return;

    const x = event.clientX + parseInt(offsetX, 10);
    const y = event.clientY + parseInt(offsetY, 10);

    // optimistic UI update
    el.style.left = x + "px";
    el.style.top = y + "px";

    // update frontend state
    containers[id].x = x;
    containers[id].y = y;

    // notify backend (realtime sync)
    socket.emit("move_container", {
        roomId,
        containerId: id,
        x,
        y
    });

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

const date = new Date();
document.getElementById("date").textContent = date.toDateString();




/***********************
 * SOCKET SETUP
 ***********************/
const socket = io();
// const roomId = document.body.dataset.roomId;
console.log("ROOM ID:", roomId);

// join room AFTER connect
socket.on("connect", () => {
    socket.emit("join_room", { roomId });
});

/***********************
 * FRONTEND STATE
 ***********************/
const containers = {};
// containers[id] = { x, y, z, content }

/***********************
 * LOAD EXISTING ROOM STATE
 ***********************/
socket.on("load_state", (roomState) => {
    // clear UI + state
    Object.keys(containers).forEach(id => {
        document.getElementById(id)?.remove();
        delete containers[id];
    });

    roomState.containers.forEach(c => {
        const id = String(c.container_id);

        const wrapper = document.createElement("div");
        wrapper.id = id;
        wrapper.className = "container";
        wrapper.draggable = true;
        wrapper.ondragstart = drag_start;
        wrapper.style.position = "absolute";
        wrapper.style.left = c.x + "px";
        wrapper.style.top = c.y + "px";

        const img = document.createElement("img");
        img.src = c.image;

        const caption = document.createElement("input");
        caption.value = c.caption || "";
        caption.onchange = () => {
            containers[id].content.caption = caption.value;
            socket.emit("container_update", {
                roomId,
                containerId: id,
                content: containers[id].content
            });
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => {
            socket.emit("container_delete", {
                roomId,
                containerId: id
            });
        };

        wrapper.appendChild(img);
        wrapper.appendChild(caption);
        wrapper.appendChild(deleteBtn);
        document.body.appendChild(wrapper);

        containers[id] = {
            x: c.x,
            y: c.y,
            z: c.z,
            content: {
                image: c.image,
                caption: c.caption
            }
        };
    });
});

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
                    containerId: id,
                    content: containers[id].content
                });
            };

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => {
                socket.emit("container_delete", {
                    roomId,
                    containerId: id
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
                content: {
                    image: imgSrc,
                    caption: ""
                }
            };

            socket.emit("container_add", {
                roomId,
                containerId: id,
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
    if (containers[data.containerId]) return;

    const id = data.containerId;
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
    deleteBtn.onclick = () => {
        socket.emit("container_delete", {
            roomId,
            containerId: id
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
    const id = data.containerId;
    if (!containers[id]) return;

    containers[id].content = data.content;

    const el = document.getElementById(id);
    el.querySelector("img").src = data.content.image;
    el.querySelector("input").value = data.content.caption;
});

socket.on("container_deleted", data => {
    const id = data.containerId;
    delete containers[id];
    document.getElementById(id)?.remove();
});

socket.on("container_moved", data => {
    const id = data.containerId;
    const el = document.getElementById(id);
    if (!el) return;

    el.style.left = data.x + "px";
    el.style.top = data.y + "px";

    containers[id].x = data.x;
    containers[id].y = data.y;
});

/***********************
 * SAVE FULL STATE
 ***********************/
function saveRoom() {
    socket.emit("save_state", {
        roomId,
        state: {
            name: document.title,
            containers: Object.entries(containers).map(([id, c]) => ({
                container_id: id,
                image: c.content.image,
                caption: c.content.caption,
                x: c.x,
                y: c.y,
                width: 0,
                height: 0,
                z: c.z
            }))
        }
    });
}