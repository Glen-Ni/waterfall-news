## 瀑布流新浪新闻页
> 使用jQuery，使用新浪新闻API实现懒加载和瀑布流

[预览地址](https://glen-ni.github.io/waterfall-news/)

### 懒加载
- 原理
  * 在所有item的后面添加一个看不到的div.load，当滚动时判断这个div是否出现在窗口视野内。
  * 当div.load出现在视野内时发送ajax请求，传入回调，拼接HTML字符串加入到容器

### 瀑布流
- 原理
  + 第一次获取到item时，根据当前窗口宽度，计算列数，生成colHeightArr储存列的高度。调整浏览器道不同宽度，生成列数不同。
  + 每当一个item里的img加载时，利用绝对定位，将该item排列到高度最矮的那一列

### 其他
- 居中
  + 由于container等同于窗口宽度，而item列数计算生成并绝对定位，所以一排item加起来没有固定宽度。没法只用css居中。
  + 这里用的居中方法是：当获取到列数后，计算排列后x轴空白的宽度除以2，得到偏移值，然后在绝对定位排列item时加上这个偏移，实现居中
- 响应式
  + onresize时重新计算列数，重新排列每个item
  + 重新计算offset，重新居中
  + css加上transition过渡动画
- 防抖
  + onscroll和onresize时防抖，防止多次触发
