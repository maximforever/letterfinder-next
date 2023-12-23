export const sampleText = `The Hitch Hiker's Guide to the Galaxy has a few things to say on the subject of towels.
A towel, it says, is about the most massively useful thing an interstellar hitch hiker can have.
More importantly, a towel has immense psychological value.
 For some reason, if a strag discovers that a hitch hiker has his towel with him, he will automatically assume that he is also in possession of a toothbrush, face flannel, soap, tin of biscuits, flask, compass, map, ball of string, gnat spray, wet weather gear, space suit etc., etc.
Furthermore, the strag will then happily lend the hitch hiker any of these or a dozen other items that the hitch hiker might accidentally have "lost".
What the strag will think is that any man who can hitch the length and breadth of the galaxy, rough it, slum it, struggle against terrible odds, win through, and still knows where his towel is is clearly a man to be reckoned with.
Uncomprehending terror settled on the watching people of Earth.
The terror moved slowly through the gathered crowds as if they were iron fillings on a sheet of board and a magnet was moving beneath them.
Panic sprouted again, desperate fleeing panic, but there was nowhere to flee to.
He was pointing as well as he could manage, and he obviously wanted to make it totally clear that this was as well as he could manage, through the mist, over the reeds, to a part of the marsh which looked exactly the same as every other part of the marsh.
There was an immensely cold and savage silence.
 The robots regarded him with hideously dead eyes.
They stood very still.
There was something intensely macabre about their appearance, especially to Zaphod who had never seen one before or even known anything about them.
When Tom awoke, Sid was dressed and gone.
There was a late look in the light, a late sense in the atmosphere.
He was startled.
Why had he not been called—persecuted till he was up, as usual? The thought filled him with bodings.
Within five minutes he was dressed and down-stairs, feeling sore and drowsy.
The family were still at table, but they had finished breakfast.
There was no voice of rebuke; but there were averted eyes; there was a silence and an air of solemnity that struck a chill to the culprit’s heart.
He sat down and tried to seem gay, but it was up-hill work; it roused no smile, no response, and he lapsed into silence and let his heart sink down to the depths.
After breakfast his aunt took him aside, and Tom almost brightened in the hope that he was going to be flogged; but it was not so.
His aunt wept over him and asked him how he could go and break her old heart so; and finally told him to go on, and ruin himself and bring her gray hairs with sorrow to the grave, for it was no use for her to try any more.
This was worse than a thousand whippings, and Tom’s heart was sorer now than his body.
He cried, he pleaded for forgiveness, promised to reform over and over again, and then received his dismissal, feeling that he had won but an imperfect forgiveness and established but a feeble confidence.`;

export function getSampleSentence() {
  console.log("IN GET SAMPLE SENTENCE");
  const sentences = sampleText
    .replace(/\n/, "")
    .replace(/\s+/g, " ")
    .split(".");
  const sentence =
    sentences[Math.floor(Math.random() * sentences.length)].trim() + ".";
  console.log("SENTENCE", sentence);
  return sentence.trim().toLowerCase();
}
