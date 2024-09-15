export const formatRupiah = (amount) => {
  if (!amount) return "";
  const numberString = amount.replace(/[^,\d]/g, "").toString();
  const split = numberString.split(",");
  const remnant = split[0].length % 3;
  let rupiah = split[0].substr(0, remnant);
  const thousand = split[0].substr(remnant).match(/\d{3}/gi);

  if (thousand) {
    const separator = remnant ? "." : "";
    rupiah += separator + thousand.join(".");
  }

  return split[1] !== undefined ? `Rp ${rupiah},${split[1]}` : `Rp ${rupiah}`;
};

export const showFormatRupiah = (amount) => {
  if (!amount) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    minimumFractionDigits: 0,
    currency: "IDR",
  }).format(amount);
};
