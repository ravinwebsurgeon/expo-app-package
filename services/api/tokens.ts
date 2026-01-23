let csrfToken: string | null = null;

export function setCSRFToken(token: string | null) {
  csrfToken = token;
}
export function getCSRFTokenString() {
  return csrfToken;
}
