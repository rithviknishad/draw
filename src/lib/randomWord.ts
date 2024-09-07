export default async function getRandomWords(words = 3) {
  const res = await fetch(
    `https://random-word-api.herokuapp.com/word?number=${words}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    return;
  }

  return (await res.json()) as string[];
}
