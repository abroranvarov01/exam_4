export const setLocal = (data, name) => {
  const res = JSON.stringify(data);
  localStorage.setItem(name, res);
};

export const getLocal = (name) => {
  const data = localStorage.getItem(name);
  return data ? JSON.parse(data) : null;
};
