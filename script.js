function init(){
  includeHTML(); 
  loadLike(); 
  loadComments(); 
  loadBookmark();
  render();
}
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
} 

function render() {
  let content = document.getElementById("post-container");
  
  content.innerHTML = "";

  for (let i = 0; i < postsArray.length; i++) {
    let post = postsArray[i];
    let likeImage = post.likedPost ? "./icons/like.png" : "./icons/nolike.png"; // verkürzte Konstruktion namens "bedingter Operator": Wenn post.likedPost true ist dann wird likeImage angezeigt und bei false umgedreht //   
    let bookmark = post.bookmarkedPost ? "./icons/bookmark_black.png" : "./icons/bookmark_white.png";

    content.innerHTML += htmlTemplate(i);
        
      showComments(i);
  }   
}

function toggleLike(i) {   
  if (postsArray[i].likedPost) {
    postsArray[i].likedPost = false;
    postsArray[i].likes--;
  } else {
    postsArray[i].likedPost = true;
    postsArray[i].likes++;
  }
  updateLikes();
  saveLike(i);
} 

function toggleBookmark(i) {   
  postsArray[i].bookmarkedPost = !postsArray[i].bookmarkedPost;  
  updateBookmarkIcon(i);
  saveBookmark(i);
}

function updateBookmarkIcon(i) {
  let bookmark = document.getElementById(`bookmark${i}`);
  
  if (bookmark) {
    if (postsArray[i].bookmarkedPost) {
      bookmark.src = "./icons/bookmark_black.png";
    } else {
      bookmark.src = "./icons/bookmark_white.png";
    }
  }
  render();
}

function saveBookmark(i) {
  let bookmarkAsText = JSON.stringify(postsArray[i].bookmarkedPost); 
  localStorage.setItem(`bookmark${i}`, bookmarkAsText); 
}

function loadBookmark() {
  for (let i = 0; i < postsArray.length; i++) {
    let bookmarkAsText = localStorage.getItem(`bookmark${i}`);  

    if (bookmarkAsText) {
    postsArray[i].bookmarkedPost = JSON.parse(bookmarkAsText); 
    } 
  }
}

function updateLikes(i) {
  let postLikes = 0;

  for (let i = 0; i < postsArray.length; i++) {
  postLikes += postsArray[i].likes; 
  }
  let updateLikesElement = document.getElementById(`updateLikes${i}`);
  if (updateLikesElement) {
  updateLikesElement.innerHTML = /*html*/ `<div class="post-comment"><b>Gefällt ${post.likes} Mal</b></div>
  `;
  }
  render();
}

function saveLike(i) {
  let likesAsText = JSON.stringify(postsArray[i].likes);
  let likedPostAsText = JSON.stringify(postsArray[i].likedPost);  
  localStorage.setItem(`likes${i}`, likesAsText);
  localStorage.setItem(`likedPost${i}`, likedPostAsText);
}

function loadLike() {
  for (let i = 0; i < postsArray.length; i++) {
    let likesAsText = localStorage.getItem(`likes${i}`); 
    let likedPostAsText = localStorage.getItem(`likedPost${i}`);

    if (likesAsText && likedPostAsText) {
    postsArray[i].likes = JSON.parse(likesAsText);
    postsArray[i].likedPost = JSON.parse(likedPostAsText);
    } 
  }
}

function addComment(i) {
  let commentInput = document.getElementById(`comment${i}`);  
  let comment = commentInput.value;

  if (comment === "") {
    alert("Bitte schreibe zuerst einen Kommentar.");
    return false;
  } else {
    postsArray[i]['newComment'].push(comment);
    saveComments(i);
    showComments(i);
  }
    commentInput.value = '';  
}

function showComments(i) {
  let showComments = document.getElementById(`showComments${i}`); 
  showComments.innerHTML = '';

  for (let j = 0; j < postsArray[i]['newComment'].length; j++) {
    showComments.innerHTML +=  `<div class="comment-list">
      ${postsArray[i]['newComment'][j]} 
      </div>
    `;
  }   
}

function saveComments(i)  {
  let commentsAsText = JSON.stringify(postsArray[i]['newComment']);
  localStorage.setItem(`comments${i}`, commentsAsText);
}

function loadComments() {
  for (let i = 0; i < postsArray.length; i++) {
  let commentsAsText = localStorage.getItem(`comments${i}`);
  if(commentsAsText) {
    postsArray[i]['newComment'] = JSON.parse(commentsAsText);
    }  
  }
}

function htmlTemplate(i) { 
  let post = postsArray[i];
  let likeImage = post.likedPost ? "./icons/like.png" : "./icons/nolike.png"; // verkürzte Konstruktion namens "bedingter Operator": Wenn post.likedPost true ist dann wird likeImage angezeigt und bei false umgedreht //   
  let bookmark = post.bookmarkedPost ? "./icons/bookmark_black.png" : "./icons/bookmark_white.png";
  
  return `
  <div class="post-header">
    <img class="icon" src="${post.profileImage}" alt="User Profile">
    <span class="profileName">${post.profileName}</span>
  </div>
  <div class="post-content">
    <img class="post-image" src="${post.postImage}" alt="Post Image">
  </div>

  <div class="post-actions" id="likes${i}" >
    <div>
      <div class="post-actions-left" >
        <div class="post-icons-left">
          <button id="toggleLike${i}" onclick="toggleLike(${i})" style="border: none; background: none; padding: 0;">
          <img class="postIcon" src="${likeImage}" alt="Like Button"> 
          </button>
          <img class="postIcon" src="./icons/chat.png">
          <img class="postIcon" src="./icons/send.png">
        </div>
      <div class="post-icons-right" >
        <button onclick="toggleBookmark(${i})" class="bookmark" id="bookmark${i}">
          <img class="postIcon" src="${bookmark}" alt="bookmarked"> 
        </button>
      </div>
    </div>
  </div>
  <div>
    <div class="post-comment" id="updateLikes${i}"><b>Gefällt ${post.likes} Mal</b></div>
    <div class="post-comment"><b>${post.profileName}</b> ${post.comment}</div>
  </div>  
  <div class="add-comment">
    <textarea class="commentInput" type="text" id="comment${i}" placeholder="Kommentieren"></textarea>
    <button onclick="addComment(${i})">hinzufügen</button> 
  </div> 
  <div id="showComments${i}" class="showComment"></div>
  `;
}