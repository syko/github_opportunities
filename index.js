/**
 * Create a debounced function of fn that only runs after `delay` milliseconds have elapsed since the last call of the debounced function.
 *
 * @param      {Function}  fn      The function
 * @param      {int}  fn      The delay after which to execute fn. Default 10
 * @return     {Functionn}    The debounced function
 */
const debounce = (fn, delay = 10) => {
  let timeout = 0
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(fn, delay)
  }
}

/**
 * Detects if the given string contains something to replace.
 *
 * @param      {string}  str     The string
 * @return     {boolean}  true if replacements are needed
 */
const detectIssue = (str) => {
  return str.includes('Issue') || str.includes('issue')
}

/**
 * Replace all occurrences of 'issue' with 'opportunity' in the given string.
 * Supports plural forms.
 * Supports both capitalised and lower-case forms.
 * Does not support weird cases likes `isSUe` because why?
 *
 * @param      {string}  str     the target string
 * @return     {string}  the string with all occurencess replaced
 */
const replaceIssue = (str) => {
  return str
    .replace('Issues', 'Opportunities')
    .replace('issues', 'opportunities')
    .replace('Issue', 'Opportunity')
    .replace('issue', 'opportunity')
}

/**
 * Replace 'issue' with 'opportunity' in the text content of the given html node
 *
 * @param      {HTMLNode}  el      the node
 */
const replaceContent = (el) => {
  const v = el.nodeValue
  if(detectIssue(v)) el.nodeValue = replaceIssue(v)
}

/**
 * Replace 'issue' with 'opportunity' in the `data-content` attribute of the given html node.
 * Because github likes to use that along with some css to replace text content.
 *
 * @param      {HTMLNode}  el      the node
 */
const replaceDataProperty = (el) => {
  if (!el.hasAttribute('data-content')) return
  const v = el.getAttribute('data-content')
  if(detectIssue(v)) el.setAttribute('data-content', replaceIssue(v))
}

/**
 * Replace 'issue' with 'opportunity' in all html nodes in the array or NodeList.
 * Does not touch textarea contents and contenteditable elements.
 */
const run = () => {
  document.querySelectorAll("title, body, body *").forEach((el) => {
    if(el.nodeName == 'TEXTAREA' || el.getAttribute('contenteditable')) return
    replaceDataProperty(el)
    el.childNodes.forEach((child) => {
      if(child.nodeType == document.TEXT_NODE) replaceContent(child)
    })
  })
}

// Initial run

run()

/*
 * Set up a mutation observer to re-run in case of DOM changes
 * It re-runs the replacement on the whole document with debouncing
 * since using the mutation target is finicky and almost all of page changes many times anyway during navigation
 * so a single debounced call is probably more efficient than responding to each mutation individually.
*/

const observer = new MutationObserver(debounce(run))
observer.observe(document.body, {
  subtree: true,
  childList: true
})