export function generateReferralCode(
  name?: string
) {

  const prefix =
    name
      ? name
          .substring(0, 3)
          .toUpperCase()
      : "TNM";


  const random =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();


  return `${prefix}${random}`;

}