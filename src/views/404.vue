<template>
  <div style="background:#f0f2f5;margin-top: -20px;height:100%">
    <div class="wscn-http404">
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__info">版权所有<a class='link-type' href='#' target='_blank'>麦迪科技</a></div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">请检查您输入的网址是否正确，请点击以下按钮返回主页或者发送错误报告</div>
        <a href="/" class="bullshit__return-home">返回首页</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      message() {
        return '翁康说这个页面你不能进......'
      }
    }
  }
</script>

<style>
  .wscn-http404 {
    position: relative;
    margin: 20px auto 20px;
    padding: 0 60px;
    overflow: hidden;
  }
  
  .bullshit {
    position: relative;
    float: left;
    width: 300px;
    padding: 100px 0;
    overflow: hidden;
    
  }
  
  .bullshit__oops {
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
    color: #1482f0;
    opacity: 0;
    margin-bottom: 20px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
  }
  
  .bullshit__headline {
    font-size: 20px;
    line-height: 24px;
    color: #1482f0;
    opacity: 0;
    margin-bottom: 10px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.1s;
    animation-fill-mode: forwards;
  }
  
  .bullshit__info {
    font-size: 13px;
    line-height: 21px;
    color: grey;
    opacity: 0;
    margin-bottom: 30px;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.2s;
    animation-fill-mode: forwards;
    .link-type {
      text-decoration: none;
    }
  }
  
  .bullshit_return-home {
    display: block;
    float: left;
    width: 110px;
    height: 36px;
    background: #1482f0;
    border-radius: 100px;
    text-decoration: none;
    text-align: center;
    color: #1482f0;
    opacity: 0;
    font-size: 14px;
    line-height: 36px;
    cursor: pointer;
    animation-name: slideUp;
    animation-duration: 0.5s;
    animation-delay: 0.3s;
    animation-fill-mode: forwards;
  }
  
  @keyframes slideUp {
    0% {
      transform: translateY(60px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>
