
export const useAuth = () => {
  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');
  return { token, role };
};
