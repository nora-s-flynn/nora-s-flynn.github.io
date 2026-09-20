const inputBox = document.getElementById("input-box");

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

// load recipes
document.addEventListener("DOMContentLoaded", () => {
  loadRecipes();
});

class Recipe {
  constructor(title, URL, ingredients, method, tags, tried) {
    this.title = title;
    this.URL = URL;
    this.ingredients = ingredients;
    this.method = method;
    this.tags = tags;
    this.tried = tried;
  }
}

function tagToTitleCase(txt) {
  return txt
    .toLowerCase()
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function addHeadingEl(div, txt) {
  var h6 = document.createElement("h6");
  h6.innerHTML = txt;
  div.appendChild(h6);
}
 
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
    const temp = document.createElement("div");
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

  $("#recipeTriedChk").prop("disabled", false);
  $("#recipeTriedChk").prop("checked", false);

  // Save progress button, currently does nothing
  document
    .querySelector("#recipe-modal .btn-primary")
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
  $("#recipe-modal").modal("show");

  // set title and change link label
  const recipeModalTitle = document.querySelector("#recipeModalTitle");
  recipeModalTitle.innerText = recipeTitle;
  $("#link-container > p")[0].innerHTML = "Recipe link";

  // set ingredients
  constructRecipeIngredients(
    ingredientsListClean,
    document.getElementById("ingredients-ul"),
  );

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

  // set the checkbox for reciped tried
  $("#recipeTriedChk").prop("disabled", true);
  if (card.classList.contains("tried")) {
    $("#recipeTriedChk").prop("checked", true);
  } else {
    $("#recipeTriedChk").prop("checked", false);
  }

  // set readonly for input elements
  var inputEls = document.querySelectorAll(
    "#recipe-modal .form-control, #recipe-modal .input-item",
  );
  for (var i = 0; i < inputEls.length; i++) {
    inputEls[i].setAttribute("readonly", true);
  }

  // set Save button to disabled
  document
    .querySelector("#recipe-modal .btn-primary")
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

function constructRecipeIngredients(ingredientsListClean, targetElement) {
  // set visibility
  $("#existing-ingredients-list").removeClass("d-none");
  $("#ingredients-input-area").addClass("d-none");
  // reset ul before adding the ingredients
  targetElement.replaceChildren();
  for (var j = 0; j < ingredientsListClean.length; j++) {
    const ingredientsListItem = document.createElement("li");
    ingredientsListItem.appendChild(
      document.createTextNode(ingredientsListClean[j]),
    );
    targetElement.appendChild(ingredientsListItem);
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
  const unfilteredCards = document.querySelectorAll(".recipe-outer-container");
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
  const unfilteredCards = document.querySelectorAll(".recipe-outer-container");
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

function loadRecipes() {
  let recipesObject;
  if (
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1" ||
    location.hostname === ""
  ) {
    fetch("../assets/static/local-recipes.json")
      .then((data) => data.json())
      .then((json) => {
        recipesObject = json.data;
        setRecipesHTML(recipesObject.recipesLocal);
      });
  } else {
    fetch("../assets/static/public-recipes.json")
      .then((data) => data.json())
      .then((json) => {
        recipesObject = json.data;
        setRecipesHTML(recipesObject.recipesPublic);
      });
  }
}

function setRecipesHTML(recipesObject) {
  // get container
  const allRecipesContainer = document.getElementById("all-recipes");
  var recipesContentHolder = {};

  for (var i = 0; i < recipesObject.length; i++) {
    // ingest each one, return an object, add to container
    const div = document.createElement("div");
    div.classList.add("col-lg-4", "col-md-6", "recipe-outer-container");
    const divRecCard = document.createElement("div");
    divRecCard.classList.add("recipe-card");
    div.appendChild(divRecCard);

    recipesContentHolder["rec" + i] = transformJSONRecipe(
      recipesObject[i],
      divRecCard,
    );

    allRecipesContainer.appendChild(div);
  }
}

function transformJSONRecipe(obj, div) {
  let res = new Recipe();
  res.title = obj.name;
  res.URL = obj.URL;
  console.log(obj);
  console.log(obj.URL);
  res.tried = obj.tried;
  res.method = obj.method;
  res.ingredients = obj.ingredients;
  res.tags = obj.tags;

  var divTitle = document.createElement("div");
  divTitle.classList.add("d-inline-flex");
  divTitle.innerHTML = `
  <div class="recipe-title">${res.title}</div>
                    <button
                      class="btn btn-outline-primary btn-sm"
                      onclick="showFullCard(this)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-arrows-angle-expand"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707"
                        />
                      </svg>
                    </button>`;

  div.appendChild(divTitle);

  // Ingredients part:
  var divIngredients = document.createElement("div");
  divIngredients.classList.add("recipe-ingredients");
  addHeadingEl(divIngredients, "Ingredients:");
  var ulIngredients = document.createElement("ul");
  constructRecipeIngredients(res.ingredients, ulIngredients);
  divIngredients.appendChild(ulIngredients);

  div.appendChild(divIngredients);

  // Method part:
  var divMethod = document.createElement("div");
  divMethod.classList.add("recipe-method");
  addHeadingEl(divMethod, "Method:");
  var pMethod = document.createElement("p");
  pMethod.innerHTML = res.method;
  divMethod.appendChild(pMethod);

  div.appendChild(divMethod);

  // Tags part:
  var divTags = document.createElement("div");
  divTags.classList.add("recipe-tags");
  addHeadingEl(divTags, "Tags:");
  if (res.tags.length > 0) {
    for (var i = 0; i < res.tags.length; i++) {
      let s = document.createElement("span");
      s.classList.add(res.tags[i]);
      s.innerHTML = tagToTitleCase(res.tags[i]);
      divTags.appendChild(s);
    }
  }

  div.appendChild(divTags);

  // URL part
  // <div class="recipe-link"><h6>URL:</h6><span></span></div>
  var divURL = document.createElement("div");
  divURL.classList.add("recipe-link");
  addHeadingEl(divURL, "URL:");
  var spanURL = document.createElement("span");
  spanURL.textContent = res.URL;
  divURL.appendChild(spanURL);
  
  div.appendChild(divURL);

  // If tried, add class to card
  if (res.tried) {
    div.classList.add("tried");
  }

  return res;
}
