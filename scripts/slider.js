"use strict";

// Темплейт карточки

const templateElementImage = document.querySelector(
  "#card-template-image"
).content;
const templateElementVideo = document.querySelector(
  "#card-template-video"
).content;
const templateElementText = document.querySelector(
  "#card-template-text"
).content;

// Темплейт кнопок пагинации

const templatePaginationButton = document.querySelector(
    '#pagination-button-template'
).content;

// Массив для записи элементов кнопок пагинации

const paginationButtons = createPaginationButtons();

// DOM узлы

const cardContainer = document.querySelector(".card-container");
const sliderPaginationForm = document.querySelector('.slider__pagination form');
const sliderController = document.querySelector(".slider__controller");

// Кнопки переключения

const nextButton = document.querySelector(".slider_button-next");
const prevButton = document.querySelector(".slider_button-prev");

// Элементы для изменения времени интервала

const inputRange = sliderController.querySelector(".controller__range");
const rangeDisplay = sliderController.querySelector(".controller__range-value");
const controllerButton = sliderController.querySelector(".controller__button");

// Индекс текущей и предыдущей карточки

let currentCard = 0;
let prevCard;

// Вызов функции воспроизведения слайдера и запись ссылки на интервал в переменную

let playInterval = playSlider(10000);


// Объявление переменной для последующей записи таймаута удаления карточки

let delTimeout = null;

// Флаг для определения момента воспроизведения анимации

let animationPlays = false;

// Вызов функций добавления карточки и кнопок пагинации

appendCard();
appendPaginationButtons();

// Вызов функции установки пагинации

setPagination();

// Добавление слушателя событий для кнопок

nextButton.addEventListener("click", function () {
  switchByButton("next");
});

prevButton.addEventListener("click", function () {
  switchByButton("prev");
});

Array.from(paginationButtons).forEach((buttonObj, i) => {
  buttonObj.button.addEventListener("click", () => {
    if (currentCard != i) {
      switchByButton("pagination", i);
    }
  });
});

controllerButton.addEventListener("click", () => {
  clearInterval(playInterval);
  playInterval = playSlider(getRangeValue() * 1000);
});

// Добавление слушателя событий для ренджа

inputRange.addEventListener("input", () => {
  rangeDisplay.textContent = getRangeValue() + "s";
});

// Остановка слайдера по наведению мыши

cardContainer.addEventListener("mouseover", () => {
  clearInterval(playInterval);
});

cardContainer.addEventListener("mouseout", () => {
  playInterval = playSlider(getRangeValue() * 1000);
});

// Функция создания карточки

function createCard(cardObject) {
  switch (cardObject.type) {
    case "image":
      return createImageCard(cardObject);
    case "video":
      return createVideoCard(cardObject);
    case "text":
      return createTextCard(cardObject);
  }
}

// Вспомогательная функция создания карточки с изображением

function createImageCard(cardObject) {
  const card = templateElementImage
    .querySelector(".slider__card")
    .cloneNode(true);
  const img = card.querySelector("img");
  const overlay = card.querySelector(".card__overlay");

  setSourceAttributes(card, cardObject.images.avif, "avif");
  setSourceAttributes(card, cardObject.images.webp, "webp");
  img.setAttribute("src", cardObject.images.jpg);
  img.setAttribute("alt", cardObject.title);
  fillText(overlay, cardObject);

  return card;
}

// Вспомогательная функция создания карточки с видео

function createVideoCard(cardObject) {
  const card = templateElementVideo
    .querySelector(".slider__card")
    .cloneNode(true);
  const video = card.querySelector("video");
  const overlay = card.querySelector(".card__overlay");

  video.setAttribute("src", cardObject.video);
  fillText(overlay, cardObject);

  return card;
}

// Функция создания карточки с текстом

function createTextCard(cardObject) {
  const card = templateElementText
    .querySelector(".slider__card")
    .cloneNode(true);

  fillText(card, cardObject);

  return card;
}

// Функция установки атрибутов элемента source

function setSourceAttributes(cardElement, src, type) {
  const source = cardElement.querySelector(`.source-${type}`);

  source.setAttribute("srcset", src);
  source.setAttribute("type", `image/${type}`);
}

// Функция заполнения текста

function fillText(elem, cardObject) {
  const paragraphs = cardObject.paragraphs;

  elem.querySelector("h3").textContent = cardObject.title;

  paragraphs.forEach(function (text) {
    let p = document.createElement("p");

    p.classList.add("card__text");
    p.textContent = text;

    elem.append(p);
  });
}

// Функция удаления карточки

function removeCard() {
  cardContainer.querySelector(".slider__card").remove();
}

// Функция добавления карточки

function appendCard() {
  cardContainer.append(createCard(initialCards[currentCard]));
}

// Функция восспроизведения анимации

function playAnimation() {
  cardContainer.style.animation = "prevCard 500ms 2 alternate";

  paginationButtons.forEach((buttonObj) => {
    buttonObj.button.disabled = true;
  });

  animationPlays = true;
  clearAnimation(1000);
}

// Функция отключения анимации

function clearAnimation(time) {
  setTimeout(function () {
    paginationButtons.forEach((buttonObj) => {
      buttonObj.button.disabled = false;
    });
    cardContainer.style.animation = "none";
    animationPlays = false;
  }, time);
}

// Функция восспроизведения слайдера

function playSlider(time) {
  const interval = setInterval(function () {
    switchCard("next");
  }, time);
  return interval;
}

// Функция переключения по кнопкам

function switchByButton(direction, i = null) {
  if (!animationPlays) {
    clearInterval(playInterval);
    switchCard(direction, i);
    playInterval = playSlider(getRangeValue() * 1000);
  }
}

// Функция переключения карточки

function switchCard(direction, i) {
  if (delTimeout) {
    clearTimeout(delTimeout);
  }
  playAnimation();
  delTimeout = setTimeout(function () {
    switchIndex(direction, i);
    setPagination();
    removeCard();
    appendCard();
  }, 500);
}

// Функция переключения индекса

function switchIndex(direction, i) {
  const directObj = {
    next: currentCard < initialCards.length - 1 ? currentCard + 1 : 0,
    prev: currentCard > 0 ? currentCard - 1 : initialCards.length - 1,
    pagination: i,
  };

  prevCard = currentCard;
  currentCard = directObj[direction];

  if (direction !== "pagination") {
    paginationButtons[currentCard].button.checked = true;
    if (prevCard !== null) {
      paginationButtons[prevCard].button.removeAttribute("checked");
    }
  }
}

// Функция получения значения, выбранного в рендже

function getRangeValue() {
  return inputRange.value;
}

// Функция создания кнопок пагинации

function createPaginationButtons () {
    const buttonsArr = [];

    initialCards.forEach(() => {
        const label = templatePaginationButton.querySelector('.pagination__label').cloneNode(true);
        buttonsArr.push({
            label: label,
            button: label.querySelector('.pagination__button')
        });
    });

    return buttonsArr;
}

// Функция добавления кнопок пагинации

function appendPaginationButtons () {
    paginationButtons.forEach((buttonObj) => {
        sliderPaginationForm.append(buttonObj.label);
    });
}

// Функция установки пагинации

function setPagination () {
    paginationButtons[currentCard].button.checked = true;
}