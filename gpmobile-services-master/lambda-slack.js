/**
 * Created by bhuvanapallisk on 2/29/16.
 */


var natural = require('natural'),
    stemmer = natural.LancasterStemmer;

tokenizer = new natural.WordTokenizer();

ls = ["where does gigi parsa sit", "I want to go home"];
//console.log(natural.LancasterStemmer.tokenizeAndStem(ls));
//console.log(natural.PorterStemmer.tokenizeAndStem(ls));
//console.log(tokenizer.tokenize(ls));


var tm = require('text-miner');

var my_corpus = new tm.Corpus(ls);
ls2 = my_corpus.stem("Porter").removeWords(['does', 'go'])

console.log(ls2);