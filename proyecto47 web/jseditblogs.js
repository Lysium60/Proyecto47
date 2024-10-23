const editForm = document.getElementById('editForm');
const postId = document.getElementById('postId');
const title = document.getElementById('title');
const content = document.getElementById('content');
const file = document.getElementById('file');
const currentFile = document.getElementById('currentFile');

let posts = JSON.parse(localStorage.getItem('posts')) || [];

window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const editIndex = params.get('edit');
    if (editIndex !== null) {
        const post = posts[editIndex];
        if (post) {
            postId.value = editIndex;
            title.value = post.title;
            content.value = post.content;
            if (post.fileName) {
                currentFile.textContent = `Archivo actual: ${post.fileName}`;
            }
        }
    }
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const index = parseInt(postId.value);
    const post = posts[index];
    post.title = title.value;
    post.content = content.value;

    const savePost = () => {
        localStorage.setItem('posts', JSON.stringify(posts));
        window.location.href = 'view-blogs.html';
    };

    if (file.files[0]) {
        const reader = new FileReader();
        reader.onload = function (event) {
            post.fileName = file.files[0].name;
            post.fileType = file.files[0].type;
            post.fileSize = file.files[0].size;
            post.fileData = event.target.result;
            savePost();
        };
        reader.readAsDataURL(file.files[0]);
    } else {
        savePost();
    }
});