function divisible(hash, mod) {
  // We will read in 4 hex at a time, but the first chunk might be a bit smaller
  // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
  var val = 0;

  var o = hash.length % 4;
  for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
    val = ((val << 16) + parseInt(hash.substring(i, i + 4), 16)) % mod;
  }

  return val === 0;
}

// This will be the client seed of block 355715
var clientSeed = '00000000000000000582aead0f4e0d43bdd7b7e00d168ee880875dc44d0d078a';

function crashPointFromHash(serverSeed) {
  var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, serverSeed);
  hmac.update(clientSeed);
  var hash = CryptoJS.enc.Hex.stringify(hmac.finalize());

  // In 1 of 67 games the game crashes instantly. // 1,492%
  if (divisible(hash, 67))
    return 0;

  // Use the most significant 52-bit from the hash to calculate the crash point
  var h = parseInt(hash.slice(0, 52 / 4), 16);
  var e = Math.pow(2, 52);

  return Math.floor((100 * e - h) / (e - h));
};

function sha256(string) {
  var hash = CryptoJS.SHA256(string);
  return CryptoJS.enc.Hex.stringify(hash);
}


$(document).ready(function () {

    $('#submit').on('click', function (e) {
        e.preventDefault();
        var hash1 = $('#hash1').val();

        var outcome1 = crashPointFromHash(hash1);
        $('#outcome1').val(outcome1 / 100 + 'x');

        var hash2 = sha256(hash1);
        $('#hash2').val(hash2);

        var outcome2 = crashPointFromHash(hash2);
        $('#outcome2').val(outcome2 / 100 + 'x');
      });


  });