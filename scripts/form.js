"use strict";

const form = document.querySelector(".data-colection");
const inputs = form.querySelectorAll(".form__input, .form__suggest");
const submitButton = form.querySelector('button[type="submit"]');
const formResultTemplate = document.querySelector(
  "#form-result-template",
).content;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const resObj = Array.from(inputs).reduce((resObj, input) => {
    return {
      ...resObj,
      [input.name]: input.value,
    };
  }, {});
  showResult(resObj);
});

inputs.forEach((input) => {
  if (input.hasAttribute("data-maxlength")) {
    input.addEventListener("input", () =>
      validationByLenght(
        input,
        input.getAttribute("data-maxlength"),
        input.getAttribute("data-minlength"),
      )
    );
  }

  input.addEventListener("input", watchForm);
});

function watchForm() {
  let isFormValid = Array.from(inputs).every((input) => {
    if (input.classList.contains("invalid")) {
      return false;
    }
    return input.value != "";
  });

  if (!isFormValid) {
    submitButton.setAttribute("disabled", true);
  } else {
    submitButton.removeAttribute("disabled");
  }
}

// средствами html невозможно валидировать input c типом number по количеству символов, поэтому валидирую элемент через js

function validationByLenght(input, max, min = 0) {
  if (String(input.value).length < min || String(input.value).length > max) {
    input.classList.add("invalid");
  } else {
    input.classList.remove("invalid");
  }
}

function showResult(resObj) {
  const resContainer = formResultTemplate
    .querySelector(".form-result")
    .cloneNode(true);
  const resParagraphs = resContainer.querySelectorAll("p");
  const formSection = document.querySelector(".form-section");
  const lastResult = formSection.querySelector(".form-result");

  if (lastResult) {
    lastResult.remove();
  }

  resParagraphs[0].textContent = `Учреждением ${resObj["organization"]} было закуплено ${resObj["product-name"]} в количестве ${resObj["product-count"]} на сумму ${resObj["contract-amount"]}.`;
  resParagraphs[1].textContent = `Товар поставлен ${resObj["supplier"]} (ИНН: ${resObj["inn"]}) по контракту: ${resObj["contract-number"]}.`;

  formSection.append(resContainer);
}
