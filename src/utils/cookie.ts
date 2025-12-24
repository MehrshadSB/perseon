export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(";").shift() || null;
  }
  return null;
}

export function setCookie(
  name: string,
  value: string,
  options: string = "path=/; Secure; SameSite=Strict",
) {
  document.cookie = `${name}=${value}; ${options}`;
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
