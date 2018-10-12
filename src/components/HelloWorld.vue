<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    R2d2 Transmit:
    <form action="#">
    <textarea v-model="sendmsg" id="tx"></textarea><button  v-on:click="send">transmit</button>
    </form>

    </div>
</template>

<script>

const r2d2 = require("../../lib/eva-r2d2");

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    // sendmsg : String
  },
  data: function(){
    return {
      sendmsg: '123A456B789C*0#D'   // just some sample txt.
    }
  },
  methods: {
    send : function() {
      // i need to take a text string and encode it into dtmf tones
      let chars = this.sendmsg.split('');
      // alert(chars);
      
      var dtmfs = r2d2.encode(chars);
      var out = dtmfs.join('');
      var tx = r2d2.play(out);    // this currently does not support the _ pauses;

      // insert listening and dtmf decoding here.
      var str = r2d2.decode(dtmfs);
      alert('decoded: '+str)
      // var tx = r2d2.play(this.sendmsg);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
