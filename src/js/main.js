var sideMenuButton = document.getElementById('menu-button');
var body = document.body;
var contentShade = document.getElementById('content-shade');

sideMenuButton.addEventListener("click", function() {
  toggleSideMenu();
});
contentShade.addEventListener("click", function() {
  toggleSideMenu();
});

function toggleSideMenu() {
  toggleClass(body, 'side-menu-open');
}

function hasClass(element, selector) {
  if (!element) return false;

  var className = ' ' + selector + ' ';
  var elemClassName = element.getAttribute('class');

  if ((' ' + elemClassName + ' ').replace(/[\t\r\n\f]/g, ' ').indexOf(className) > -1) {
    return true;
  }
  return false;
}
function addClass(element, className) {
  if (!hasClass(element, className)) {
    element.className += ' ' + className;
  }
}
function removeClass(element, className) {
  if (hasClass(element, className)) {
    var regexp = new RegExp('(\\s|^)' + className + '(\\s|$)');
    element.className = element.className.replace(regexp, '');
  }
}
function toggleClass(element, className) {
  if (hasClass(element, className)) {
    removeClass(element, className);
  } else {
    addClass(element, className);
  }
}
