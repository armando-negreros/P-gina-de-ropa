export function validate(username, password) {
  if (typeof username !== 'string' || !/^[A-Za-z][A-Za-z0-9._]{2,23}$/.test(username)) return 'El usuario debe comenzar con una letra y tener entre 3 y 24 caracteres: letras, números, punto o guion bajo.';
  if (typeof password !== 'string' || password.length < 8 || password.length > 72 || /\s/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9\s]/.test(password)) return 'La contraseña debe tener de 8 a 72 caracteres, mayúscula, minúscula, número y símbolo, sin espacios.';
  return null;
}
