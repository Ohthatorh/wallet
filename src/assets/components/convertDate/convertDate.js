export const convertDate = (date) => {
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const newDate = new Date(date)
  return newDate.toLocaleString('ru', options)
}
