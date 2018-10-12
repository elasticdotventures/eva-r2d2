//
// the r2d2 specification is describe here:
//    https://docs.google.com/document/d/1xXAnLZohOxO95gsVXGz6iqJ2BwpZaj24C0fXgC7HOWM/edit#
//
// basically the r2d2 protocol converts any string, breaks it down into ascii characters,
// splits each 8-bit character into a pair of 4 byte nibbles; and then converts those to
// DTMF tones that can be played over the air or a phone call.
//
// the receiver should decode the tones; and display the message.
//

//
// this is a table of DTMF tones; and frequencies; and the corresponding
// nibbles (4 bit sequence) that r2d2 uses.
//
const dtmfTable = [
	{ digit:"1", f1: 697, f2: 1209, nibble: 0b0000 },
	{ digit:"2", f1: 697, f2: 1336, nibble: 0b0001 },
	{ digit:"3", f1: 697, f2: 1477, nibble: 0b0010 },
	{ digit:"A", f1: 697, f2: 1633, nibble: 0b0011 },
	{ digit:"4", f1: 770, f2: 1209, nibble: 0b0100 },
	{ digit:"5", f1: 770, f2: 1336, nibble: 0b0101 },
	{ digit:"6", f1: 770, f2: 1477, nibble: 0b0110 },
	{ digit:"B", f1: 770, f2: 1633, nibble: 0b0111 },
	{ digit:"7", f1: 852, f2: 1209, nibble: 0b1000 },
	{ digit:"8", f1: 852, f2: 1336, nibble: 0b1001 },
	{ digit:"9", f1: 852, f2: 1477, nibble: 0b1010 },
	{ digit:"C", f1: 852, f2: 1633, nibble: 0b1011 },
	{ digit:"*", f1: 941, f2: 1209, nibble: 0b1100 },
	{ digit:"0", f1: 941, f2: 1336, nibble: 0b1101 },
	{ digit:"#", f1: 941, f2: 1477, nibble: 0b1110 },
	{ digit:"D", f1: 941, f2: 1633, nibble: 0b1111 }
];
// now we restructure the table above so it's easily accessible
let dtmfTableNibbleLookup = {};  // a hash keyed by "nibble" field
let dtmfTableDigitLookup = {};  // a hash keyed by "digit" field
dtmfTable.map((k)=>{
    dtmfTableNibbleLookup[k.nibble] = k;
    dtmfTableDigitLookup[k.digit] = k;
});



//
// converts ascii into a series of dtmf digits (with _ pauses);
//
function encode(chars) {
  let digits = [];
  let i = 0;
  for (i=0; i<chars.length; i++) {
    let ch = chars[i].charCodeAt(0);
    let nibble1 = (ch & 0xF0) >> 4; // first 4 bits
    let nibble2 = (ch & 0x0F);      // last 4 bits
    digits.push(dtmfTableNibbleLookup[nibble1].digit);
    digits.push(dtmfTableNibbleLookup[nibble2].digit);
    digits.push('_');   // pause
  }
  console.log('digits: '+digits);
  return(digits)
}
exports.encode = encode;

//
// converts a series of dtmf digits back into an ascii string;
//  digits is an array of characters  (TODO: why can't i pass in a string? )
//
function decode(digits) {
  // scan the pattern for errors and merge into characters
  var blocks = [];
  var blocki = 0;

  for (let i=0; i<digits.length; i++) {
    var digit = digits[i];
    if (digit == '_') {
      // pause == next digit
      blocki++;
    }
    else {
        if (!blocks[blocki]) { blocks[blocki] = []; }  // initialize array
        blocks[blocki].push( digits[i] );
    }
  }

  // at this point we've got a bunch of blocks;
  // each block should contain an array of two AND ONLY two digits
  // which will decode into nibbles and then push into characters
  var str = '';
  for (let i =0; i<blocks.length; i++) {
    if (blocks[i].length!=2) {
      // invalid block! request a retransmit
      alert('invalid block; throw an error here')  /// TODO: @edvard -- thoughts on best way to do this?
    }
    else {
      var ch = '';
      str = str + String.fromCharCode( (dtmfTableDigitLookup[ blocks[i][0] ].nibble << 4) + dtmfTableDigitLookup[ blocks[i][1] ].nibble );
    }
  }

  return(str);
}
exports.decode = decode;

//
// TODO: @edvard .. this does NOT WORK
// i don't know why. -BH
// txmsg2 if it's referenced causes the module not to be loaded
//   [Show/hide message details.] ReferenceError: exports is not defined
//
//
function r2d2_encode(txmsg2) {
  // var txmsg = String(txmsg2);   // WHY DOES THIS LINE CAUSE .VUE NOT TO RENDER??
  var txmsg = '1234'; // if "txmsg2" is referenced then the APPLICATION CRASHES? DOES NOT RENDER!!;
  let chars = txmsg.split('');

  let txout = [];
  let i = 0;
  for (i=0; i<chars.length; i++) {
    let ch = chars[i].charCodeAt(0);
    let nibble1 = (ch & 0xF0) >> 4; // first 4 bits
    let nibble2 = (ch & 0x0F);      // last 4 bits
    // debug the nibbles..
/*    console.log(ch + ' = '+msg[i]
        +' nibble1: '+nibble1+' f1:'+dtmfTableNibbleLookup[nibble1].f1+'/f2:'+dtmfTableNibbleLookup[nibble1].f2
        +' nibble2: '+nibble2+' f1:'+dtmfTableNibbleLookup[nibble2].f1+'/f2:'+dtmfTableNibbleLookup[nibble2].f2
      );*/

    txout.push([100, dtmfTableNibbleLookup[nibble1].f1, dtmfTableNibbleLookup[nibble1].f2 ]); // play nibble1
    txout.push([100, dtmfTableNibbleLookup[nibble2].f1, dtmfTableNibbleLookup[nibble2].f2 ]); // play nibble2
    txout.push([50, 0, 0]);   // 50ms pause
    }

  // txout is an array of tones
  return(txout);
}
exports.r2d2_encode = r2d2_encode;


//
//  why does uncommenting the line below blow up the vue app?
//
function r2d1_encode(txmsg2){
  var txmsg = String(txmsg2);
  alert('hello');
  // txmsg.toString().split("");
 // let chars = txmsg2.split('');

}
exports.r2d1_encode = r2d1_encode;


//
// plays the encoded digits
//
function play(number) {
  var tone = require('touchtone')({duration:0.1, pause:0});
  var baudio = require('webaudio');

  tone.dial(number);

  baudio(tone.play()).play();
}
exports.play = play;


/////////////////////////////////////////////////////////////////////////////////////////////////
/// everything below this line doesn't work!!


  // Create a new Tone instace. (We've initialised it with
  // frequencies of 350 and 440 but it doesn't really matter
  // what we choose because we will be changing them in the
  // function below)
/*  var tone = require('touchtone')();
  var baudio = require('webaudio');

  var form = document.querySelector('form');
  //form.addEventListener('submit', function (ev) {
  //    ev.preventDefault();
      var number = form.elements.number.value;
      tone.dial(number);
  //});

  baudio(tone.play()).play();
*/
//  encode("asdf")

//  let msg = 'asdf';
//  let pulses = r2d2_encode(msg);
  //pulses.map( function( t_f1f2 ){
     // alert(t_f1f2[0] + ' ' + t_f1f2[1] + ' ' + t_f1f2[2]);
     //dtmf.freq1 = t_f1f2[1];
    // dtmf.freq2 = t_f1f2[2];
  // });

  //   dtmf.start();
  //   sleep(1000)
  //   console.log(t_f1f2)

     // if (dtmf.status == 0){
     // sleep(0.25)
     // sleep(t_f1f2[0]);
     //dtmf.stop();
//  dtmf.stop();


/*$(".js-dtmf-interface li").on("mousedown touchstart", function(e){
	e.preventDefault();

	var keyPressed = $(this).html(); // this gets the number/character that was pressed
	var frequencyPair = dtmfFrequencies[keyPressed]; // this looks up which frequency pair we need

	// this sets the freq1 and freq2 properties
	dtmf.freq1 = frequencyPair.f1;
	dtmf.freq2 = frequencyPair.f2;


});*/
//}

// module.exports.play = play;


// we detect the mouseup event on the window tag as opposed to the li
// tag because otherwise if we release the mouse when not over a button,
/*// the tone will remain playing
$(window).on("mouseup touchend", function(){
	if (typeof dtmf !== "undefined" && dtmf.status){
	  	dtmf.stop();
	}
});*/





/*function send () {
  var txx = 'asdf';
  alert('tx is: '+txx);
  let txmsg = txx.toString();
  let msg = txmsg.split('');

  alert("tx " + tx);
}

module.exports = send;*/

// exports.send = send;
