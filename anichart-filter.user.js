// ==UserScript==
// @name         AniChart Filter
// @version      0.8
// @description  Filter AniChart cards based on the color of the highlight
// @author       David Gouveia
// @match        https://anichart.net/*
// @grant        none
// ==/UserScript==

(function() {
  "use strict";

  var list = [];

  function initialize() {
    initializeCss();
    initializeHtml();
    refresh();
  }

  function initializeCss() {
    if (document.getElementById("anichart-filter-css") != null) {
      return;
    }

    let css = document.createElement("style");
    css.id = "anichart-filter-css";
    css.type = "text/css";
    css.innerHTML = `
    .anichart-filter-html {
      display: inline-block;
      height: 25px;
      vertical-align: middle;
    }
    .anichart-filter-checkbox {
      width: 25px;
      height: 25px;
      display: inline-block;
      position: relative;
      cursor: pointer;
      user-select: none;
    }
    .anichart-filter-checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    .anichart-filter-checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 25px;
      width: 25px;
      border-radius: 50%;
    }
    .anichart-filter-checkmark.green { background-color: #2e6017; }
    .anichart-filter-checkmark.yellow { background-color: #7b5f31; }
    .anichart-filter-checkmark.red { background-color: #742e3a; }
    .anichart-filter-checkmark.gray { background-color: #555e66; }
    .anichart-filter-checkbox input:checked ~ .anichart-filter-checkmark.green { background-color: #5DC12F; }
    .anichart-filter-checkbox input:checked ~ .anichart-filter-checkmark.red { background-color: #E85D75; }
    .anichart-filter-checkbox input:checked ~ .anichart-filter-checkmark.yellow { background-color: #F7BF63; }
    .anichart-filter-checkbox input:checked ~ .anichart-filter-checkmark.gray { background-color: #AABCCD; }
    .anichart-filter-checkmark:after {
      content: "";
      position: absolute;
      display: none;
      box-sizing: content-box;
    }
    .anichart-filter-checkbox input:checked ~ .anichart-filter-checkmark:after {
      display: block;
    }
    .anichart-filter-checkbox .anichart-filter-checkmark:after {
      left: 9px;
      top: 6px;
      width: 5px;
      height: 8px;
      border: solid #2B2D42;
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }
    .anichart-filter-card-aired {
      outline: 2px dashed green;
    }`;
    document.body.appendChild(css);
  }

  function initializeHtml() {
    if (document.getElementById("anichart-filter-html") != null) {
      return;
    }

    let filters = document.getElementsByClassName("filters");
    if (filters.length == 0) {
      return;
    }

    var item = document.createElement("div");
    item.id = "anichart-filter-html";
    item.classList.add("anichart-filter-html");
    item.innerHTML = `
    <label class="anichart-filter-checkbox"><input type="checkbox" value="green"><span class="anichart-filter-checkmark green"></span></label>
    <label class="anichart-filter-checkbox"><input type="checkbox" value="yellow"><span class="anichart-filter-checkmark yellow"></span></label>
    <label class="anichart-filter-checkbox"><input type="checkbox" value="red"><span class="anichart-filter-checkmark red"></span></label>
    <label class="anichart-filter-checkbox"><input type="checkbox" value="gray"><span class="anichart-filter-checkmark gray"></span></label>`;
    let parent = filters[0];
    parent.insertBefore(item, parent.children[0]);

    let inputs = item.getElementsByTagName("input");
    for (var i = 0; i < 4; ++i) {
      inputs[i].addEventListener("click", onCheckboxClicked);
    }

    list = [];
  }

  function onCheckboxClicked(event) {
    function arrayRemove(arr, value) {
      return arr.filter(function(ele) {
        return ele != value;
      });
    }
    if (event.srcElement.checked) {
      list.push(event.srcElement.value);
    } else {
      list = arrayRemove(list, event.srcElement.value);
    }
    refresh();
  }

  function refresh() {
    for (let card of document.getElementsByClassName("media-card")) {
      let episode = card.getElementsByClassName("episode")[0];
      if (episode) {
        if (episode.innerHTML.includes("aired")) {
          card.classList.add("anichart-filter-card-aired");
        }
      }
      if (list.length == 0) {
        card.style.display = "";
      } else {
        card.style.display = "none";
        let highlighter = card.getElementsByClassName("highlighter")[0];
        if (highlighter != null) {
          let text = highlighter.style.cssText;
          for (let color of list) {
            if (
              (color == "gray" && !text.includes("--color-")) ||
              text.includes("--color-" + color)
            ) {
              card.style.display = "";
              break;
            }
          }
        }
      }
    }
  }

  document.addEventListener("DOMNodeInserted", initialize, false);
})();
