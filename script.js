const createNote = document.querySelector(".create-note");
const createNoteTitle = document.querySelector(".create-note-title");
const createNoteContent = document.querySelector(".create-note-content");
const createNoteFooter = document.querySelector(".create-note-footer");
const createNoteCancelBtn = document.querySelector(".create-note-cancel");
const searchBar = document.querySelector(".search-box-input");
/**
 * @noteColor - default note color when note created if none is selected
 */
let noteColor = "white";
/**
 * @notes - notes container
 */
let notes = [];

//Search bar
searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();
  console.log(searchString);
  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(searchString) ||
      note.content.toLowerCase().includes(searchString)
    );
  });
  displayNotes(filteredNotes);
});

//Expand container(and the posible actions)
createNote.addEventListener("click", function (e) {
  e.stopPropagation();
  createNoteTitle.classList.add("fadeIn");
  createNoteFooter.classList.add("fadeIn");
});

//Pick a color
const pickColor = document.querySelectorAll(".pick-color");
pickColor.forEach(function (elem) {
  elem.addEventListener("click", (e) => {
    let color = window
      .getComputedStyle(e.target, null)
      .getPropertyValue("background-color");
    console.log(color);

    createNote.style.backgroundColor = color;
    createNoteTitle.style.backgroundColor = color;
    createNoteContent.style.backgroundColor = color;
    createNoteFooter.style.backgroundColor = color;

    noteColor = color;

    e.preventDefault();
  });
});

//Minimize container on click outside
window.addEventListener("click", (e) => {
  createNoteTitle.classList.remove("fadeIn");
  createNoteFooter.classList.remove("fadeIn");

  createNote.style.backgroundColor = "white";
  createNoteTitle.style.backgroundColor = "white";
  createNoteContent.style.backgroundColor = "white";
  createNoteFooter.style.backgroundColor = "white";

  if (createNoteTitle.value != "" || createNoteContent.value != "") {
    insertNote();
  }

  createNoteTitle.value = "";
  createNoteContent.value = "";
  noteColor = "white";
  e.stopPropagation();
});

//Minimize container on click cancel
createNoteCancelBtn.addEventListener("click", (e) => {
  createNoteTitle.classList.remove("fadeIn");
  createNoteFooter.classList.remove("fadeIn");

  createNote.style.backgroundColor = "white";
  createNoteTitle.style.backgroundColor = "white";
  createNoteContent.style.backgroundColor = "white";
  createNoteFooter.style.backgroundColor = "white";

  if (createNoteTitle.value != "" || createNoteContent.value != "") {
    insertNote();
  }

  createNoteTitle.value = "";
  createNoteContent.value = "";
  noteColor = "white";
  e.stopPropagation();
});

function insertNote() {
  const title = createNoteTitle.value;
  const content = createNoteContent.value;
  console.log(title, content, noteColor);

  fetch("http://localhost:3000/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      color: noteColor,
      image: "",
    }),
  })
    .then(() => loadNotes())
    .then(() => displayNotes(notes));
}

function createNoteElements(notes) {
  const fragment = document.createDocumentFragment();

  notes.forEach((note) => {
    const divItem = document.createElement("div");

    //Item
    divItem.id = note.id;
    divItem.setAttribute("class", "crud-note-item");
    divItem.style.backgroundColor = note.color;

    //Image
    if (note.image != "") {
      const image = document.createElement("img");
      image.src = note.image;
      divItem.appendChild(image);
    }

    //Title
    if (note.title != "") {
      const title = document.createElement("input");
      title.setAttribute("type", "text");
      title.setAttribute("placeholder", "Title");
      title.setAttribute("class", "crud-note-item-title");
      title.setAttribute("readonly", true);
      title.value = note.title;
      title.style.backgroundColor = note.color;
      divItem.appendChild(title);
    }

    //Content
    if (note.content != "") {
      const content = document.createElement("textarea");
      content.setAttribute("placeholder", "Content");
      content.setAttribute("class", "crud-note-item-content");
      content.setAttribute("readonly", true);
      content.innerText = note.content;
      content.style.backgroundColor = note.color;
      divItem.appendChild(content);
    }

    //Footer
    const footer = document.createElement("div");
    footer.setAttribute("class", "crud-note-item-footer");
    const btnColor = document.createElement("div");
    btnColor.setAttribute("class", "crud-note-item-footer-color");
    btnColor.innerText = "Color";
    const selectColor = document.createElement("div");
    selectColor.setAttribute("class", "crud-note-item-footer-color-select");

    const colorA = document.createElement("div");
    colorA.setAttribute("class", "pick-color");
    colorA.setAttribute("data-id", "1");
    const colorB = document.createElement("div");
    colorB.setAttribute("class", "pick-color");
    colorB.setAttribute("data-id", "2");
    const colorC = document.createElement("div");
    colorC.setAttribute("class", "pick-color");
    colorC.setAttribute("data-id", "3");
    const colorD = document.createElement("div");
    colorD.setAttribute("class", "pick-color");
    colorD.setAttribute("data-id", "4");
    const colorE = document.createElement("div");
    colorE.setAttribute("class", "pick-color");
    colorE.setAttribute("data-id", "5");

    selectColor.appendChild(colorA);
    selectColor.appendChild(colorB);
    selectColor.appendChild(colorC);
    selectColor.appendChild(colorD);
    selectColor.appendChild(colorE);
    btnColor.appendChild(selectColor);

    const btnEdit = document.createElement("div");
    btnEdit.setAttribute("class", "crud-note-item-footer-edit");
    btnEdit.innerText = "Edit";

    const btnDelete = document.createElement("div");
    btnDelete.setAttribute("class", "crud-note-item-footer-delete");
    btnDelete.innerText = "Delete";

    footer.style.backgroundColor = note.color;
    footer.appendChild(btnColor);
    footer.appendChild(btnEdit);
    footer.appendChild(btnDelete);

    divItem.appendChild(footer);

    fragment.appendChild(divItem);
  });
  return fragment;
}

async function loadNotes() {
  notes = await getNotes();
  console.log(notes);
  displayNotes(notes);
}

function getNotes() {
  return fetch(`http://localhost:3000/notes`, {
    method: "GET",
  }).then((result) => result.json());
}

function displayNotes(notes) {
  console.log("displayNotes" + notes);
  const noteList = document.querySelector(".crud-note");

  noteList.innerHTML = null;
  const noteElements = createNoteElements(notes);
  noteList.appendChild(noteElements);
}
loadNotes();

// Modal

function createNoteModal(note) {
  const fragment = document.createDocumentFragment();

  //Modal
  const divItem = document.createElement("div");
  divItem.id = note.id;
  divItem.setAttribute("class", "crud-note-modal-item");
  divItem.style.backgroundColor = note.color;

  //Image container
  const imageContainer = document.createElement("div");
  imageContainer.setAttribute("class", "crud-note-modal-item-container-image");

  //Image

  const image = document.createElement("img");
  image.setAttribute("img-id", "preview");
  image.src = note.image;
  if (note.image == "") {
    image.setAttribute("class", "fadeOut");
    imageContainer.className += " fadeOut";
  }

  //Image button
  const deleteImage = document.createElement("div");
  deleteImage.setAttribute("class", "deleteImage");
  deleteImage.innerText = "Delete";
  imageContainer.appendChild(image);
  imageContainer.appendChild(deleteImage);
  divItem.appendChild(imageContainer);

  //Title
  const title = document.createElement("input");
  title.setAttribute("type", "text");
  title.setAttribute("placeholder", "Title");
  title.setAttribute("class", "crud-note-modal-item-title");
  title.value = note.title;
  title.style.backgroundColor = note.color;
  divItem.appendChild(title);

  //Content
  const content = document.createElement("textarea");
  content.setAttribute("placeholder", "Content");
  content.setAttribute("class", "crud-note-modal-item-content");
  content.innerText = note.content;
  content.style.backgroundColor = note.color;
  divItem.appendChild(content);

  //Footer
  const footer = document.createElement("div");
  footer.setAttribute("class", "crud-note-modal-item-footer");
  const btnColor = document.createElement("div");
  btnColor.setAttribute("class", "crud-note-modal-item-footer-color");
  btnColor.innerText = "Color";
  const selectColor = document.createElement("div");
  selectColor.setAttribute("class", "crud-note-modal-item-footer-color-select");
  const colorA = document.createElement("div");
  colorA.setAttribute("class", "pick-color");
  colorA.setAttribute("data-id", "1");
  const colorB = document.createElement("div");
  colorB.setAttribute("class", "pick-color");
  colorB.setAttribute("data-id", "2");
  const colorC = document.createElement("div");
  colorC.setAttribute("class", "pick-color");
  colorC.setAttribute("data-id", "3");
  const colorD = document.createElement("div");
  colorD.setAttribute("class", "pick-color");
  colorD.setAttribute("data-id", "4");
  const colorE = document.createElement("div");
  colorE.setAttribute("class", "pick-color");
  colorE.setAttribute("data-id", "5");

  selectColor.appendChild(colorA);
  selectColor.appendChild(colorB);
  selectColor.appendChild(colorC);
  selectColor.appendChild(colorD);
  selectColor.appendChild(colorE);
  btnColor.appendChild(selectColor);

  const imageImport = document.createElement("input");
  imageImport.setAttribute("type", "file");
  imageImport.setAttribute("accept", "image/*");

  const btnCancel = document.createElement("div");
  btnCancel.setAttribute("class", "crud-note-modal-item-footer-cancel");
  btnCancel.innerText = "Cancel";

  const btnDelete = document.createElement("div");
  btnDelete.setAttribute("class", "crud-note-modal-item-footer-delete");
  btnDelete.innerText = "Delete";

  footer.style.backgroundColor = note.color;
  footer.appendChild(btnColor);
  footer.appendChild(imageImport);
  footer.appendChild(btnCancel);
  footer.appendChild(btnDelete);

  divItem.appendChild(footer);

  fragment.appendChild(divItem);

  return fragment;
}

async function displayModal(id) {
  const notes = await getNoteById(id);
  console.log(notes);
  const noteList = document.querySelector(".create-note-modal");

  noteList.innerHTML = null;
  const noteElements = createNoteModal(notes);
  noteList.appendChild(noteElements);
}

function getNoteById(id) {
  return fetch(`http://localhost:3000/notes/${id}`, {
    method: "GET",
  }).then((result) => result.json());
}

//  CRUD NOTES
let modal = document.querySelector(".create-note-modal");
const noteBtn = document.querySelector(".crud-note");

noteBtn.addEventListener("click", (e) => {
  const pickColor = e.target.className === "pick-color";
  const editBtn = e.target.className === "crud-note-item-footer-edit";
  const deleteBtn = e.target.className === "crud-note-item-footer-delete";
  const idBtn = e.target.parentElement.parentElement.id;

  if (pickColor) {
    console.log("flaviu");
    let color = window
      .getComputedStyle(e.target, null)
      .getPropertyValue("background-color");
    console.log(color);

    createNote.style.backgroundColor = color;
    createNoteTitle.style.backgroundColor = color;
    createNoteContent.style.backgroundColor = color;
    createNoteFooter.style.backgroundColor = color;

    const idColor =
      e.target.parentElement.parentElement.parentElement.parentElement.id;
    console.dir(
      e.target.parentElement.parentElement.parentElement.parentElement.id
    );
    updateNoteColor(idColor, color);
    e.preventDefault();
  } else if (editBtn) {
    displayModal(idBtn);

    modal.style.display = "block";
  } else if (deleteBtn) {
    deleteNote(idBtn);
  }

  e.preventDefault();
});

//  CRUD MODAL
modal.addEventListener("click", (e) => {
  let modalNoteColor = modal.firstChild.style.backgroundColor;
  const closeBtn = e.target.className === "crud-note-modal-item-footer-cancel";
  const pickColor = e.target.className === "pick-color";
  const deleteBtn = e.target.className === "crud-note-modal-item-footer-delete";
  const imageDelete = e.target.className === "deleteImage";

  const image = document.querySelector("[img-id='preview']");
  image.addEventListener("click", (e) => {
    console.log(image.src);
  });
  const createNote = document.querySelector(".crud-note-modal-item");
  const imageContainer = document.querySelector(
    ".crud-note-modal-item-container-image"
  );

  let idModal = createNote.id;
  const createNoteTitle = document.querySelector(".crud-note-modal-item-title");
  const createNoteContent = document.querySelector(
    ".crud-note-modal-item-content"
  );
  const createNoteFooter = document.querySelector(
    ".crud-note-modal-item-footer"
  );

  //Import Image
  const imageObject = document.querySelector("input[type=file]");
  let preview;
  imageObject.addEventListener("change", (e) => {
    console.log("ASdasdas");
    let imageContainer = document.querySelector(
      ".crud-note-modal-item-container-image"
    );
    preview = document.querySelector("[img-id='preview']");
    let file = document.querySelector("input[type=file]").files[0];
    let reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        preview.src = reader.result;
        updateNoteModalImage(idModal, reader.result);
        //Delete the file from filelist so you can select the same image after you delete it
        file = document.querySelector("input[type=file]").value = "";
        preview.setAttribute("class", " fadeIn");
        imageContainer.className += " fadeIn";
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  });

  if (pickColor) {
    console.log("flaviu");
    let color = window
      .getComputedStyle(e.target, null)
      .getPropertyValue("background-color");
    console.log(color);

    createNote.style.backgroundColor = color;
    createNoteTitle.style.backgroundColor = color;
    createNoteContent.style.backgroundColor = color;
    createNoteFooter.style.backgroundColor = color;

    modalNoteColor = color;

    e.preventDefault();
  } else if (imageDelete) {
    console.log("scoate poza");
    updateNoteModalImage(idModal, "");
    image.src = "";
    imageContainer.classList.remove("fadeIn");
    imageContainer.className += " fadeOut";
  }
  if (deleteBtn) {
    deleteNote(idModal);
    modal.style.display = "none";
  }
  if (closeBtn) {
    console.log(preview);
    modal.style.display = "none";
    updateNoteModal(
      idModal,
      createNoteTitle.value,
      createNoteContent.value,
      modalNoteColor
    );
  }

  if (e.target == modal) {
    console.log(preview);
    modal.style.display = "none";
    updateNoteModal(
      idModal,
      createNoteTitle.value,
      createNoteContent.value,
      modalNoteColor
    );
    console.log("!2312312");
  }
});

function updateNoteModal(id, title, content, color) {
  fetch(`http://localhost:3000/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      content,
      color,
    }),
  })
    .then((response) => response.json())
    .then(() => loadNotes())
    .then(() => displayNotes(notes));
}

function updateNoteModalImage(id, image) {
  fetch(`http://localhost:3000/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image,
    }),
  })
    .then((response) => response.json())
    .then(() => loadNotes())
    .then(() => displayNotes(notes));
}

function updateNoteColor(id, color) {
  fetch(`http://localhost:3000/notes/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      color,
    }),
  })
    .then((response) => response.json())
    .then(() => loadNotes())
    .then(() => displayNotes(notes));
}

function deleteNote(id) {
  fetch(`http://localhost:3000/notes/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => loadNotes())
    .then(() => displayNotes(notes));
}
