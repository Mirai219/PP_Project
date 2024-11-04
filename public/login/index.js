// ui
const output = document.querySelector('#output')
const githubLoginLink = document.querySelector('#github-login-link');

// apis
const GITHUB_CLIENT_ID = ''
const GITHUB_AUTHORIZE_URI = 'https://github.com/login/oauth/authorize'
const GITHUB_REDIRECT_URI = 'http://116.62.152.206:9004'

const LOGIN_API = 'http://116.62.152.206:8100/api/v1/login/github'

// utils
class StateUtil {
  static ONE_MINUTE = 60 * 1000

  static #storageKey = 'github_oauth_state'

  static create() {
    const state = Math.random().toString(36).slice(2)
    const expireTime = Date.now() + StateUtil.ONE_MINUTE * 10
    this.#set(state, expireTime)
    return state;
  }

  static verify(state) {
    const storedState = this.#get()
    this.#remove()
    if (!state || !storedState) {
      return false
    }
    if (state !== storedState) {
      return false
    }
    return true
  }

  static #get() {
    try {
      const strings = sessionStorage.getItem(this.#storageKey)
      const { value, expireTime } = JSON.parse(strings)
      if (typeof expireTime === 'number' && expireTime > Date.now()) {
        return value
      }
      return null
    } catch {
      return null
    }
  }

  static #set(value, expireTime) {
    sessionStorage.setItem(
      this.#storageKey,
      JSON.stringify({
        value,
        expireTime,
      })
    )
  }

  static #remove() {
    sessionStorage.removeItem(this.#storageKey)
  }
}

// Add event listener to the login link
githubLoginLink.addEventListener('click', (event) => {
  event.preventDefault();
  redirectToGitHubAuthorize();
});

// Function to get query parameters from URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    code: params.get('code'),
    state: params.get('state'),
  };
}

function createErrorNameElement(errorName) {
  const element = document.createElement('p')
  element.classList.add('error-name')
  element.innerText = errorName
  return element
}

function createErrorDescriptionElement(errorDescription) {
  const element = document.createElement('p')
  element.classList.add('error-description')
  element.innerText = errorDescription
  return element
}

function createErrorURIElement(uri) {
  const element = document.createElement('p')
  element.classList.add('error-uri')

  const link = document.createElement('a')
  link.href = uri
  link.innerText = 'See more information'
  link.target = '_blank'
  element.appendChild(link)

  return element
}

function createLoginLoadingElement() {
  const element = document.createElement('p')
  element.classList.add('login-loading')
  element.innerText = 'Logging in, please waiting ...'
  return element
}

function createLoginErrorElement() {
  const element = document.createElement('p')
  element.classList.add('login-error')
  element.innerText = 'Fail to login'
  return element
}

function transformCase(value) {
  return value
    .replace(/^([a-z])/g, (_, p1) => p1.toUpperCase())
    .replace(/_([a-z])/g, (_, p1) => ' ' + p1.toUpperCase())
}

function post(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => response.json())
}

function resolveOAuthError(error, error_description, error_uri) {
  output.innerHTML = ''
  output.appendChild(createErrorNameElement(transformCase(error)))
  output.appendChild(createErrorDescriptionElement(error_description))
  output.appendChild(createErrorURIElement(error_uri))
}

function resolveOAuth() {
  const searchParams = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    state: StateUtil.create(),
  })
  location.replace(`${GITHUB_AUTHORIZE_URI}?${searchParams}`)
}

function resolveStateError() {
  output.innerHTML = ''
  output.appendChild(createErrorNameElement('State Invalid'))
}

function resolveLogin(code, state) {
  if (!StateUtil.verify(state)) {
    return resolveStateError()
  }

  output.innerHTML = ''
  output.appendChild(createLoginLoadingElement())

  post(LOGIN_API, { code })
    .then(res => {
      console.log('login success', res)
      output.innerHTML = ''
    })
    .catch(error => {
      console.log('login fail', error)
      output.innerHTML = ''
      output.appendChild(createLoginErrorElement())
    })
}

const searchParams = new URLSearchParams(location.search)

const error = searchParams.get('error')
const error_description = searchParams.get('error_description')
const error_uri = searchParams.get('error_uri')
const code = searchParams.get('code')
const state = searchParams.get('state')

if (error) {
  // Resolve Github OAuth error
  resolveOAuthError(error, error_description, error_uri)
} else if (code) {
  // Login
  resolveLogin(code, state)
} else{
  // Resolve Github OAuth
  resolveOAuth()
}