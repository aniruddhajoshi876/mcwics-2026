
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
