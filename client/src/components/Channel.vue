<template>
  <div>
    Here is channel {{ channel.id}}
    <hr />
  </div>
</template>
<script>
export default {
  props: {
    channel: Object
  },
  name: "Channel"
};
</script>