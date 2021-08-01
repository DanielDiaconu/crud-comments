let payload = {};

async function getComments() {
  let response = await fetch("http://localhost:3000/comments");
  let data = await response.json();
  for (let comment of data) {
    buildComment(comment);
  }
}
getComments();

async function commentPost(e) {
  e.preventDefault();
  console.log(payload);
  await fetch("http://localhost:3000/comments", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  buildComment(payload);
}

function postData(e) {
  payload[e.target.name] = e.target.value;
}

function buildComment(comment) {
  const parent = document.querySelector(".mt-5");
  const mainDiv = document.createElement("div");
  const headerComment = document.createElement("div");
  headerComment.classList.add("mb-2");
  mainDiv.appendChild(headerComment);
  const name = document.createElement("h5");
  name.classList.add("m-0");
  name.innerText = comment.name;
  headerComment.appendChild(name);
  const email = document.createElement("span");
  email.classList.add("text-muted");
  email.innerText = comment.email;
  headerComment.appendChild(email);
  const body = document.createElement("p");
  body.innerText = comment.body;
  mainDiv.appendChild(body);
  const del = document.createElement("span");
  del.innerText = "X";
  del.setAttribute("id", comment.id);
  del.classList.add("delete");
  headerComment.appendChild(del);
  const edit = document.createElement("button");
  edit.classList.add("edit-btn");
  edit.innerText = "Edit me";
  headerComment.appendChild(edit);
  const flexRow = document.createElement("div");
  flexRow.classList.add("flex-row");

  const editInput = document.createElement("input");
  editInput.setAttribute("name", "edit-input");
  flexRow.appendChild(editInput);
  const editSaveButton = document.createElement("button");
  editSaveButton.classList.add("secondary-btn");
  editSaveButton.innerText = "Update";
  flexRow.appendChild(editSaveButton);
  mainDiv.appendChild(flexRow);
  parent.appendChild(mainDiv);

  del.addEventListener("click", deleteData);
  edit.addEventListener("click", () => {
    flexRow.classList.toggle("active");
    editInput.value = comment.body;
  });

  editSaveButton.addEventListener("click", async () => {
    await fetch(`http://localhost:3000/comments/${comment.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        body: editInput.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    flexRow.classList.remove("active");
    body.innerText = editInput.value;
  });
}

async function deleteData(event) {
  const id = event.target.id;
  await fetch(`http://localhost:3000/comments/${id}`, {
    method: "DELETE",
  });

  event.target.parentElement.parentElement.remove();
}
