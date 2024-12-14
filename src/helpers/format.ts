export function formatToPHP(value: string) {
  // Parse the value to a number
  const number = parseFloat(value);

  // Handle cases where parsing fails
  if (isNaN(number)) {
    throw new Error("Invalid number");
  }

  // Use Intl.NumberFormat for PHP currency formatting
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(number);
}
