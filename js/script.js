'use strict';
//** GLOBAL BINDINGS **//
const nodes = {
  name: {
    node: fetchNode('#name'),
    check: '^([a-zA-Z]{1,} )([a-zA-Z]{1,} ?){1,}$',
    msg: 'Full name required',
  },
  email: {
    node: fetchNode('#mail'),
    check: '^[^ ]+@[^ ]+\.[^ ]+$',
    msg: 'Enter valid email address',
  },
  title: { node: fetchNode('#title'), },
  othertitle: {
    node: fetchNode('#other-title'),
    check: '^([a-zA-Z] ?){1,}$',
    msg: 'Enter your job title',
  },
  ccnum: {
    node: fetchNode('#cc-num'),
    required: (fetchNode('#payment').value == 'credit card'),
    check: '^[0-9]{4}-?[0-9]{4}-?[0-9]{4}-?[0-9]{1,4}$',
    msg: 'Enter valid card number',
  },
  zip: {
    node: fetchNode('#zip'),
    check: '^[0-9]{5}$',
    msg: 'Enter valid 5 digit zipcode',
  },
  cvv: {
    node: fetchNode('#cvv'),
    check: '^[0-9]{3}$',
    msg: '3 digit CVV',
  },
  design: { node: fetchNode('#design'), },
  activities: { node: fetchNode('.activities'), },
  tshirts: { node: fetchNode('[name="all"]'), },
  shirtcolors: { node: fetchNode('#colors-js-puns'), },
  color: { node: fetchNode('#color') },
  jsframeworks: { node: fetchNode('[name="js-frameworks"]'), },
  express: { node: fetchNode('[name="express"]'), },
  jslibs: { node: fetchNode('[name="js-libs"]'), },
  node: { node: fetchNode('[name="node"]'), },
  buildtools: { node: fetchNode('[name="build-tools"]'), },
  npm: { node: fetchNode('[name="npm"]'), },
  totalcost: {},
  payment: { node: fetchNode('#payment'), },
  cc: { node: fetchNode('#credit-card'), },
  register: { node: fetchNode('[type="submit"]'), },
}
//** INITIALIZE **//
window.onload = () => {
  const {name, email, activities, othertitle, shirtcolors, payment, design} = nodes;
  name.node.focus();
  name.node.placeholder = "First and last name";
  email.node.placeholder = "Email address";
  // CREATE TOTAL COST NODE
  activities.node.insertAdjacentHTML('beforeend', '<h3 id="total-cost"></h3>');
  nodes.totalcost.node = fetchNode('#total-cost');
  // SET INITIAL FORM STATE
  forEach(hideNode, fetchNodes('div > p'));
  forEach(hideNode, fetchNodes('#color > option'))
  hideNode(othertitle.node);
  hideNode(shirtcolors.node);
  hideNode(fetchNode('#payment > option'));
  payment.node.value = 'credit card';
  // MAKE NAME / EMAIL FIELDS REQUIRED
  required(createAttribute(name.node, 'pattern', name.check));
  required(createAttribute(email.node, 'pattern', email.check));
}
//** EVENT LISTENERS **//
fetchNode('.container').addEventListener('change', event => {
  const {name, email, title, othertitle, design, shirtcolors, color, payment, cc, ccnum, zip, cvv} = nodes;
  // VERIFY NAME / EMAIL FIELDS
  (name.node.value && check(name));
  (email.node.value && check(email));
  // SHOW/HIDE OTHER JOB INPUT AND VERIFY OTHER JOB
  title.node.value == 'other' ?
    (
      required(createAttribute(showNode(othertitle.node), 'pattern', othertitle.check)),
      (othertitle.node.value && check(othertitle))
    ) : (
      notRequired(deleteAttribute(hideNode(othertitle.node), 'pattern')),
      othertitle.node.setCustomValidity('')
    ) ;
  // SHOW SHIRT COLORS FOR CORRESPONDING DESIGN
  if(design.node.value == "js puns" || design.node.value == "heart js") {
    showNode(shirtcolors.node);
    forEach(hideNode, fetchNodes('#color > option'));
    event.target.value == 'js puns' ?
      (
        forEach(showNode, fetchNodes('#color > option:nth-child(-n+3)')),
        color.node.value = "cornflowerblue"
      ) : (
        forEach(showNode, fetchNodes('#color > option:nth-child(n+4)')),
        color.node.value = "tomato"
      ) ;
  } else hideNode(shirtcolors.node);
  // SHOW/HIDE PAYMENT INFO / VERIFY INPUT
  payment.node.value == 'credit card' ?
    (
      showNode(cc.node),
      required(createAttribute(ccnum.node, 'pattern', ccnum.check)),
      required(createAttribute(zip.node, 'pattern', zip.check)),
      required(createAttribute(cvv.node, 'pattern', cvv.check)),
      (ccnum.node.value && check(ccnum)),
      (zip.node.value && check(zip)),
      (cvv.node.value && check(cvv))
    ) : (
      hideNode(cc.node),
      notRequired(deleteAttribute(ccnum.node, 'pattern')),
      notRequired(deleteAttribute(zip.node, 'pattern')),
      notRequired(deleteAttribute(cvv.node, 'pattern')),
      ccnum.node.setCustomValidity(''),
      zip.node.setCustomValidity(''),
      cvv.node.setCustomValidity('')
    ) ;
  payment.node.value == "paypal" ?
    showNode(fetchNode('div > p:first-child')) :
    hideNode(fetchNode('div > p:first-child'));
  payment.node.value == "bitcoin" ?
    showNode(fetchNode('div:last-child > p:last-child')) :
    hideNode(fetchNode('div:last-child > p:last-child'));
});
// MANAGE ACTIVITIES / DISABLE CONFLICTING / SHOW TOTAL
nodes.activities.node.addEventListener('change', event => {
  const {tshirts, jsframeworks, express, jslibs, node, buildtools, npm, totalcost} = nodes;
  let cost = 0;
  tshirts.node.checked ? cost += 200 : cost += 0;
  jsframeworks.node.checked ?
    (disable(express.node), cost += 100) :
    enable(express.node);
  jslibs.node.checked ?
    (disable(node.node), cost += 100) :
    enable(node.node);
  express.node.checked ?
    (disable(jsframeworks.node), cost += 100) :
    enable(jsframeworks.node);
  node.node.checked ?
    (disable(jslibs.node), cost += 100) :
    enable(jslibs.node);
  buildtools.node.checked ? cost += 100 : cost += 0;
  npm.node.checked ? cost += 100 : cost += 0;
  cost > 0 ? (
    totalcost.node.innerHTML = `$ ${cost}`,
    totalcost.node.style.color = '#184f68'
  ) : (
    totalcost.node.innerHTML = 'Activity selection required',
    totalcost.node.style.color = 'red'
  )  ;
});
// VERIFY ACTIVITY SELECTED / TSHIRT DESIGN SELECTED BEFORE SUBMIT
fetchNode('[type="submit"').addEventListener('click', event => {
  const {totalcost, activities, design} = nodes;
  if(!fetchNode('input:checked')){
    totalcost.node.innerHTML = 'Activity selection required';
    totalcost.node.style.color = 'red';
    event.preventDefault();
  }
  design.node.value == 'Select Theme' ? (
    event.preventDefault(),
    design.node.focus(),
    design.node.setCustomValidity('Choose a shirt design')
  ) : design.node.setCustomValidity('');
});
//** FUNCTIONS **//
// validates form input
function check (element) {
  const {node, check, msg} = element;
  const RE = new RegExp(check);
  node.setCustomValidity('');
  if(RE.test(node.value)) {
    node.setCustomValidity('');
  } else {
    node.setCustomValidity(msg);
  }
}
// create / delete attributes
function createAttribute (node, att, value) {
  node.setAttribute(att, value);
  return node;
}
function deleteAttribute (node, att) {
  node.removeAttribute(att);
  return node;
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
  return node;
}
function hideNode (node) {
  node.style.display || (node.style.display = 'none');
  return node;
}
// enable / disable nodes
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
