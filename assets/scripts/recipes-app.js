const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// dropdowns
$("#mainProteinSelect").on("change", function () {
  filterDropDown(this.value);
});
$("#mealCatSelect").on("change", function () {
  filterDropDown(this.value);
});
$("#otherOptionsMS").on("change", function () {
  filterMultiSelect($("#otherOptionsMS").val() || []);
});

function showAddRecipePopup(input) {
  const task = inputBox.value.trim();
  if (!task) {
    alert("Please write a recipe name");
    return;
  }

  // show popup and bind input value to title
  $("#recipe-modal").modal("show");
  $("#link-container > p")[0].innerHTML = "Paste recipe link here";
  var text = inputBox.value;
  const h1Modal = document.querySelector("#recipeModalTitle");
  var sanitizeHTML = function (str) {
    var temp = document.createElement("div");
    temp.textContent = str;
    return temp.innerHTML;
  }; // (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
  h1Modal.innerText = sanitizeHTML(text);

  // set tags and ingredients visibility
  $("#recipe-existing-tags").addClass("d-none");
  $("#recipe-new-tags").removeClass("d-none");
  $("#existing-ingredients-list").addClass("d-none");
  $("#ingredients-input-area").removeClass("d-none");

  // clears any values assigned to the elements from previous actions
  const modalInputAreas = [
    document.getElementById("recipe-ingredients-area"),
    document.getElementById("recipe-method-area"),
    document.getElementById("recipe-link"),
    document.getElementById("new-tags-input"),
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
  // TODO: implement actually adding recipes
  //     // take parsed list of ingredients and build ul for full recipe card
  //   const tagsUnorderedList = document.getElementById("existing-tags-list");
  //   tagsUnorderedList.replaceChildren();
  //   console.log("DEBUG");
  //   console.log(tagsUnorderedList);
  //   for (var j = 0; j < ingredientsListClean.length; j++) {
  //     const ingredientsListItem = document.createElement("li");
  //     console.log(ingredientsListClean[j]);
  //     ingredientsListItem.appendChild(document.createTextNode(ingredientsListClean[j]));
  //     tagsUnorderedList.appendChild(ingredientsListItem);
  //     console.log(tagsUnorderedList);
  //   }
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
  // Shows existing recipe in full card
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
    card.querySelectorAll(".recipe-tags > span").length != 0
      ? card.querySelectorAll(".recipe-tags > span")
      : "";

  // show modal
  $("#recipeModal").modal("show");

  // set title and change link label
  const recipeModalTitle = document.querySelector("#recipeModalTitle");
  recipeModalTitle.innerText = recipeTitle;
  $("#link-container > p")[0].innerHTML = "Recipe link";

  // set ingredients
  constructRecipeIngredients(ingredientsListClean);

  // set method - assumes one paragraph with multiple <br>s
  const methodTextArea = document.getElementById("recipe-method-area");
  methodTextArea.value = recipeMethod
    .replace(/  +/g, " ")
    .split("<br>")
    .join("\r\n")
    .trim();

  // set URL
  const linkInput = document.getElementById("recipe-link");
  linkInput.value = recipeLink;

  // set tags: toggle visibility, parse and add to card
  const tagsInput = document.getElementById("recipe-existing-tags");
  tagsInput.innerHTML = "";
  tagsInput.classList.remove("d-none");
  $("#recipe-new-tags").addClass("d-none");
  const [tagsListClean, tagsText] = parseTags(recipeTags);
  const divTags = document.createElement("div");
  var innerTags = "";
  for (var i = 0; i < tagsListClean.length; i++) {
    innerTags += `
    <span class="${tagsListClean[i]}" style="display: inline-block !important;">${tagsText[i]}</span>
    `;
  }
  divTags.innerHTML = "";
  divTags.innerHTML = innerTags.trim();
  tagsInput.appendChild(divTags);

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

function constructRecipeIngredients(ingredientsListClean) {
  // set visibility
  $("#existing-ingredients-list").removeClass("d-none");
  $("#ingredients-input-area").addClass("d-none");
  // reset ul before adding the ingredients
  const tagsUnorderedList = document.getElementById("ingredients-ul");
  tagsUnorderedList.replaceChildren();
  for (var j = 0; j < ingredientsListClean.length; j++) {
    const ingredientsListItem = document.createElement("li");
    ingredientsListItem.appendChild(
      document.createTextNode(ingredientsListClean[j])
    );
    tagsUnorderedList.appendChild(ingredientsListItem);
  }
}

function parseTags(tagsElements) {
  var tagsClasses = [];
  var tagsValues = [];
  for (const el of tagsElements) {
    tagsClasses.push(el.attributes.class.value);
    tagsValues.push(el.innerText);
  }
  return [tagsClasses, tagsValues];
}

function filterDropDown(value) {
  const recipeContainer = document.getElementById("all-recipes");
  const unfilteredCards = document.querySelectorAll(".recipe-card");
  for (var i = 0; i < unfilteredCards.length; i++) {
    unfilteredCards[i].classList.remove("d-none");
  }
  if (value == "all") {
    return;
  }
  for (i = 0; i < unfilteredCards.length; i++) {
    if (unfilteredCards[i].querySelector(`.${value}`) == null) {
      unfilteredCards[i].classList.add("d-none");
    }
  }
  return;
}

function filterMultiSelect(values) {
  const recipeContainer = document.getElementById("all-recipes");
  const unfilteredCards = document.querySelectorAll(".recipe-card");
  for (var i = 0; i < unfilteredCards.length; i++) {
    unfilteredCards[i].classList.remove("d-none");
  }
  if (values == null) {
    return;
  }
  var targetTags = 0;
  for (i = 0; i < unfilteredCards.length; i++) {
    for (var j = 0; j < values.length; j++) {
      targetTags = 0;
      if (unfilteredCards[i].querySelector(`.${values[j]}`) != null) {
        targetTags++;
      }
      if (targetTags == 0) {
        unfilteredCards[i].classList.add("d-none");
      }
    }
  }
  return;
}
