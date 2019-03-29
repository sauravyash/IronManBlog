"use strict";

/*
 * This function check if an element has a particular class
 *
 * @param  DOM Element  el         the selected element to check
 * @param  Text         className  the class to find
 *
 * @return Boolean      States whether a class is existant within an element
 */
function hasClass(el, className) {
  if (el.classList) return el.classList.contains(className);else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}
/*
 * This function adds the class 'className' to an element 'el' if it
 * doesn't already contain the specified class
 *
 * @param  DOM Element  el         the selected element to change
 * @param  Text         className  the class to add
 */


function addClass(el, className) {
  if (el.classList) el.classList.add(className);else if (!hasClass(el, className)) el.className += " " + className;
}
/*
 * This function removes the class 'className' to an element 'el' if it
 * doesn't already contain the specified class
 *
 * @param  DOM Element  el         the selected element to change
 * @param  Text         className  the class to remove
 */


function removeClass(el, className) {
  if (el.classList) el.classList.remove(className);else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
    el.className = el.className.replace(reg, ' ');
  }
}

function postData(url = ``, data = {}) {
  // Default options are marked with *
  return fetch(url, {
    method: "POST",
    // *GET, POST, PUT, DELETE, etc.
    mode: "cors",
    // no-cors, cors, *same-origin
    cache: "no-cache",
    // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin",
    // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow",
    // manual, *follow, error
    referrer: "no-referrer",
    // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header

  }).then(response => response.json()); // parses JSON response into native Javascript objects
} // hamburger menu all


document.addEventListener('DOMContentLoaded', () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0); // Check if there are any navbar burgers

  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target); // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"

        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  }
});

const notification = (type, msg) => {
  let div = document.createElement("div");
  let button = document.createElement("button");
  button.className += "delete";
  let txt = document.createTextNode(msg);
  div.className += "alert notification ";
  div.className += `is-${type}`;
  div.appendChild(txt);
  div.appendChild(button);
  document.querySelector(".alerts").appendChild(div);
  div.firstElementChild.addEventListener('click', () => {
    div.parentNode.removeChild(div);
  });
};

let submitButton = document.querySelector("#feedback-submit-button");

if (submitButton) {
  submitButton.addEventListener("click", e => {
    e.preventDefault();
    removeClass(submitButton, "is-info");
    addClass(submitButton, "is-warning");
    addClass(submitButton, "is-loading");
    onFeedbackSubmit().catch(e => {
      notification("danger", `Error: There was a problem when submitting the form. (ERR: ${e})`);
      formFailure();
    });
  });
}

const validData = () => {
  let validity = true;
  document.querySelectorAll("#feedback_form input, #feedback_form textarea").forEach(el => {
    if (el.checkValidity()) {
      addClass(el, "is-success");
      removeClass(el, "is-danger");
    } else {
      validity = false;
      addClass(el, "is-danger");
      removeClass(el, "is-success");
    }
  });
  return validity;
};

const onFeedbackSubmit = () => new Promise((resolve, reject) => {
  if (!validData()) {
    return reject("Invalid Data Entered");
  }

  let formData = {
    name: document.querySelector(`#feedback_form input[name="name"]`).value,
    title: document.querySelector(`#feedback_form input[name="title"]`).value,
    msg: document.querySelector("#feedback_form textarea").value,
    date: new Date()
  };
  postData(`/feedback`, formData).then(data => {
    if (data.success === "true") {
      formSuccess();
      resolve();
    } else {
      throw data.error;
    }
  }) // JSON-string from `response.json()` call
  .catch(err => {
    formFailure();
    reject(err);
  });
});

const formSuccess = () => {
  removeClass(submitButton, "is-loading");
  removeClass(submitButton, "is-warning");
  addClass(submitButton, "is-success");
  submitButton.value = "Success";
  localStorage.setItem("submitted", "true");
};

const formFailure = () => {
  removeClass(submitButton, "is-warning");
  removeClass(submitButton, "is-loading");
  addClass(submitButton, "is-danger");
  submitButton.value = "Error";
  setInterval(() => {
    removeClass(submitButton, "is-danger");
    addClass(submitButton, "is-info");
  }, 3000);
};

if (localStorage.getItem("submitted") == true) {
  submitButton.disabled = true;
}