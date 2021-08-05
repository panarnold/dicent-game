<template>
  <div id="nav">
    <router-link to="/">Gra</router-link> |
    <router-link to="/about">Instrukcja</router-link>
  </div>

  <keep-alive>
    <router-view> </router-view>
  </keep-alive>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
