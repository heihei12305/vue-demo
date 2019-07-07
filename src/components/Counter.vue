<template>
    <div class = "hello">
        <button @click = "increment">+</button>
        <button @click = "decrement">-</button>
        <span>{{num}}</span>
    </div>
</template>

<script>
export default {
    //name: 'counter',
    props:["num"],
    data(){
        return {
        }
    },
    methods:{
        increment(){
            alert(1);
            this.$emit("incre");
            import('./../util')
        },
        decrement(){
            this.$emit("decre");
        }
    }
}
</script>
