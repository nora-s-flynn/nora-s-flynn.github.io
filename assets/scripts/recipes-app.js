const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function showAddRecipePopup(input) {
  const task = inputBox.value.trim();
  if (!task) {
    alert("Please write a recipe name");
    return;
  }

  // show popup and bind input value to title
  $("#recipeModal").modal("show");
  $("#link-container > p")[0].innerHTML = "Paste recipe link here";
  var text = inputBox.value;
  const h1Modal = document.querySelector("#recipeModalTitle");
  var sanitizeHTML = function (str) {
    var temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }; // (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
  h1Modal.innerText = sanitizeHTML(text);

  // clears any values assigned to the elements from previous actions
  const modalInputAreas = [
    document.getElementById("recipe-ingredients-area"),
    document.getElementById("recipe-method-area"),
    document.getElementById("recipe-link"),
    document.getElementById("recipe-tags"),
  ];

  for (var i = 0; i < modalInputAreas.length; i++) {
    modalInputAreas[i].value = "";
    modalInputAreas[i].removeAttribute("readonly");
  }

  // Save progress button, currently does nothing
  document
    .querySelector("#recipeModal .btn-primary")
    .removeAttribute("disabled");

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

function showFullCard(input) {
  card = input.closest(".recipe-card");
  // safely assign values for the elements
  const recipeTitle = card.querySelector(".recipe-title").innerHTML;
  const recipeIngredientList = card.querySelector(".recipe-ingredients > ul");
  const ingredientsListClean =
    recipeIngredientList != null ? parseIngredients(recipeIngredientList) : "";
  const recipeMethod =
    card.querySelector(".recipe-method > p") != null
      ? card.querySelector(".recipe-method > p").innerHTML
      : "";
  const recipeLink =
    card.querySelector(".recipe-link > span") != null
      ? card.querySelector(".recipe-link > span").innerHTML
      : "";
  const recipeTags = 
      card.querySelector(".recipe-tags > span") != null
      ? card.querySelector(".recipe-tags > span").innerHTML
      : "";

  // show modal
  $("#recipeModal").modal("show");

  // set title and change link label
  const recipeModalTitle = document.querySelector("#recipeModalTitle");
  recipeModalTitle.innerText = recipeTitle;
  $("#link-container > p")[0].innerHTML = "Recipe link";

  // set ingredients - formatted to avoid unnecessary white spaces or newlines
  const ingredientsTextArea = document.getElementById(
    "recipe-ingredients-area"
  );
  ingredientsText = "";
  for (var j = 0; j < ingredientsListClean.length; j++) {
    ingredientsText += "\r\n" + " - " + ingredientsListClean[j];
  }
  ingredientsTextArea.value = ingredientsText.trim();

  // set method - assumes one paragraph with multiple <br>s
  const methodTextArea = document.getElementById("recipe-method-area");
  methodTextArea.value = recipeMethod
    .replace(/  +/g, " ")
    .split("<br>")
    .join("\r\n")
    .trim();

  // set URL and tags
  const linkInput = document.getElementById("recipe-link");
  linkInput.value = recipeLink;
  const tagsInput = document.getElementById("recipe-tags");
  tagsInput.value = recipeTags;

  // set readonly for input elements
  var inputEls = document.querySelectorAll(
    "#recipeModal .form-control, #recipeModal .input-item"
  );
  for (var i = 0; i < inputEls.length; i++) {
    inputEls[i].setAttribute("readonly", true);
  }

  // set Save button to disabled
  document
    .querySelector("#recipeModal .btn-primary")
    .setAttribute("disabled", true);
}

function parseIngredients(recipeIngredientList) {
  // take the ul element containing the ingredients and parse into an array to be used for constructing the card
  var ingredientsArray = [];
  const recipeIngredients = recipeIngredientList.childNodes;
  for (const itm of recipeIngredients) {
    if (itm.nodeType != 1) {
      continue;
      // type 1 is li and the innerHTML of that contains the actual value we want
    }
    ingredientsArray.push(itm.innerHTML);
  }
  return ingredientsArray;
}
