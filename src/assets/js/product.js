export async function fetchProductData(itemPerPage = 12) {
  const res = await fetch(`./api/data/getSpList?itemPerPage=${itemPerPage}`);
  const json = await res.json();
  return json;
}
