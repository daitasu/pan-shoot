export const isExactPath = (path: string): boolean => {
  return window.location.pathname === path;
};

export const getParam = (param: string) => {
  const params = window.location.search;

  const regex = new RegExp("[?&]" + param + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(params);

  if (!results) return null;
  if (!results[2]) return "";

  return decodeURIComponent(results[2].replace(/\+/g, " "));
};
