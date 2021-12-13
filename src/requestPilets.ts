export default function requestPilets() {
  return fetch('https://feed.piral.cloud/api/v1/pilet/anglesharp').then(res => res.json()).then(res => res.items);
}
