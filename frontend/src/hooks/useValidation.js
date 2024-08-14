const useValidation = (title, description) => {
  const errors = [];
  if (!title.trim()) errors.push('Título não pode ser nulo!');
  if (!description.trim()) errors.push('Descrição não pode ser nulo!');
  return errors;
};

export default useValidation;
