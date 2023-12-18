import { setegid } from "process";

export const sampleText = `The Hitch Hiker's Guide to the Galaxy has a few things to say on
the subject of towels. A towel, it says, is about the most  massively  useful  thing  an
interstellar  hitch hiker can have. More importantly, a towel has immense  psychological  value.  For
some reason, if a strag (strag: non-hitch hiker) discovers that a
hitch hiker has his towel with him, he will automatically  assume
that  he  is  also  in  possession of a toothbrush, face flannel,
soap, tin of biscuits, flask, compass, map, ball of string,  gnat
spray,  wet  weather gear, space suit etc., etc. Furthermore, the
strag will then happily lend the hitch hiker any of  these  or  a
dozen  other  items  that the hitch hiker might accidentally have
"lost". What the strag will think is that any man who  can  hitch
the length and breadth of the galaxy, rough it, slum it, struggle
against terrible odds, win through, and  still  knows  where  his
towel is is clearly a man to be reckoned with.
Uncomprehending terror settled on the watching people  of  Earth.
The  terror  moved  slowly through the gathered crowds as if they
were iron fillings on a sheet of board and a  magnet  was  moving
beneath  them. Panic sprouted again, desperate fleeing panic, but
there was nowhere to flee to.
He was pointing as well as he  could  manage,  and  he  obviously
wanted to make it totally clear that this was as well as he could
manage, through the mist, over the reeds, to a part of the  marsh
which looked exactly the same as every other part of the marsh.
There was an  immensely  cold  and  savage  silence.  The  robots
regarded  him  with  hideously  dead eyes. They stood very still.
There was something intensely  macabre  about  their  appearance,
especially  to Zaphod who had never seen one before or even known
anything about them. The Krikkit Wars  belonged  to  the  ancient
past  of  the  Galaxy,  and  Zaphod  had  spent most of his early
history lessons plotting how he was going to have  sex  with  the
girl  in  the  cybercubicle  next  to him, and since his teaching
computer had been an integral part of this plot it had eventually
had  all its history circuits wiped and replaced with an entirely
different set of ideas  which  had  then  resulted  in  it  being
scrapped  and sent to a home for Degenerate Cybermats, whither it
was followed by the girl who had inadvertently fallen  deeply  in
love  with  the  unfortunate  machine,  with  the result (a) that
Zaphod never got near her and (b) that he missed out on a  period
of  ancient  history that would have been of inestimable value to
him at this moment.`;

export function getSampleSentence() {
  const sentences = sampleText
    .replace(/\n/, "")
    .replace(/\s+/g, " ")
    .split(".");
  return sentences[Math.floor(Math.random() * sentences.length)].trim() + ".";
}
