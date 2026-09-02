const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addRecipePopup(input) {
  const task = inputBox.value.trim();
  if (!task) {
    alert("Please write a recipe name");
    return;
  }

  // show popup and bind input value to title
  $("#recipeAddModal").modal("show");
  var text = inputBox.value;
  const h1Modal = document.querySelector("#recipeAddModalTitle");
  var sanitizeHTML = function (str) {
    var temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }; // (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
  h1Modal.innerText = sanitizeHTML(text);

  inputBox.value = "";
}

function addRecipe() {
  const li = document.createElement("li");

  li.innerHTML = `
        <label>
            <input type="checkbox">
            <span>${task}</span>
        </label>
        <span class="edit-btn">Edit</span>
        `;

  listContainer.appendChild(li);
  inputBox.value = "";

  const checkbox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const taskSpan = li.querySelector("span");

  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    console.log("completed toggle");
  });

  editBtn.addEventListener("click", function () {
    const update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update;
      li.classList.remove("completed");
      checkbox.checked = false;
    }
  });
}
