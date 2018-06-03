'use strict';
// **GLOBAL BINDINGS ** //
const nodes = {
  name: fetchNode('#name'),
  email: fetchNode('#mail'),
  title: fetchNode('#title'),
  othertitle: fetchNode('#other-title'),
  activities: fetchNode('.activities'),
  design: fetchNode('#design'),
  tshirts: fetchNode('[name="all"]'),
  jsframeworks: fetchNode('[name="js-frameworks"]'),
  express: fetchNode('[name="express"]'),
  jslibs: fetchNode('[name="js-libs"]'),
  node: fetchNode('[name="node"]'),
  buildtools: fetchNode('[name="build-tools"]'),
  npm: fetchNode('[name="npm"]'),
  payment: fetchNode('#payment'),
  cc: fetchNode('#credit-card'),
  ccnum: fetchNode('#cc-num'),
  zip: fetchNode('#zip'),
  cvv: fetchNode('#cvv'),
  register: fetchNode('[type="submit"]')
}
const regX = {
  email: /.+@.+\..+/,
  name: /\w \w/,
  cc: /\d{4}-\d{4}-\d{4}-\d{1,4}/,
  zip: /\d{5}/,
  cvv: /\d{3}$/
}
// **INITIALIZE** //
window.onload = () => {
  nodes.name.focus();
  // make name and email fields required
  required(nodes.name);
  nodes.name.placeholder = "First and last name";
  required(nodes.email);
  nodes.email.placeholder = "Email address"
  // generate total cost node
  nodes.activities.insertAdjacentHTML('beforeend', '<h3 id="total-cost"></h3>');
  nodes.totalcost = fetchNode('#total-cost');
  // hide innactive nodes
  forEach(hideNode, fetchNodes('div > p'));
  hideNode(nodes.othertitle);
  hideNode(nodes.cc);
  hideNode(fetchNode('#colors-js-puns'));
}
// **EVENT LISTENERS** //
nodes.title.addEventListener('change', event => {
  event.target.value == 'other' ?
    showNode(nodes.othertitle) :
    hideNode(nodes.othertitle);
});
// design selection only permits matching colors
nodes.design.addEventListener('change', event => {
  if(event.target.value == "js puns" || event.target.value == "heart js") {
    showNode(fetchNode('#colors-js-puns'));
    forEach(hideNode, fetchNodes('#color > option'));
    event.target.value == 'js puns' ?
      forEach(showNode, fetchNodes('#color > option:nth-child(-n+3)')) :
      forEach(showNode, fetchNodes('#color > option:nth-child(n+4)'));
  } else hideNode(fetchNode('#colors-js-puns'));
});
// disables conflicting activities
// generates totalcost
nodes.activities.addEventListener('change', event => {
  let cost = 0;
  if(nodes.tshirts.checked) {
    cost += 200;
  }
  if(nodes.jsframeworks.checked) {
    disable(nodes.express);
    cost += 100;
  } else enable(nodes.express);
  if(nodes.jslibs.checked) {
    disable(nodes.node);
    cost += 100;
  } else enable(nodes.node);
  if(nodes.express.checked) {
    disable(nodes.jsframeworks);
    cost += 100;
  } else enable(nodes.jsframeworks);
  if(nodes.node.checked) {
    disable(nodes.jslibs);
    cost += 100;
  } else enable(nodes.jslibs);
  if(nodes.buildtools.checked) {
    cost += 100;
  }
  if(nodes.npm.checked) {
    cost += 100;
  }
  if(cost > 0) {
    nodes.totalcost.innerHTML = `$ ${cost}`;
    nodes.totalcost.style.color = '#184f68'
  } else {
    nodes.totalcost.innerHTML = 'Activity selection required';
    nodes.totalcost.style.color = 'red';
  }
});
// shows applicable payment info / fields
nodes.payment.addEventListener('change', event => {
  forEach(hideNode, fetchNodes('div > p'));
  if(event.target.value == 'credit card') {
    showNode(nodes.cc);
    required(nodes.ccnum);
    required(nodes.zip);
    required(nodes.cvv);
  } else {
    hideNode(nodes.cc);
    notRequired(nodes.ccnum);
    notRequired(nodes.zip);
    notRequired(nodes.cvv);
  }
  if(event.target.value == 'paypal') {
    showNode(fetchNode('div > p:first-child'));
  }
  if(event.target.value == 'bitcoin') {
    showNode(fetchNode('div:last-child > p:last-child'));
  }
  if(event.target.value == 'select_method') {
    nodes.payment.style.border = '1px solid red';
  } else nodes.payment.style.border = 'none';
});
// on form submit validates user input
fetchNode('[type="submit"]').addEventListener('click', event => {
  if(nodes.payment.value == 'credit card'){
    nodes.ccnum.value ?
      check(nodes.ccnum, regX.cc, "Enter valid card number") :
      nodes.ccnum.placeholder = "Required field";
    nodes.zip.value ?
      check(nodes.zip, regX.zip, "5 digit zipcode") :
      nodes.zip.placeholder = "Required field";
    nodes.cvv.value ?
      check(nodes.cvv, regX.cvv, "3 digit CVV") :
      nodes.cvv.placeholder = "Required field";
  }
  nodes.email.value ?
    check(nodes.email, regX.email, "Enter valid email") :
    nodes.email.placeholder = "Required field";
  nodes.name.value ?
    check(nodes.name, regX.name, "Enter full name") :
    nodes.name.placeholder = "Required field";

    if(nodes.payment.value == 'select_method') {
      nodes.payment.style.border = '1px solid red';
      event.preventDefault;
    } else nodes.payment.style.border = 'none';

    if(!fetchNode('input:checked')){
      nodes.totalcost.innerHTML = 'Activity selection required';
      nodes.totalcost.style.color = 'red';
      event.preventDefault();
    }
});

// **FUNCTIONS** //
// validates form input
function check (node, pattern, msg) {
    pattern.test(node.value) ?
      true :
      notValid(node, msg);
}
// handles invalid form entry
function notValid (node, msg) {
  node.value = "";
  node.placeholder = msg;
}
// calls fn on each item of arr
function forEach (fn, arr) {
  for(let e of arr){ fn(e); }
}
// wraps querySelector/All in fetchNode(..) and fetchNodes(..)
function fetchNode (selector) {
  return document.querySelector(selector);
}
function fetchNodes (selector) {
  return document.querySelectorAll(selector);
}
// show / hide node with showNode(..) and hideNode(..)
function showNode (node) {
  !node.style.display || (node.style.display = '');
}
function hideNode (node) {
  node.style.display || (node.style.display = 'none');
}
// disable / enable node
function disable (node) {
  node.disabled = true;
}
function enable (node) {
  node.disabled = false;
}
// make node required / not-required
function required (node) {
  node.required = true;
}
function notRequired (node) {
  node.required = false;
}
