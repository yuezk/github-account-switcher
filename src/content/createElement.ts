type Child = Node | string

export function createElement(
  tagName: string,
  attributes: Record<string, string> | { ns?: string; children?: Child | Child[] },
) {
  if (tagName === 'fragment') {
    const fragment = document.createDocumentFragment()
    appendChildren(fragment, attributes.children)
    return fragment
  }

  const { children, ns, ...rest } = attributes
  const el = ns ? document.createElementNS(ns, tagName) : document.createElement(tagName)
  for (const [key, value] of Object.entries(rest)) {
    el.setAttribute(key, value)
  }

  appendChildren(el, children)
  return el
}

function appendChildren(parent: Node, children: Child | Child[] = []) {
  const childrenArray = Array.isArray(children) ? children : [children]
  for (const child of childrenArray) {
    if (typeof child === 'string') {
      parent.appendChild(document.createTextNode(child))
    } else {
      parent.appendChild(child)
    }
  }
}

export function createRemoveIcon() {
  return createElement('svg', {
    ns: 'http://www.w3.org/2000/svg',
    'aria-hidden': 'true',
    viewBox: '0 0 16 16',
    height: '16',
    width: '16',
    version: '1.1',
    'data-view-component': 'true',
    class: 'octicon octicon-trash',
    children: createElement('path', {
      ns: 'http://www.w3.org/2000/svg',
      d: 'M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z',
    }),
  })
}
